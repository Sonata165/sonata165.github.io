/**
 * <piano-roll> -- a dependency-free piano-roll visualiser driven by an <audio> element.
 *
 *   <audio id="my-audio" controls preload="metadata">
 *     <source src="song.mp3" type="audio/mpeg">
 *   </audio>
 *   <piano-roll src="song.json" audio="#my-audio"></piano-roll>
 *
 * The audio element is the only clock.  Every frame the roll reads
 * audio.currentTime and draws; it keeps no time state of its own, so seeking
 * and scrubbing cannot drift out of sync.
 *
 * Attributes:
 *   src          a .mid file (parsed in-page), or equivalent JSON  (required)
 *   audio        CSS selector for the <audio> element          (required)
 *   height       canvas height in CSS pixels                   (default 130)
 *   color        note colour                                   (default #007cba)
 *   active-color colour for notes sounding at the playhead     (default #e8590c)
 *   lo / hi      force a MIDI pitch range, so several rolls can share one
 *                vertical axis and stay visually comparable    (default: fit)
 *   clip         drop this quantile of pitches from each end of the axis, e.g.
 *                "0.002".  A handful of stray notes can otherwise double the
 *                pitch span and squash everything real into a thin band.
 *                Clipped notes are still drawn, pinned to the edge in
 *                off-colour, so outliers stay visible as evidence.  (default 0)
 *   duration     force the seconds the width represents, so rows comparing
 *                the same piece share one time axis even though their
 *                rendered MP3s differ in length  (default: the audio's own)
 *   ruler        "off" hides the time axis
 */
