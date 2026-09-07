/**
 * Dependency-free audio visualizers driven by an <audio> element:
 * <piano-roll> for a transcription, <wave-form> for the recording itself, and
 * <play-toggle> for a transport button when the <audio> is not on the page.
 * Each is documented above its own class; the piano roll follows.
 *
 * <piano-roll> -- a piano-roll visualizer driven by an <audio> element.
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

  /* ---- shared plumbing -------------------------------------------------

     <piano-roll> and <wave-form> are the same widget over different material:
     a canvas whose x-axis is time, clocked by an <audio> element it does not
     own.  Everything that follows from that -- the clock, seeking, and keeping
     the backing store at the right device-pixel scale -- lives here so the two
     stay in step.  Each view supplies _layout() and _draw(). */

  /* The audio element is the only clock.  Every frame the view reads
     audio.currentTime and draws; it keeps no time state of its own, so seeking
     and scrubbing cannot drift out of sync. */
  function bindAudioClock(view) {
    var syncDuration = function () {
      if (view.fixedDuration) return;      // pinned to a shared axis
      if (view.audio.duration && isFinite(view.audio.duration)) {
        // Prefer the recording's own length: note onsets are absolute
        // seconds into that recording, so this keeps the x-axis honest.
        if (view.duration !== view.audio.duration) {
          view.duration = view.audio.duration;
          view._layout();
        }
      }
    };
    syncDuration();
    view.audio.addEventListener('loadedmetadata', syncDuration);
    view.audio.addEventListener('durationchange', syncDuration);

    view.audio.addEventListener('play', function () {
      view._playing = true;
      if (!view._raf) view._raf = requestAnimationFrame(view._onFrame);
    });
    ['pause', 'ended', 'seeked', 'seeking', 'timeupdate'].forEach(function (evt) {
      view.audio.addEventListener(evt, function () {
        if (evt === 'pause' || evt === 'ended') view._playing = false;
        view._draw();          // a single repaint covers scrubbing while paused
      });
    });
  }

  /* Click anywhere on the canvas to seek there; arrows nudge, space toggles. */
  function bindSeek(view) {
    view.canvas.addEventListener('click', function (e) {
      if (!view.audio || !view.duration) return;
      var rect = view.canvas.getBoundingClientRect();
      var frac = (e.clientX - rect.left) / rect.width;
      view.audio.currentTime = Math.max(0, Math.min(view.duration, frac * view.duration));
    });

    view.addEventListener('keydown', function (e) {
      if (!view.audio || !view.duration) return;
      var step = e.shiftKey ? 1 : 5;
      if (e.key === 'ArrowLeft') {
        view.audio.currentTime = Math.max(0, view.audio.currentTime - step);
      } else if (e.key === 'ArrowRight') {
        view.audio.currentTime = Math.min(view.duration, view.audio.currentTime + step);
      } else if (e.key === ' ') {
        if (view.audio.paused) view.audio.play(); else view.audio.pause();
      } else {
        return;
      }
      e.preventDefault();
    });
  }

  /* The canvas backing store is sized in device pixels, so it has to be
     rebuilt whenever devicePixelRatio changes -- which is exactly what
     browser zoom does.  A ResizeObserver alone misses this: .wrapper is
     capped at a fixed 740px, so on a wide window zooming does not change
     the element's CSS box at all and nothing fires. */
  function watchScale(view) {
    var mq = null;

    function onChange() {
      view._layout();
      arm();               // the old query no longer matches; re-arm at the new ratio
    }

    function arm() {
      if (mq) mq.removeEventListener('change', onChange);
      mq = window.matchMedia('(resolution: ' + (window.devicePixelRatio || 1) + 'dppx)');
      mq.addEventListener('change', onChange);
    }

    arm();
    window.addEventListener('resize', function () { view._layout(); });
  }

  /* Background, vertical time grid and the ruler labels: the frame both views
     draw their material into. */
  function paintTimeAxis(view, ctx) {
    var g = view._geom;
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, g.bw, g.bh);

    var step = pickTickStep(view.duration, g.w);
    var t;
    ctx.fillStyle = '#f4f4f4';
    for (t = step; t < view.duration; t += step) {
      ctx.fillRect(Math.round(t * g.xOfD), g.topD, g.hair, g.rollHD);
    }

    if (view.showRuler) {
      ctx.fillStyle = '#aaa';
      ctx.font = axisFont(g);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      for (t = step; t < view.duration; t += step) {
        ctx.fillText(fmtTime(t), Math.round(t * g.xOfD),
                     g.topD + g.rollHD + Math.round(2 * g.dpr));
      }
    }
  }

  function axisFont(g) {
    return Math.round((g.h <= COMPACT_H ? 9 : 10) * g.dpr) +
           'px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
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
        bindAudioClock(self);
        self._draw();
      });

      new ResizeObserver(function () { self._layout(); }).observe(this);
      watchScale(this);

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

    disconnectedCallback() {
      if (this._raf) cancelAnimationFrame(this._raf);
    }

    /* ---- the audio element is the clock -------------------------------- */

    _onFrame() {
      this._raf = 0;
      this._draw();
      if (this._playing) this._raf = requestAnimationFrame(this._onFrame);
    }

    /* ---- interaction --------------------------------------------------- */

    _bindPointer() {
      var self = this;
      bindSeek(this);

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
      paintTimeAxis(this, ctx);

      // horizontal reference lines at each C
      ctx.fillStyle = '#f1f1f1';
      for (var p = Math.ceil(this.lo / 12) * 12; p <= this.hi; p += 12) {
        ctx.fillRect(0, Math.round(g.topD + (this.hi - p + 1) * g.cellD), g.bw, g.hair);
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
   * <wave-form> -- the same visualizer as <piano-roll>, but drawn from a
   * recording instead of a transcription, so a row of audio sits on the same
   * axis as the rows of MIDI beneath it.
   *
   *   <audio id="my-audio" preload="metadata">
   *     <source src="song.mp3" type="audio/mpeg">
   *   </audio>
   *   <wave-form src="song.mp3" audio="#my-audio" duration="158.1"></wave-form>
   *
   * Peaks are measured from the mp3 in the browser rather than shipped as a
   * picture, for the same reason the rolls parse their own .mid: a screenshot
   * has no playhead, cannot be seeked, and silently goes stale the moment the
   * audio behind it is replaced.  The file is decoded once and cached per URL,
   * and the fetch is deferred until the element is near the viewport -- it is
   * megabytes, and a reader who never scrolls this far should not pay for it.
   *
   * Attributes:
   *   src          audio file to analyse   (default: the audio element's own)
   *   audio        CSS selector for the <audio> element          (required)
   *   height       canvas height in CSS pixels                   (default 130)
   *   color        waveform colour                               (default #007cba)
   *   active-color colour of the slice under the playhead        (default #e8590c)
   *   duration     force the seconds the width represents, so this row shares
   *                the rolls' time axis                (default: the audio's own)
   *   ruler        "off" hides the time axis
   */

  /* Resolution of the stored envelope, in buckets per second.  Columns are
     ~0.1s wide at this page's width, so 20ms buckets leave several per column
     and survive a resize or a zoom without another decode. */
  var PEAKS_PER_SEC = 50;

  /* decodeAudioData resamples to the context's rate, and an envelope does not
     need full bandwidth: asking for 11 kHz cuts the transient Float32 arrays
     by four with no visible difference at ~1000 samples per drawn column. */
  var ANALYSIS_RATE = 11025;

  var PEAK_CACHE = {};        // url -> Promise of an envelope

  function decodeAudio(ctx, buf) {
    return new Promise(function (resolve, reject) {
      // older Safari only has the callback form and returns undefined
      var p = ctx.decodeAudioData(buf, resolve, reject);
      if (p && p.then) p.then(resolve, reject);
    });
  }

  /* Channel-averaged min / max / mean-square per bucket.  Keeping the extremes
     as well as the RMS is what makes the drawn wave read like a wave: the
     envelope shows the transients, the RMS body shows where the energy is. */
  function extractPeaks(buffer) {
    var n = buffer.length;
    var per = Math.max(1, Math.round(buffer.sampleRate / PEAKS_PER_SEC));
    var count = Math.ceil(n / per);
    var min = new Float32Array(count);
    var max = new Float32Array(count);
    var ms = new Float32Array(count);
    var chans = [];
    var c;
    for (c = 0; c < buffer.numberOfChannels; c++) chans.push(buffer.getChannelData(c));
    var nch = chans.length || 1;
    var peak = 0;

    for (var b = 0; b < count; b++) {
      var start = b * per;
      var end = Math.min(n, start + per);
      var lo = 0, hi = 0, sum = 0;
      for (var i = start; i < end; i++) {
        var v = 0;
        for (c = 0; c < nch; c++) v += chans[c][i];
        v /= nch;
        if (v < lo) lo = v;
        if (v > hi) hi = v;
        sum += v * v;
      }
      min[b] = lo;
      max[b] = hi;
      ms[b] = end > start ? sum / (end - start) : 0;
      if (-lo > peak) peak = -lo;
      if (hi > peak) peak = hi;
    }

    return {
      min: min, max: max, ms: ms, count: count, peak: peak,
      spb: per / buffer.sampleRate,             // seconds per bucket
      duration: n / buffer.sampleRate
    };
  }

  function loadPeaks(url) {
    if (PEAK_CACHE[url]) return PEAK_CACHE[url];

    var Offline = window.OfflineAudioContext || window.webkitOfflineAudioContext;
    var Online = window.AudioContext || window.webkitAudioContext;
    var ctx;
    try {
      ctx = new Offline(1, 1, ANALYSIS_RATE);
    } catch (e) {
      if (!Online) return Promise.reject(new Error('no Web Audio'));
      ctx = new Online();                       // decodes at the device rate
    }

    PEAK_CACHE[url] = fetch(url)
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.arrayBuffer();
      })
      .then(function (buf) { return decodeAudio(ctx, buf); })
      .then(function (audioBuffer) {
        var peaks = extractPeaks(audioBuffer);
        // the decoded buffer is tens of megabytes; the envelope is ~100 KB
        if (ctx.close) { try { ctx.close(); } catch (e) { /* offline ctx */ } }
        return peaks;
      });

    return PEAK_CACHE[url];
  }

  class WaveForm extends HTMLElement {
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
      this.fixedDuration = parseFloat(this.getAttribute('duration')) || 0;
      this.showRuler = this.getAttribute('ruler') !== 'off';
      this.canvas = this._canvas;
      this.base = document.createElement('canvas');

      this.audio = null;
      this.peaks = null;
      this.duration = this.fixedDuration;
      this.status = 'reading waveform…';
      this._playing = false;

      var self = this;

      this._onFrame = this._onFrame.bind(this);
      this._bindPointer();
      bindSeek(this);
      whenAudio(this.getAttribute('audio'), function (el) {
        self.audio = el;
        bindAudioClock(self);
        self._layout();
        if (self._pending) self._load();     // was waiting on the audio's src
      });

      new ResizeObserver(function () { self._layout(); }).observe(this);
      watchScale(this);
      this._layout();
      this._whenVisible(function () { self._load(); });
    }

    disconnectedCallback() {
      if (this._raf) cancelAnimationFrame(this._raf);
      if (this._io) this._io.disconnect();
    }

    /* ---- loading ------------------------------------------------------- */

    _src() {
      return this.getAttribute('src') ||
             (this.audio && (this.audio.currentSrc || this.audio.src)) || '';
    }

    _whenVisible(cb) {
      if (!('IntersectionObserver' in window)) return cb();
      var self = this;
      this._io = new IntersectionObserver(function (entries) {
        for (var i = 0; i < entries.length; i++) {
          if (entries[i].isIntersecting) {
            self._io.disconnect();
            self._io = null;
            cb();
            return;
          }
        }
      }, { rootMargin: '300px' });
      this._io.observe(this);
    }

    _load() {
      if (this._loading) return;
      var url = this._src();
      if (!url) { this._pending = true; return; }   // retry once the audio resolves
      this._pending = false;
      this._loading = true;

      var self = this;
      loadPeaks(url).then(function (peaks) {
        self.peaks = peaks;
        self.status = '';
        self._layout();
      }).catch(function (err) {
        self.status = 'waveform unavailable';
        self._renderBase();
        self._draw();
        console.error('[wave-form] could not analyse', url, err);
      });
    }

    /* ---- the audio element is the clock -------------------------------- */

    _onFrame() {
      this._raf = 0;
      this._draw();
      if (this._playing) this._raf = requestAnimationFrame(this._onFrame);
    }

    /* ---- interaction --------------------------------------------------- */

    _bindPointer() {
      var self = this;

      this.canvas.addEventListener('mousemove', function (e) {
        if (!self.duration) return;
        var rect = self.canvas.getBoundingClientRect();
        var x = e.clientX - rect.left;
        self._tip.textContent = fmtTime((x / rect.width) * self.duration);
        self._tip.style.left = x + 'px';
        self._tip.style.top = (e.clientY - rect.top) + 'px';
        self._tip.classList.add('on');
      });

      this.canvas.addEventListener('mouseleave', function () {
        self._tip.classList.remove('on');
      });
    }

    /* ---- rendering ------------------------------------------------------

       As in <piano-roll>, every coordinate is a whole DEVICE pixel: one column
       of the wave is barely a CSS pixel wide here, so a fractional rect turns
       the whole envelope into grey mush. */

    _layout() {
      var w = this.clientWidth;
      if (!w) return;
      if (!this.duration && this.peaks) this.duration = this.peaks.duration;
      if (!this.duration) return;              // nothing to scale the axis by yet

      var h = this.height;
      var dpr = window.devicePixelRatio || 1;
      var rulerH = h <= COMPACT_H ? RULER_H_COMPACT : RULER_H;
      var bottom = this.showRuler ? rulerH : PAD_Y;

      var bw = Math.round(w * dpr);
      var bh = Math.round(h * dpr);
      [this.canvas, this.base].forEach(function (c) {
        c.width = bw;
        c.height = bh;
      });
      this.canvas.style.width = (bw / dpr) + 'px';
      this.canvas.style.height = (bh / dpr) + 'px';

      var topD = Math.round(PAD_Y * dpr);
      var waveHD = bh - topD - Math.round(bottom * dpr);

      this._geom = {
        dpr: dpr, w: w, h: h, bw: bw, bh: bh,
        topD: topD,
        rollHD: waveHD,                        // named for paintTimeAxis
        midD: topD + Math.round(waveHD / 2),
        halfD: waveHD / 2,
        hair: Math.max(1, Math.round(dpr / 2)),
        lineD: Math.max(1, Math.round(dpr)),
        xOfD: bw / this.duration
      };

      this._renderBase();
      this._draw();
    }

    /* Lightness stands in for level the same way it stands in for velocity in
       the roll, so the two rows read as one material: the quiet outer envelope
       in the pale tone, the RMS body in the full one. */
    _shade(k) {
      var l = this.hsl.l + (1 - k) * 26;
      return 'hsl(' + this.hsl.h.toFixed(0) + ',' + this.hsl.s.toFixed(0) + '%,' +
             l.toFixed(0) + '%)';
    }

    /* Static layer: axis, then the wave itself.  Drawn once per resize. */
    _renderBase() {
      var g = this._geom;
      if (!g) return;
      var ctx = this.base.getContext('2d');
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.imageSmoothingEnabled = false;
      paintTimeAxis(this, ctx);

      // zero line, matching the roll's octave rules
      ctx.fillStyle = '#f1f1f1';
      ctx.fillRect(0, g.midD, g.bw, g.hair);

      if (!this.peaks) {
        if (this.status) {
          ctx.fillStyle = '#aaa';
          ctx.font = axisFont(g);
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(this.status, Math.round(g.bw / 2), g.midD);
        }
        return;
      }

      this._paintWave(ctx, 0, g.bw, this._shade(0), this._shade(1));
    }

    /* One filled rect per device-pixel column, from x0 to x1.  `envColor`
       paints peak-to-peak, `bodyColor` the RMS band inside it; passing the
       same colour for both gives the solid slice used at the playhead. */
    _paintWave(ctx, x0, x1, envColor, bodyColor) {
      var g = this._geom;
      var p = this.peaks;
      // a quiet master would otherwise use half the height; cap the lift so a
      // near-silent file does not become a wall of amplified noise
      var gain = p.peak > 0 ? Math.min(1 / p.peak, 8) : 0;
      var scale = g.halfD * gain;
      var minH = Math.max(1, Math.round(g.dpr));

      for (var x = Math.max(0, x0); x < Math.min(g.bw, x1); x++) {
        var b0 = Math.floor((x / g.xOfD) / p.spb);
        if (b0 >= p.count) break;
        var b1 = Math.min(p.count - 1,
                          Math.max(b0, Math.ceil(((x + 1) / g.xOfD) / p.spb) - 1));

        var lo = 0, hi = 0, sum = 0;
        for (var b = b0; b <= b1; b++) {
          if (p.min[b] < lo) lo = p.min[b];
          if (p.max[b] > hi) hi = p.max[b];
          sum += p.ms[b];
        }
        var rms = Math.sqrt(sum / (b1 - b0 + 1));

        var top = Math.round(g.midD - hi * scale);
        var bot = Math.round(g.midD - lo * scale);
        ctx.fillStyle = envColor;
        ctx.fillRect(x, top, 1, Math.max(minH, bot - top));

        var r = Math.round(rms * scale);
        if (r >= 1) {
          ctx.fillStyle = bodyColor;
          ctx.fillRect(x, g.midD - r, 1, Math.max(minH, r * 2));
        }
      }
    }

    /* Per-frame layer: blit the static wave, then the playhead and the slice
       sounding right now -- the wave's answer to the roll's lit-up notes. */
    _draw() {
      var g = this._geom;
      if (!g) return;

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

      if (this.peaks) {
        var wD = Math.max(2, Math.round(2 * g.dpr));
        this._paintWave(ctx, px - (wD >> 1), px - (wD >> 1) + wD,
                        this.activeColor, this.activeColor);
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

  if (!window.customElements.get('wave-form')) {
    window.customElements.define('wave-form', WaveForm);
  }
})();
