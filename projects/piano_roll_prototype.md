---
layout: page
title: "Piano Roll Prototype"
permalink: /piano_roll_prototype
---

### Interactive Piano Roll <span style="font-weight: 400; color: #999; font-size: 0.75em;">— prototype</span>

<p style="font-size: 0.85em; color: #666; margin: 0 0 0.9em;">A scratch page for the <code>&lt;piano-roll&gt;</code> component used on the <a href="/amt_debug">Harmonica page</a>, kept for comparing render heights side by side. The MP3 is the only clock — the roll reads <code>audio.currentTime</code> every frame and holds no time state of its own, so seeking and scrubbing cannot drift out of sync. All three rolls below share one audio element, so they scrub together.</p>

<style>
piano-roll { display: block; }
.pr-demo { border: 1px solid #e8e8e8; border-radius: 6px; padding: 0.7em 0.8em 0.75em; margin-bottom: 0.4em; }
.pr-demo > audio { width: 100%; height: 30px; display: block; margin-bottom: 0.7em; }
.pr-title { font-size: 0.85em; font-weight: 600; margin: 0 0 0.5em; }
.pr-title span { font-weight: 400; color: #777; }
.pr-variant { font-size: 0.78em; color: #555; margin: 0.9em 0 0.25em; }
.pr-variant:first-of-type { margin-top: 0; }
.pr-variant b { font-weight: 600; color: #222; }
.pr-variant em { font-style: normal; color: #999; }
.pr-hint { font-size: 0.78em; color: #888; margin: 0 0 1.6em; }
.pr-hint kbd { font: inherit; border: 1px solid #ddd; border-radius: 3px; padding: 0 3px; background: #fafafa; }
</style>

<div class="pr-demo">
  <p class="pr-title">Angelina <span>— transcribed MIDI over the original recording</span></p>
  <audio id="pr-audio" controls preload="metadata">
    <source src="/assets/for_projects/amt/angelina/angelina.mp3" type="audio/mpeg">
    Your browser does not support the audio tag.
  </audio>

  <p class="pr-variant"><b>96px, full pitch range</b> <em>— the height a Full Song table row used to occupy (28px audio + 3.2px gap + 64.5px screenshot). Three stray notes stretch the axis to 67 semitones, so everything real is squashed.</em></p>
  <piano-roll src="/assets/for_projects/amt/angelina/midis/angelina_bs.mid"
              audio="#pr-audio" height="96"></piano-roll>

  <p class="pr-variant"><b>96px, outliers clipped</b> <em>— same height, axis cut at the 0.2% quantile. Clipped notes are pinned to the dashed edges in pink, so the hallucinations stay visible without costing 33 semitones.</em></p>
  <piano-roll src="/assets/for_projects/amt/angelina/midis/angelina_bs.mid"
              audio="#pr-audio" height="96" clip="0.002"></piano-roll>

  <p class="pr-variant"><b>150px, outliers clipped</b> <em>— for reference: what the extra 54px buys.</em></p>
  <piano-roll src="/assets/for_projects/amt/angelina/midis/angelina_bs.mid"
              audio="#pr-audio" height="150" clip="0.002"></piano-roll>
</div>
<p class="pr-hint">Click anywhere in a roll to seek · hover for pitch, time and velocity · <kbd>←</kbd> <kbd>→</kbd> nudge 5s (hold <kbd>shift</kbd> for 1s) · <kbd>space</kbd> toggles play</p>

<script src="/assets/js/piano-roll.js"></script>
