#!/usr/bin/env python3
"""Dump a Standard MIDI File as JSON, for inspection.

NOT part of the build.  The site ships .mid files and parses them in-page
(see the parseMidi port in assets/js/piano-roll.js), so the .mid stays the
single source of truth and cannot go stale against a derived sidecar.  This
script is the reference implementation that port was checked against, and is
handy for eyeballing note counts and pitch ranges from the shell.

No third-party dependencies -- it parses the SMF byte format directly.

    python3 tools/mid2json.py input.mid [output.json]

Output shape:
    {"dur": 243.117, "lo": 40, "hi": 88,
     "notes": [[onset, duration, pitch, velocity, program], ...]}

Times are seconds (tempo map applied), rounded to 3 decimals.  Drums (channel
10) are emitted with program 128.
"""

import json
import os
import sys


def read_vlq(data, i):
    """Read a MIDI variable-length quantity; return (value, next_index)."""
    value = 0
    while True:
        byte = data[i]
        i += 1
        value = (value << 7) | (byte & 0x7F)
        if not byte & 0x80:
            return value, i


def read_chunks(data):
    """Yield (chunk_id, payload) for each top-level chunk."""
    i = 0
    while i + 8 <= len(data):
        cid = data[i:i + 4]
        length = int.from_bytes(data[i + 4:i + 8], "big")
        yield cid, data[i + 8:i + 8 + length]
        i += 8 + length


def parse_track(payload):
    """Parse one MTrk into (absolute_tick, kind, *args) tuples."""
    events = []
    i = 0
    tick = 0
    status = None
    n = len(payload)

    while i < n:
        delta, i = read_vlq(payload, i)
        tick += delta
        if i >= n:
            break

        byte = payload[i]
        if byte & 0x80:
            status = byte
            i += 1
        # else: running status, reuse previous `status`

        if status is None:
            break

        if status == 0xFF:                      # meta event
            meta_type = payload[i]
            i += 1
            length, i = read_vlq(payload, i)
            body = payload[i:i + length]
            i += length
            if meta_type == 0x51 and length == 3:
                events.append((tick, "tempo", int.from_bytes(body, "big")))
            elif meta_type == 0x2F:
                break
        elif status in (0xF0, 0xF7):            # sysex
            length, i = read_vlq(payload, i)
            i += length
        else:
            kind = status & 0xF0
            chan = status & 0x0F
            if kind in (0xC0, 0xD0):            # 1-byte messages
                arg = payload[i]
                i += 1
                if kind == 0xC0:
                    events.append((tick, "program", chan, arg))
            else:                               # 2-byte messages
                a, b = payload[i], payload[i + 1]
                i += 2
                if kind == 0x90 and b > 0:
                    events.append((tick, "on", chan, a, b))
                elif kind == 0x80 or (kind == 0x90 and b == 0):
                    events.append((tick, "off", chan, a))

    return events


def build_tempo_map(tempo_events, ticks_per_beat):
    """Return a list of (tick, seconds_at_tick, seconds_per_tick) segments."""
    segments = []
    cur_tick, cur_sec, usec = 0, 0.0, 500000     # 120 bpm default
    segments.append((0, 0.0, usec / 1e6 / ticks_per_beat))

    for tick, new_usec in sorted(tempo_events):
        if tick > cur_tick:
            cur_sec += (tick - cur_tick) * (usec / 1e6 / ticks_per_beat)
            cur_tick = tick
        usec = new_usec
        spt = usec / 1e6 / ticks_per_beat
        if segments and segments[-1][0] == cur_tick:
            segments[-1] = (cur_tick, cur_sec, spt)
        else:
            segments.append((cur_tick, cur_sec, spt))

    return segments


def make_tick_to_sec(segments):
    def tick_to_sec(tick):
        seg = segments[0]
        for candidate in segments:
            if candidate[0] <= tick:
                seg = candidate
            else:
                break
        return seg[1] + (tick - seg[0]) * seg[2]
    return tick_to_sec


def convert(path):
    with open(path, "rb") as handle:
        data = handle.read()

    header = None
    tracks = []
    for cid, payload in read_chunks(data):
        if cid == b"MThd":
            header = payload
        elif cid == b"MTrk":
            tracks.append(parse_track(payload))

    if header is None:
        raise ValueError("not a Standard MIDI File (no MThd chunk)")

    division = int.from_bytes(header[4:6], "big")
    if division & 0x8000:
        raise ValueError("SMPTE time division is not supported")
    ticks_per_beat = division

    tempo_events = [(t, v) for track in tracks for (t, kind, v) in
                    ((e[0], e[1], e[2]) for e in track if e[1] == "tempo")]
    tick_to_sec = make_tick_to_sec(build_tempo_map(tempo_events, ticks_per_beat))

    notes = []
    for track in tracks:
        programs = {}          # channel -> program
        open_notes = {}        # (channel, pitch) -> [(tick, velocity, program), ...]

        for event in track:
            tick, kind = event[0], event[1]
            if kind == "program":
                programs[event[2]] = event[3]
            elif kind == "on":
                _, _, chan, pitch, vel = event
                prog = 128 if chan == 9 else programs.get(chan, 0)
                open_notes.setdefault((chan, pitch), []).append((tick, vel, prog))
            elif kind == "off":
                _, _, chan, pitch = event
                stack = open_notes.get((chan, pitch))
                if stack:
                    start, vel, prog = stack.pop(0)
                    if tick > start:
                        notes.append((start, tick, pitch, vel, prog))

        # notes left hanging at end of track: give them a nominal length
        for (chan, pitch), stack in open_notes.items():
            for start, vel, prog in stack:
                notes.append((start, start + ticks_per_beat // 4, pitch, vel, prog))

    if not notes:
        raise ValueError("no notes found in %s" % path)

    notes.sort()
    out_notes = []
    for start, end, pitch, vel, prog in notes:
        t0 = tick_to_sec(start)
        t1 = tick_to_sec(end)
        out_notes.append([round(t0, 3), round(t1 - t0, 3), pitch, vel, prog])

    pitches = [n[2] for n in out_notes]
    return {
        "dur": round(max(n[0] + n[1] for n in out_notes), 3),
        "lo": min(pitches),
        "hi": max(pitches),
        "notes": out_notes,
    }


def main(argv):
    if len(argv) < 2:
        print(__doc__.strip())
        return 1

    src = argv[1]
    dst = argv[2] if len(argv) > 2 else os.path.splitext(src)[0] + ".json"

    result = convert(src)
    with open(dst, "w") as handle:
        json.dump(result, handle, separators=(",", ":"))

    print("%s -> %s  (%d notes, %.1fs, pitch %d-%d, %.1f KB)" % (
        os.path.basename(src), os.path.basename(dst), len(result["notes"]),
        result["dur"], result["lo"], result["hi"],
        os.path.getsize(dst) / 1024.0))
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