(function () {
  'use strict';

  var NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  var TICK_STEPS = [1, 2, 5, 10, 15, 20, 30, 60, 120, 300];
  var RULER_H = 15;
  var RULER_H_COMPACT = 12;   // reclaim a few pixels on short rolls
  var COMPACT_H = 110;
  var PAD_Y = 3;
  var OFF_MARK_H = 2.5;       // thickness of an off-scale marker

  /* Resolve an <audio> that may not be parsed yet.  Custom elements upgrade
     during parsing, so a control placed before its audio element in document
     order sees nothing on the first look and has to wait for the full DOM. */
  function whenAudio(selector, cb) {
    var el = selector && document.querySelector(selector);
    if (el) return cb(el);

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function () {
        var found = selector && document.querySelector(selector);
        if (found) cb(found);
        else console.error('[piano-roll] no audio element for', selector);
      }, { once: true });
    } else {
      console.error('[piano-roll] no audio element for', selector);
    }
  }

  function noteName(pitch) {
    return NOTE_NAMES[pitch % 12] + (Math.floor(pitch / 12) - 1);
  }

  function fmtTime(seconds) {
    var m = Math.floor(seconds / 60);
    var s = Math.floor(seconds % 60);
    return m + ':' + (s < 10 ? '0' : '') + s;
  }

  /* #rrggbb -> {h, s, l} so velocity can modulate lightness within one hue. */
  function hexToHsl(hex) {
    var n = parseInt(hex.replace('#', ''), 16);
    var r = ((n >> 16) & 255) / 255, g = ((n >> 8) & 255) / 255, b = (n & 255) / 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var l = (max + min) / 2, h = 0, s = 0;
    if (max !== min) {
      var d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      if (max === r) h = ((g - b) / d + (g < b ? 6 : 0));
      else if (max === g) h = (b - r) / d + 2;
      else h = (r - g) / d + 4;
      h *= 60;
    }
    return { h: h, s: s * 100, l: l * 100 };
  }

  /* Index of the first note with onset >= t (notes are sorted by onset). */
  function lowerBound(notes, t) {
    var lo = 0, hi = notes.length;
    while (lo < hi) {
      var mid = (lo + hi) >> 1;
      if (notes[mid][0] < t) lo = mid + 1; else hi = mid;
    }
    return lo;
  }

  /* ---- Standard MIDI File parsing --------------------------------------

     A direct port of tools/mid2json.py.  Parsing in the browser keeps the
     .mid file itself as the single source of truth: this site has no build
     pipeline (GitHub Pages runs Jekyll in safe mode, so custom plugins never
     run), and a precomputed sidecar would silently go stale the moment a
     .mid was replaced -- rendering the wrong transcription with no error. */

  function readVLQ(data, i) {
    var value = 0, byte;
    for (;;) {
      byte = data[i++];
      value = (value << 7) | (byte & 0x7F);
      if (!(byte & 0x80)) return [value, i];
    }
  }

  function readChunks(data) {
    var chunks = [], i = 0;
    while (i + 8 <= data.length) {
      var id = String.fromCharCode(data[i], data[i + 1], data[i + 2], data[i + 3]);
      var len = ((data[i + 4] << 24) | (data[i + 5] << 16) |
                 (data[i + 6] << 8) | data[i + 7]) >>> 0;
      chunks.push([id, data.subarray(i + 8, i + 8 + len)]);
      i += 8 + len;
    }
    return chunks;
  }

  /* One MTrk into (absoluteTick, kind, ...args) tuples. */
  function parseTrack(payload) {
    var events = [], i = 0, tick = 0, status = null, n = payload.length, r;

    while (i < n) {
      r = readVLQ(payload, i);
      tick += r[0];
      i = r[1];
      if (i >= n) break;

      var byte = payload[i];
      if (byte & 0x80) {
        status = byte;
        i++;
      }
      // else: running status, reuse the previous one
      if (status === null) break;

      if (status === 0xFF) {                    // meta event
        var metaType = payload[i];
        i += 1;
        r = readVLQ(payload, i);
        var len = r[0];
        i = r[1];
        var body = i;
        i += len;
        if (metaType === 0x51 && len === 3) {
          events.push([tick, 'tempo',
                       (payload[body] << 16) | (payload[body + 1] << 8) | payload[body + 2]]);
        } else if (metaType === 0x2F) {
          break;
        }
      } else if (status === 0xF0 || status === 0xF7) {   // sysex
        r = readVLQ(payload, i);
        i = r[1] + r[0];
      } else {
        var kind = status & 0xF0;
        var chan = status & 0x0F;
        if (kind === 0xC0 || kind === 0xD0) {   // 1-byte messages
          var arg = payload[i];
          i += 1;
          if (kind === 0xC0) events.push([tick, 'program', chan, arg]);
        } else {                                // 2-byte messages
          var a = payload[i], b = payload[i + 1];
          i += 2;
          if (kind === 0x90 && b > 0) events.push([tick, 'on', chan, a, b]);
          else if (kind === 0x80 || (kind === 0x90 && b === 0)) {
            events.push([tick, 'off', chan, a]);
          }
        }
      }
    }
    return events;
  }

  function buildTempoMap(tempoEvents, ticksPerBeat) {
    var segments = [];
    var curTick = 0, curSec = 0, usec = 500000;      // 120 bpm default
    segments.push([0, 0, usec / 1e6 / ticksPerBeat]);

    tempoEvents.sort(function (x, y) { return (x[0] - y[0]) || (x[1] - y[1]); });

    for (var k = 0; k < tempoEvents.length; k++) {
      var tick = tempoEvents[k][0];
      if (tick > curTick) {
        curSec += (tick - curTick) * (usec / 1e6 / ticksPerBeat);
        curTick = tick;
      }
      usec = tempoEvents[k][1];
      var spt = usec / 1e6 / ticksPerBeat;
      if (segments.length && segments[segments.length - 1][0] === curTick) {
        segments[segments.length - 1] = [curTick, curSec, spt];
      } else {
        segments.push([curTick, curSec, spt]);
      }
    }
    return segments;
  }

  function makeTickToSec(segments) {
    return function (tick) {
      var seg = segments[0];
      for (var k = 0; k < segments.length; k++) {
        if (segments[k][0] <= tick) seg = segments[k];
        else break;
      }
      return seg[1] + (tick - seg[0]) * seg[2];
    };
  }

  /* Uint8Array of a .mid -> {dur, lo, hi, notes:[[onset, dur, pitch, vel, program]]} */
  function parseMidi(bytes) {
    var header = null, tracks = [];
    var chunks = readChunks(bytes);
    for (var c = 0; c < chunks.length; c++) {
      if (chunks[c][0] === 'MThd') header = chunks[c][1];
      else if (chunks[c][0] === 'MTrk') tracks.push(parseTrack(chunks[c][1]));
    }
    if (!header) throw new Error('not a Standard MIDI File (no MThd chunk)');

    var division = (header[4] << 8) | header[5];
    if (division & 0x8000) throw new Error('SMPTE time division is not supported');
    var ticksPerBeat = division;

    var tempoEvents = [];
    for (var t = 0; t < tracks.length; t++) {
      for (var e = 0; e < tracks[t].length; e++) {
        if (tracks[t][e][1] === 'tempo') tempoEvents.push([tracks[t][e][0], tracks[t][e][2]]);
      }
    }
    var tickToSec = makeTickToSec(buildTempoMap(tempoEvents, ticksPerBeat));

    var raw = [];
    for (t = 0; t < tracks.length; t++) {
      var programs = {};          // channel -> program
      var open = {};              // channel:pitch -> [[tick, velocity, program], ...]
      var track = tracks[t];

      for (e = 0; e < track.length; e++) {
        var ev = track[e], tick = ev[0], kind = ev[1];
        if (kind === 'program') {
          programs[ev[2]] = ev[3];
        } else if (kind === 'on') {
          var keyOn = ev[2] + ':' + ev[3];
          var prog = ev[2] === 9 ? 128 : (programs[ev[2]] === undefined ? 0 : programs[ev[2]]);
          (open[keyOn] || (open[keyOn] = [])).push([tick, ev[4], prog]);
        } else if (kind === 'off') {
          var keyOff = ev[2] + ':' + ev[3];
          var stack = open[keyOff];
          if (stack && stack.length) {
            var n0 = stack.shift();
            if (tick > n0[0]) raw.push([n0[0], tick, ev[3], n0[1], n0[2]]);
          }
        }
      }

      // notes left hanging at end of track get a nominal length
      for (var key in open) {
        if (!Object.prototype.hasOwnProperty.call(open, key)) continue;
        var pitch = parseInt(key.split(':')[1], 10);
        for (var s = 0; s < open[key].length; s++) {
          var hung = open[key][s];
          raw.push([hung[0], hung[0] + Math.floor(ticksPerBeat / 4), pitch, hung[1], hung[2]]);
        }
      }
    }

    if (!raw.length) throw new Error('no notes found');

    raw.sort(function (x, y) {
      return (x[0] - y[0]) || (x[1] - y[1]) || (x[2] - y[2]) || (x[3] - y[3]) || (x[4] - y[4]);
    });

    var notes = [], lo = 128, hi = -1, dur = 0;
    for (var m = 0; m < raw.length; m++) {
      var t0 = tickToSec(raw[m][0]);
      var t1 = tickToSec(raw[m][1]);
      var onset = Math.round(t0 * 1000) / 1000;
      var length = Math.round((t1 - t0) * 1000) / 1000;
      notes.push([onset, length, raw[m][2], raw[m][3], raw[m][4]]);
      if (raw[m][2] < lo) lo = raw[m][2];
      if (raw[m][2] > hi) hi = raw[m][2];
      if (onset + length > dur) dur = onset + length;
    }

    return { dur: Math.round(dur * 1000) / 1000, lo: lo, hi: hi, notes: notes };
  }

  function pickTickStep(duration, width) {
    var maxTicks = Math.max(2, Math.floor(width / 70));
    for (var i = 0; i < TICK_STEPS.length; i++) {
      if (duration / TICK_STEPS[i] <= maxTicks) return TICK_STEPS[i];
    }
    return TICK_STEPS[TICK_STEPS.length - 1];
  }

  var STYLE = [
    ':host { display: block; position: relative; margin: 0.2em 0 0; }',
    'canvas { display: block; width: 100%; border: 1px solid #e8e8e8;',
    '         border-radius: 4px; background: #fff; cursor: pointer;',
    '         touch-action: manipulation; }',
    ':host(:focus) { outline: none; }',
    ':host(:focus-visible) canvas { border-color: #007cba; }',
    '.tip { position: absolute; pointer-events: none; opacity: 0;',
    '       transition: opacity 90ms linear; background: rgba(28,28,30,0.92);',
    '       color: #fff; font: 11px/1.35 -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;',
    '       padding: 3px 6px; border-radius: 3px; white-space: nowrap;',
    '       transform: translate(-50%, -130%); z-index: 5; }',
    '.tip.on { opacity: 1; }'
  ].join('\n');

  class PianoRoll extends HTMLElement {
    connectedCallback() {
      if (this._ready) return;
      this._ready = true;

      var root = this.attachShadow({ mode: 'open' });
      var style = document.createElement('style');
      style.textContent = STYLE;
      this._canvas = document.createElement('canvas');
      this._tip = document.createElement('div');
      this._tip.className = 'tip';
      root.appendChild(style);
      root.appendChild(this._canvas);
      root.appendChild(this._tip);

      this.tabIndex = 0;
      this.height = parseInt(this.getAttribute('height'), 10) || 130;
      this.hsl = hexToHsl(this.getAttribute('color') || '#007cba');
      this.activeColor = this.getAttribute('active-color') || '#e8590c';
      this.offColor = this.getAttribute('off-color') || '#d6336c';
      this.clipQ = parseFloat(this.getAttribute('clip')) || 0;
      this.fixedDuration = parseFloat(this.getAttribute('duration')) || 0;
      this.showRuler = this.getAttribute('ruler') !== 'off';
      this.canvas = this._canvas;
      this.base = document.createElement('canvas');

      this.audio = null;
      this.data = null;
      this.duration = this.fixedDuration;
      this._playing = false;

      var self = this;

      this._onFrame = this._onFrame.bind(this);
      this._bindPointer();
      whenAudio(this.getAttribute('audio'), function (el) {
        self.audio = el;
        self._bindAudio();
        self._draw();
      });

      new ResizeObserver(function () { self._layout(); }).observe(this);
      this._watchScale();

      fetch(this.getAttribute('src'))
        .then(function (r) {
          if (!r.ok) throw new Error('HTTP ' + r.status);
          return r.arrayBuffer();
        })
        .then(function (buf) {
          // accept a .mid directly, or pre-parsed JSON in the same shape
          var bytes = new Uint8Array(buf);
          var isMidi = bytes[0] === 0x4D && bytes[1] === 0x54 &&
                       bytes[2] === 0x68 && bytes[3] === 0x64;
          var data = isMidi ? parseMidi(bytes)
                            : JSON.parse(new TextDecoder().decode(bytes));
          self.data = data;
          var range = self._pitchRange(data);
          self.lo = range[0];
          self.hi = range[1];
          self.clipped = range[2];
          self.maxNoteDur = data.notes.reduce(function (m, n) {
            return n[1] > m ? n[1] : m;
          }, 0);
          self._layout();
        })
        .catch(function (err) {
          console.error('[piano-roll] could not load', self.getAttribute('src'), err);
        });
    }

    /* Decide the vertical axis: explicit lo/hi win, then quantile clipping,
       then a snug fit around every note. */
    _pitchRange(data) {
      var lo = parseInt(this.getAttribute('lo'), 10);
      var hi = parseInt(this.getAttribute('hi'), 10);
      if (!isNaN(lo) && !isNaN(hi)) return [lo, hi, lo > data.lo || hi < data.hi];

      if (this.clipQ > 0) {
        var pitches = data.notes.map(function (n) { return n[2]; }).sort(function (a, b) {
          return a - b;
        });
        var last = pitches.length - 1;
        var qlo = pitches[Math.min(last, Math.floor(this.clipQ * pitches.length))];
        var qhi = pitches[Math.min(last, Math.floor((1 - this.clipQ) * pitches.length))];
        if (isNaN(lo)) lo = qlo - 1;
        if (isNaN(hi)) hi = qhi + 1;
        return [lo, hi, lo > data.lo || hi < data.hi];
      }

      if (isNaN(lo)) lo = data.lo - 1;
      if (isNaN(hi)) hi = data.hi + 1;
      return [lo, hi, lo > data.lo || hi < data.hi];
    }

    /* The canvas backing store is sized in device pixels, so it has to be
       rebuilt whenever devicePixelRatio changes -- which is exactly what
       browser zoom does.  A ResizeObserver alone misses this: .wrapper is
       capped at a fixed 740px, so on a wide window zooming does not change
       the element's CSS box at all and nothing fires. */
    _watchScale() {
      var self = this;
      var mq = null;

      function onChange() {
        self._layout();
        arm();               // the old query no longer matches; re-arm at the new ratio
      }

      function arm() {
        if (mq) mq.removeEventListener('change', onChange);
        mq = window.matchMedia('(resolution: ' + (window.devicePixelRatio || 1) + 'dppx)');
        mq.addEventListener('change', onChange);
      }

      arm();
      window.addEventListener('resize', function () { self._layout(); });
    }

    disconnectedCallback() {
      if (this._raf) cancelAnimationFrame(this._raf);
    }

    /* ---- the audio element is the clock -------------------------------- */

    _bindAudio() {
      var self = this;
      var syncDuration = function () {
        if (self.fixedDuration) return;      // pinned to a shared axis
        if (self.audio.duration && isFinite(self.audio.duration)) {
          // Prefer the recording's own length: note onsets are absolute
          // seconds into that recording, so this keeps the x-axis honest.
          if (self.duration !== self.audio.duration) {
            self.duration = self.audio.duration;
            self._layout();
          }
        }
      };
      syncDuration();
      this.audio.addEventListener('loadedmetadata', syncDuration);
      this.audio.addEventListener('durationchange', syncDuration);

      this.audio.addEventListener('play', function () {
        self._playing = true;
        if (!self._raf) self._raf = requestAnimationFrame(self._onFrame);
      });
      ['pause', 'ended', 'seeked', 'seeking', 'timeupdate'].forEach(function (evt) {
        self.audio.addEventListener(evt, function () {
          if (evt === 'pause' || evt === 'ended') self._playing = false;
          self._draw();          // a single repaint covers scrubbing while paused
        });
      });
    }

    _onFrame() {
      this._raf = 0;
      this._draw();
      if (this._playing) this._raf = requestAnimationFrame(this._onFrame);
    }

    /* ---- interaction --------------------------------------------------- */

    _bindPointer() {
      var self = this;

      this.canvas.addEventListener('click', function (e) {
        if (!self.audio || !self.duration) return;
        var rect = self.canvas.getBoundingClientRect();
        var frac = (e.clientX - rect.left) / rect.width;
        self.audio.currentTime = Math.max(0, Math.min(self.duration, frac * self.duration));
      });

      this.canvas.addEventListener('mousemove', function (e) {
        if (!self.data || !self.duration) return;
        var rect = self.canvas.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var t = (x / rect.width) * self.duration;
        var hit = self._noteAt(t, y);
        self._tip.textContent = hit
          ? noteName(hit[2]) + (self._offscale(hit[2]) ? ' (off scale)' : '') +
            '  ·  ' + fmtTime(hit[0]) + '  ·  vel ' + hit[3]
          : fmtTime(t);
        self._tip.style.left = x + 'px';
        self._tip.style.top = y + 'px';
        self._tip.classList.add('on');
      });

      this.canvas.addEventListener('mouseleave', function () {
        self._tip.classList.remove('on');
      });

      this.addEventListener('keydown', function (e) {
        if (!self.audio || !self.duration) return;
        var step = e.shiftKey ? 1 : 5;
        if (e.key === 'ArrowLeft') {
          self.audio.currentTime = Math.max(0, self.audio.currentTime - step);
        } else if (e.key === 'ArrowRight') {
          self.audio.currentTime = Math.min(self.duration, self.audio.currentTime + step);
        } else if (e.key === ' ') {
          if (self.audio.paused) self.audio.play(); else self.audio.pause();
        } else {
          return;
        }
        e.preventDefault();
      });
    }

    _noteAt(t, y) {
      var geom = this._geom;
      if (!geom) return null;
      // y arrives in CSS pixels; the geometry is in device pixels
      var pitch = Math.round(this.hi - (y * geom.dpr - geom.topD) / geom.cellD);
      var notes = this.data.notes;
      var i = lowerBound(notes, t - this.maxNoteDur);
      for (; i < notes.length && notes[i][0] <= t; i++) {
        var p = notes[i][2];
        var near = Math.abs(p - pitch) <= 1 ||
                   (pitch >= this.hi && p > this.hi) ||
                   (pitch <= this.lo && p < this.lo);
        if (near && notes[i][0] + notes[i][1] >= t) return notes[i];
      }
      return null;
    }

    /* ---- rendering ------------------------------------------------------

       Everything below works in whole DEVICE pixels, not CSS pixels.  At this
       zoom level 82% of notes are under two CSS pixels wide, so any fractional
       coordinate turns a note into a two-column grey smear.  Integer device
       coordinates with fillRect give edges as hard as text. */

    _layout() {
      if (!this.data) return;
      var w = this.clientWidth;
      if (!w) return;
      if (!this.duration) this.duration = this.data.dur;

      var h = this.height;
      var dpr = window.devicePixelRatio || 1;
      var rulerH = h <= COMPACT_H ? RULER_H_COMPACT : RULER_H;
      var bottom = this.showRuler ? rulerH : PAD_Y;

      // The backing store is an integer number of device pixels and the CSS
      // box is sized to exactly that many, so the browser never rescales the
      // bitmap.  Fractional ratios are common -- browser zoom at 110% on a
      // retina screen gives 2.2 -- and any rescale softens every edge.
      var bw = Math.round(w * dpr);
      var bh = Math.round(h * dpr);
      [this.canvas, this.base].forEach(function (c) {
        c.width = bw;
        c.height = bh;
      });
      this.canvas.style.width = (bw / dpr) + 'px';
      this.canvas.style.height = (bh / dpr) + 'px';

      var topD = Math.round(PAD_Y * dpr);
      var rollHD = bh - topD - Math.round(bottom * dpr);
      var cellD = rollHD / (this.hi - this.lo + 1);

      // Bar thickness in whole device pixels, always leaving a gap of at least
      // one pixel so neighbouring semitones stay distinguishable.
      var noteD = Math.max(1, Math.round(cellD * 0.82));
      if (cellD >= 2) noteD = Math.min(noteD, Math.max(1, Math.round(cellD) - 1));

      this._geom = {
        dpr: dpr, w: w, h: h, bw: bw, bh: bh,
        topD: topD,
        rollHD: rollHD,
        cellD: cellD,
        noteD: noteD,
        offD: Math.max(noteD, Math.round(OFF_MARK_H * dpr)),
        minWD: Math.max(2, Math.round(dpr)),
        hair: Math.max(1, Math.round(dpr / 2)),
        lineD: Math.max(1, Math.round(dpr)),
        xOfD: bw / this.duration,
        radiusD: Math.min(Math.round(1.5 * dpr), Math.floor(noteD / 2))
      };

      this._renderBase();
      this._draw();
    }

    /* Static layer: grid, ruler and every note.  Drawn once per resize. */
    _renderBase() {
      var g = this._geom;
      var ctx = this.base.getContext('2d');
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.imageSmoothingEnabled = false;
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, g.bw, g.bh);

      // horizontal reference lines at each C
      ctx.fillStyle = '#f1f1f1';
      for (var p = Math.ceil(this.lo / 12) * 12; p <= this.hi; p += 12) {
        ctx.fillRect(0, Math.round(g.topD + (this.hi - p + 1) * g.cellD), g.bw, g.hair);
      }

      // time grid
      var step = pickTickStep(this.duration, g.w);
      var t;
      ctx.fillStyle = '#f4f4f4';
      for (t = step; t < this.duration; t += step) {
        ctx.fillRect(Math.round(t * g.xOfD), g.topD, g.hair, g.rollHD);
      }

      if (this.showRuler) {
        ctx.fillStyle = '#aaa';
        ctx.font = Math.round((g.h <= COMPACT_H ? 9 : 10) * g.dpr) +
                   'px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        for (t = step; t < this.duration; t += step) {
          ctx.fillText(fmtTime(t), Math.round(t * g.xOfD),
                       g.topD + g.rollHD + Math.round(2 * g.dpr));
        }
      }

      // notes -- velocity drives lightness so the roll reads as one material
      var notes = this.data.notes;
      for (var i = 0; i < notes.length; i++) {
        var n = notes[i];
        ctx.fillStyle = this._offscale(n[2]) ? this.offColor : this._noteColor(n[3]);
        this._fillNote(ctx, n);
      }

      // hairlines marking where the axis was cut, so pinned notes read as
      // "off the top/bottom" rather than as real pitches
      if (this.clipped) {
        ctx.fillStyle = 'rgba(214,51,105,0.3)';
        var dash = Math.round(2 * g.dpr);
        var ys = [g.topD + g.offD, g.topD + g.rollHD - g.offD - g.hair];
        for (var k = 0; k < ys.length; k++) {
          for (var x = 0; x < g.bw; x += dash * 2) {
            ctx.fillRect(x, ys[k], dash, g.hair);
          }
        }
      }
    }

    _offscale(pitch) {
      return pitch > this.hi ? 1 : (pitch < this.lo ? -1 : 0);
    }

    _noteColor(velocity) {
      var l = this.hsl.l + (1 - Math.min(127, velocity) / 127) * 26;
      return 'hsl(' + this.hsl.h.toFixed(0) + ',' + this.hsl.s.toFixed(0) + '%,' + l.toFixed(0) + '%)';
    }

    /* One note, snapped to the device pixel grid on both axes.  Rounding x
       costs at most half a device pixel of timing -- 0.07s here, well inside
       the 0.14s a single pixel already represents -- and buys a hard edge on
       all four sides. */
    _fillNote(ctx, n) {
      var g = this._geom;
      var off = this._offscale(n[2]);
      var x = Math.round(n[0] * g.xOfD);
      var w = Math.max(g.minWD, Math.round(n[1] * g.xOfD));
      var h = off ? g.offD : g.noteD;
      var y;

      if (off > 0) {
        y = g.topD;
      } else if (off < 0) {
        y = g.topD + g.rollHD - h;
      } else {
        y = Math.round(g.topD + (this.hi - n[2]) * g.cellD + (g.cellD - g.noteD) / 2);
      }

      // rounding a bar only a few pixels tall just blurs it away again
      if (ctx.roundRect && g.radiusD >= 2 && w > g.radiusD * 2) {
        ctx.beginPath();
        ctx.roundRect(x, y, w, h, g.radiusD);
        ctx.fill();
      } else {
        ctx.fillRect(x, y, w, h);
      }
    }

    /* Per-frame layer: blit the static roll, then the playhead and whatever
       is sounding right now. */
    _draw() {
      var g = this._geom;
      if (!g || !this.data) return;

      var ctx = this.canvas.getContext('2d');
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(this.base, 0, 0);      // identical dimensions: no resample

      var now = this.audio ? this.audio.currentTime : 0;
      var px = Math.max(0, Math.min(g.bw, Math.round(now * g.xOfD)));

      // faint wash over the part already played
      if (px > 0) {
        ctx.fillStyle = 'rgba(0,124,186,0.045)';
        ctx.fillRect(0, g.topD, px, g.rollHD);
      }

      // notes sounding at the playhead
      var notes = this.data.notes;
      for (var i = lowerBound(notes, now - this.maxNoteDur); i < notes.length; i++) {
        if (notes[i][0] > now) break;
        if (notes[i][0] + notes[i][1] >= now) {
          ctx.fillStyle = this._offscale(notes[i][2]) ? '#f06595' : this.activeColor;
          this._fillNote(ctx, notes[i]);
        }
      }

      // playhead
      ctx.fillStyle = 'rgba(20,20,20,0.55)';
      ctx.fillRect(Math.min(px, g.bw - g.lineD), g.topD, g.lineD, g.rollHD);
    }
  }

  /**
   * <play-toggle for="#some-audio"> -- a round play/pause button for an audio
   * element that is not itself visible on the page.  Deliberately matches the
   * .qs-btn circles in the Quality Showcase table so the page keeps one idiom.
   */
  var TOGGLE_STYLE = [
    ':host { display: inline-block; line-height: 0; }',
    'button { width: 26px; height: 26px; border-radius: 50%; border: 1px solid #bbb;',
    '         background: #fff; cursor: pointer; padding: 0; color: #333;',
    '         display: flex; align-items: center; justify-content: center; }',
    'button svg { width: 16px; height: 16px; display: block; fill: currentColor; }',
    'button:hover { border-color: #007cba; color: #007cba; }',
    'button.playing { background: #007cba; border-color: #007cba; color: #fff; }',
    'button:focus-visible { outline: 2px solid #007cba; outline-offset: 2px; }'
  ].join('\n');

  /* The glyphs fill most of the 24-unit viewBox rather than floating in the
     middle of it -- the earlier shapes spanned only 10 units, so at any icon
     size the drawn triangle came out less than half as wide as it looked.
     Triangle centroid sits at x=12.33 against a 12 centre: a triangle read as
     centred needs that slight rightward bias.  The pause bars are exactly
     symmetrical about 12. */
  var ICON_PLAY = '<svg viewBox="0 0 24 24" aria-hidden="true">' +
                  '<polygon points="8,4 21,12 8,20"/></svg>';
  var ICON_PAUSE = '<svg viewBox="0 0 24 24" aria-hidden="true">' +
                   '<rect x="7" y="4" width="4" height="16" rx="0.8"/>' +
                   '<rect x="13" y="4" width="4" height="16" rx="0.8"/></svg>';

  /* Every audio element driven by a <play-toggle>.  Eight rows of the same
     piece playing over each other is useless, so starting one stops the rest
     -- the same rule the Quality Showcase table already follows. */
  var TRANSPORTS = [];

  function soloize(audio) {
    if (TRANSPORTS.indexOf(audio) !== -1) return;
    TRANSPORTS.push(audio);
    audio.addEventListener('play', function () {
      for (var i = 0; i < TRANSPORTS.length; i++) {
        if (TRANSPORTS[i] !== audio) TRANSPORTS[i].pause();
      }
    });
  }

  class PlayToggle extends HTMLElement {
    connectedCallback() {
      if (this._ready) return;
      this._ready = true;

      var root = this.attachShadow({ mode: 'open' });
      var style = document.createElement('style');
      style.textContent = TOGGLE_STYLE;
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.innerHTML = ICON_PLAY;
      btn.setAttribute('aria-label', 'Play');
      root.appendChild(style);
      root.appendChild(btn);

      whenAudio(this.getAttribute('for'), function (audio) {
        soloize(audio);

        function sync() {
          var playing = !audio.paused && !audio.ended;
          btn.innerHTML = playing ? ICON_PAUSE : ICON_PLAY;
          btn.classList.toggle('playing', playing);
          btn.setAttribute('aria-label', playing ? 'Pause' : 'Play');
        }

        btn.addEventListener('click', function () {
          if (audio.paused) audio.play(); else audio.pause();
        });
        // reflect state changed elsewhere -- the roll's spacebar, another row
        ['play', 'pause', 'ended'].forEach(function (evt) {
          audio.addEventListener(evt, sync);
        });
        sync();
      });
    }
  }

  if (!window.customElements.get('play-toggle')) {
    window.customElements.define('play-toggle', PlayToggle);
  }

  window.PianoRollMidi = { parse: parseMidi };

  if (!window.customElements.get('piano-roll')) {
    window.customElements.define('piano-roll', PianoRoll);
  }
})();
