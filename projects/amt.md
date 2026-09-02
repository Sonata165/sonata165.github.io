---
layout: page
title: "Harmonica: Accurate and Lightweight Instrument-Agnostic Music Transcription"
permalink: /amt
---
 
<!-- Google Analytics tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-MK1PD93QHP"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-MK1PD93QHP');
</script>


<p style="font-size: 0.85em; color: #666; margin: 0 0 0.6em;">The model can run on an iPhone 15. Please refer to Appendix A in the <a href="/assets/pdf/papers/ICASSP_2027_AMT__ArXiv_.pdf" target="_blank">arXiv version</a> for details.</p>

# **Links**: [ [Paper](/assets/pdf/papers/ICASSP_2027_AMT__ArXiv_.pdf){:target="_blank"}   ] | [ [Citation](#citation) ]

We introduce *Harmonica*, a family of instrument-agnostic automatic music transcription (AMT) models built around multi-depth harmonic convolution. At each model scale, *Harmonica* achieves the best performance among the evaluated models: the x-large model attains state-of-the-art performance in instrument-agnostic transcription, while the medium variant offers competitive accuracy with faster inference than all baselines. Pushing the limit of computational efficiency, the nano variant has only 26.3K parameters and runs at 1,622.5x real time, yet achieves a frame F1 of 0.796 on the development set, 14.6 percentage points higher than Basic Pitch. We further demonstrate that multi-depth harmonic convolution effectively exploits harmonic information to benefit transcription performance through comparative experiments with existing harmonic aggregation methods, including harmonic stacking, harmonic attention, single-depth harmonic convolution, and the HD-Conv layer. 

Together, these results demonstrate the potential of efficient, instrument-agnostic architectures for practical AMT, with *Harmonica* already deployed as the [**Audio-to-MIDI service**](https://help.bandlab.com/hc/en-us/articles/37575596722329-Converting-Audio-to-MIDI){:target="_blank"} in [**BandLab Studio**](https://www.bandlab.com/){:target="_blank"} to support accessible music creation.


## Performance at a Glance
<div style="display: flex; gap: 1em; align-items: flex-start; margin-bottom: 1.5em;">
  <div style="width: 50%;">
    <figure style="margin: 0;">
      <img src="/assets/for_projects/amt/size_vs_perf.png" alt="Size vs. performance" style="width: 100%;">
      <figcaption style="text-align: center; font-size: 0.85em; font-style: italic; margin-top: 0.6em;">Performance vs model size</figcaption>
    </figure>
    <p style="font-size: 0.85em;">We define the new performance-efficiency frontier. Our models have the best performance at each parameter scale. </p>
  </div>
  <div style="width: 50%;">
    <figure style="margin: 0;">
      <img src="/assets/for_projects/amt/speed_vs_perf.png" alt="Speed vs. performance" style="width: 100%;">
      <figcaption style="text-align: center; font-size: 0.85em; font-style: italic; margin-top: 0.6em;">Performance vs inference speed</figcaption>
    </figure>
    <p style="font-size: 0.85em;">We define the new performance-speed frontier as well. At each performance level, our model offers the fastest inference speed. </p>
  </div>
</div>

<div style="display: flex; gap: 1em; align-items: center; margin-bottom: 1.5em;">
  <figure style="width: 67%; margin: 0;">
    <img src="/assets/for_projects/amt/performance_per_inst.png" alt="Performance per instrument family" style="width: 100%;">
    <figcaption style="text-align: center; font-size: 0.85em; font-style: italic; margin-top: 0.6em;">Frame F1 per instrument family on Slakh2100</figcaption>
  </figure>
  <p style="width: 33%; font-size: 0.85em;">This figure breaks performance down by instrument family. Our x-large model is the strongest on every family, and its scores are more evenly distributed across families. On the other hand, many baselines such as PerceiverTF and HFSFormer degrade sharply on the harder families, particularly chromatic percussion and synth pad. This suggests that the proposed architecture generalizes well across diverse pitched instruments.</p>
</div>


## Demonstration

Here we demonstrate the model's capability to transcribe various music pieces.


### Full Song Transcription
Below we present the song <a href="https://www.youtube.com/watch?v=XWS1IRF_IFA" target="_blank">Angelina from Tommy Emmanuel</a> along with transcriptions from different models. Note that this is an out-of-domain case for all models, since there is no fingerstyle solo guitar in the training set.

<style>
.demo-list { margin-bottom: 1.2em; }
.demo-row { display: flex; gap: 1em; align-items: center; margin-bottom: 0.7em; }
.demo-row + .demo-row { border-top: 1px solid #e8e8e8; padding-top: 0.7em; }
.demo-meta { width: 22%; flex: none; }
.demo-label { font-size: 0.85em; font-weight: 600; display: block; }
.demo-note { font-size: 0.78em; line-height: 1.35; margin: 0.2em 0 0; color: #555; }
.demo-main { flex: 1; min-width: 0; }
.demo-main audio { width: 100%; height: 28px; display: block; }
.demo-main img { width: 100%; display: block; margin-top: 0.2em; }
</style>

<div class="demo-list">
  <div class="demo-row">
    <div class="demo-meta">
      <span class="demo-label">Original Audio</span>
      <p class="demo-note">A well-known fingerstyle arrangement for solo acoustic guitar.</p>
    </div>
    <div class="demo-main">
      <audio controls preload="none">
        <source src="/assets/for_projects/amt/angelina/angelina.mp3" type="audio/mpeg">
      </audio>
      <img src="/assets/for_projects/amt/angelina/waveform.png" alt="Original recording">
    </div>
  </div>
  <div class="demo-row">
    <div class="demo-meta">
      <span class="demo-label">Ours (x-large)</span>
      <p class="demo-note">An accurate transcription.</p>
    </div>
    <div class="demo-main">
      <audio controls preload="none">
        <source src="/assets/for_projects/amt/angelina/ours-xl.mp3" type="audio/mpeg">
      </audio>
      <img src="/assets/for_projects/amt/angelina/ours-xl.png" alt="Ours (X-Large)">
    </div>
  </div>
  <div class="demo-row">
    <div class="demo-meta">
      <span class="demo-label">MT3</span>
      <p class="demo-note">Many duplicated and hallucinated notes. The polyphony level is obviously beyond with what a single guitar can do.</p>
    </div>
    <div class="demo-main">
      <audio controls preload="none">
        <source src="/assets/for_projects/amt/angelina/mt3.mp3" type="audio/mpeg">
      </audio>
      <img src="/assets/for_projects/amt/angelina/mt3.png" alt="MT3">
    </div>
  </div>
  <div class="demo-row">
    <div class="demo-meta">
      <span class="demo-label">Basic Pitch</span>
      <p class="demo-note">Lots of notes are broken into multiple pieces.</p>
    </div>
    <div class="demo-main">
      <audio controls preload="none">
        <source src="/assets/for_projects/amt/angelina/basic-pitch.mp3" type="audio/mpeg">
      </audio>
      <img src="/assets/for_projects/amt/angelina/basic-pitch.png" alt="Basic Pitch">
    </div>
  </div>
  <div class="demo-row">
    <div class="demo-meta">
      <span class="demo-label">hFT</span>
      <p class="demo-note">Consistently hallucinates notes in the high register.</p>  
    </div>
    <div class="demo-main">
      <audio controls preload="none">
        <source src="/assets/for_projects/amt/angelina/hft.mp3" type="audio/mpeg">
      </audio>
      <img src="/assets/for_projects/amt/angelina/hft.png" alt="hFT">
    </div>
  </div>
  <div class="demo-row">
    <div class="demo-meta">
      <span class="demo-label">YourMT3+</span>
      <p class="demo-note">Onset prediction is decent; offset / duration is off.</p>
    </div>
    <div class="demo-main">
      <audio controls preload="none">
        <source src="/assets/for_projects/amt/angelina/ymt3.mp3" type="audio/mpeg">
      </audio>
      <img src="/assets/for_projects/amt/angelina/ymt3.png" alt="YourMT3+">
    </div>
  </div>
  <div class="demo-row">
    <div class="demo-meta">
      <span class="demo-label">Transkun</span>
      <p class="demo-note">Many notes are missing in the output.</p>
    </div>
    <div class="demo-main">
      <audio controls preload="none">
        <source src="/assets/for_projects/amt/angelina/transkun.mp3" type="audio/mpeg">
      </audio>
      <img src="/assets/for_projects/amt/angelina/transkun.png" alt="Transkun">
    </div>
  </div>
  <div class="demo-row">
    <div class="demo-meta">
      <span class="demo-label">SFT-CRNN</span>
      <p class="demo-note">Many note onsets are not paired with note offsets, depressing its frame-level performance.</p>
    </div>
    <div class="demo-main">
      <audio controls preload="none">
        <source src="/assets/for_projects/amt/angelina/sft.mp3" type="audio/mpeg">
      </audio>
      <img src="/assets/for_projects/amt/angelina/sft.png" alt="SFT-CRNN">
    </div>
  </div>
</div>


### Quality Showcase

Our model is capable to handle various instruments, various timbre, various styles and genres, more accurately than prior models.
<!-- On difficult materials, our model make less mistakes. -->

<style>
.qs-wrap { overflow-x: auto; margin: 0.9em 0 0.35em; }
/* the theme (minima) styles bare <table>; these override its margin,
   zebra striping and text colour so the widget looks the same everywhere */
table.qs { border-collapse: collapse; width: 100%; font-size: 0.82em; table-layout: fixed;
           margin: 0; color: inherit; }
table.qs tr > *:first-child { width: 20%; }
table.qs th, table.qs td { border: 1px solid #e4e4e4; padding: 0.35em 0.45em; text-align: center; }
table.qs thead th { background: #f6f6f6; font-weight: 600; }
table.qs tbody tr td { background: #fff; }
table.qs tbody tr th { text-align: left; white-space: nowrap; font-weight: 500; background: #fafafa; }
.qs-icon { margin-right: 0.45em; display: inline-block; line-height: 0; color: #007cba; }
.qs-icon svg { width: 1.25em; height: 1.25em; vertical-align: -0.28em; fill: currentColor; }
table.qs tbody tr td.qs-ours { background: #eef6ff; }
table.qs thead th.qs-ours { background: #d9e9fb; }
.qs-btn { width: 26px; height: 26px; border-radius: 50%; border: 1px solid #bbb; background: #fff;
          cursor: pointer; font-size: 11px; line-height: 1; padding: 0; color: #333; }
.qs-btn:hover { border-color: #007cba; color: #007cba; }
.qs-btn.playing { background: #007cba; border-color: #007cba; color: #fff; }
.qs-hint { font-size: 0.78em; color: #666; margin: 0 0 1.2em; }
</style>

<div class="qs-wrap">
  <table class="qs" id="qs-table"></table>
</div>
<p class="qs-hint">Click any button to play that model's transcription of the segment; only one clip plays at a time.</p>
<noscript><p class="qs-hint">This comparison table requires JavaScript.</p></noscript>

{% raw %}
<script>
(function () {
  // ---- edit these to change the table -----------------------------------
  var BASE = "/assets/for_projects/amt/segment_demos";

  var MODELS = [
    { file: "original",    label: "Original" },
    { file: "ours",        label: "Ours (medium)", ours: true },
    { file: "basic_pitch", label: "Basic Pitch" },
    { file: "hfsformer",   label: "HFSFormer" },
    { file: "ymt3",        label: "YourMT3+" },
    { file: "perceiver_tf", label: "PerceiverTF" }
  ];

  // dir  = folder under model_outputs/rendered_by_song/
  // input = basename under audio_seg_mp3/ (names differ from dir for some songs)
  // Inline SVG icons (kept inline so they inherit text colour via
  // currentColor and cost no extra requests). You rarely need to touch these.
  var ICONS = {
    pianoGrand: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'><path fill='currentColor' d='m376.3 30.6l-63.3 3L61.43 230.9l261.47-51.5c5.8-4.6 10.9-9 15.4-13.1L302 75.6l15.5-6.2l33.7 84.2c55.1-60.2-20.4-71.1 25.1-123M357 168l-13.2 11.9l9.6 24.1c-9.1-.4-19.2-.6-30.5-.7L61.43 254.9s.34 2.2.84 5.5c2.36 15.5-7.73 30.2-23.07 33.6c-8.93 2-16.61 3.7-16.61 3.7l3.95 21.2l334.16 30.5l126-53.9l-.9-43.4c-81.1-8.7-11.4-39.4-114-47zm-16.2 51.3c7.1.1 13.4.4 19 .7l21.5 53.8l-273.6-14.5l209.9-39.9c8.5-.1 16.2-.2 23.2-.1m37.6 2.4c56.8 7.8 14.9 32.1 65 36.5l-44.9 13.5zM83.78 284.8L358.4 307l-18.1 16.1l-280.68-25.9zm-1.35 53.6l13.65 97.1l-3.47 6.2l.36 15.8l17.13 1.6l17.1-6.2v-13.2l-4.8-3.9l9.1-93zM184 350.5V426l105.2 9v-75.2l-16.7-1.5V417l-71.8-6v-59zm209.8 2.7l-29.4 10.9l-24.8-2l15.6 99.4l-3.9 5.1l.8 18l17.1 1.7l15.9-7.4l.3-13.2l-3.9-3.9zm-208.7 89.6l-28.4 9.5l3.1 14.4l102.3 10.1l21-7.4l1.1-18.3z'/></svg>",
    pianoUpright: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path fill='currentColor' d='M20 2H4c-1.1 0-2 .9-2 2v16a2 2 0 0 0 2 2h16c1.11 0 2-.89 2-2V4a2 2 0 0 0-2-2m-5.26 12H15v6H9v-6h.31c.55 0 .99-.44.99-1V4h3.45v9c0 .56.44 1 .99 1M4 4h2.8v9c0 .56.44 1 .99 1H8v6H4zm16 16h-4v-6h.26c.55 0 .99-.44.99-1V4H20z'/></svg>",
    guitarAcoustic: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path fill='currentColor' d='M19.59 3H22v2h-1.59l-4.24 4.24c-.37-.56-.85-1.04-1.41-1.41zM12 8a4 4 0 0 1 4 4a3.99 3.99 0 0 1-3 3.87V16a5 5 0 0 1-5 5a5 5 0 0 1-5-5a5 5 0 0 1 5-5h.13c.45-1.76 2.04-3 3.87-3m0 2.5a1.5 1.5 0 0 0-1.5 1.5a1.5 1.5 0 0 0 1.5 1.5a1.5 1.5 0 0 0 1.5-1.5a1.5 1.5 0 0 0-1.5-1.5m-5.06 3.74l-.71.7l2.83 2.83l.71-.71z'/></svg>",
    guitarElectric: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path fill='currentColor' d='M19.59 3H22v2h-1.59l-5.29 5.29l-1.41-1.39zM12 9c.26 0 .5.1.71.3l2 2c.18.2.29.43.29.7l-.1.4l-4 8c-.19.35-.54.53-.9.53c-.35 0-.71-.18-.89-.53l-1.86-3.7l-3.7-1.8c-.37-.2-.55-.55-.55-.9s.18-.7.55-.9l8-4c.14-.1.29-.1.45-.1m-2.65 2.82l-.7.68l2.85 2.85l.68-.7zm-1.41 1.41l-.71.71l2.83 2.83l.71-.71z'/></svg>",
    bassClef: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path fill='currentColor' d='M18.5 5A1.5 1.5 0 1 1 17 6.5A1.5 1.5 0 0 1 18.5 5m0 6a1.5 1.5 0 1 1-1.5 1.5a1.5 1.5 0 0 1 1.5-1.5M10 4a5 5 0 0 0-5 5v1a2 2 0 1 0 2.18-2A3 3 0 0 1 10 6a4 4 0 0 1 4 4c0 3.59-2.23 6.19-7 8.2l.76 1.84C13.31 17.72 16 14.43 16 10a6 6 0 0 0-6-6'/></svg>",
    violin: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path fill='currentColor' d='M11 2a1 1 0 0 0-1 1v6a.5.5 0 0 0 .5.5H12a.5.5 0 0 1 .5.5a.5.5 0 0 1-.5.5h-1.5C9.73 10.5 9 9.77 9 9V5.16C7.27 5.6 6 7.13 6 9v1.5A2.5 2.5 0 0 1 8.5 13A2.5 2.5 0 0 1 6 15.5V17c0 2.77 2.23 5 5 5h2c2.77 0 5-2.23 5-5v-1.5a2.5 2.5 0 0 1-2.5-2.5a2.5 2.5 0 0 1 2.5-2.5V9c0-2.22-1.78-4-4-4V3a1 1 0 0 0-1-1zm-.25 14.5h2.5l-.5 3.5h-1.5z'/></svg>",
    strings4: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><g fill='currentColor'><g transform='translate(-0.8,-0.8) scale(0.6)'><path d='M11 2a1 1 0 0 0-1 1v6a.5.5 0 0 0 .5.5H12a.5.5 0 0 1 .5.5a.5.5 0 0 1-.5.5h-1.5C9.73 10.5 9 9.77 9 9V5.16C7.27 5.6 6 7.13 6 9v1.5A2.5 2.5 0 0 1 8.5 13A2.5 2.5 0 0 1 6 15.5V17c0 2.77 2.23 5 5 5h2c2.77 0 5-2.23 5-5v-1.5a2.5 2.5 0 0 1-2.5-2.5a2.5 2.5 0 0 1 2.5-2.5V9c0-2.22-1.78-4-4-4V3a1 1 0 0 0-1-1zm-.25 14.5h2.5l-.5 3.5h-1.5z'/></g><g transform='translate(10.4,-0.8) scale(0.6)'><path d='M11 2a1 1 0 0 0-1 1v6a.5.5 0 0 0 .5.5H12a.5.5 0 0 1 .5.5a.5.5 0 0 1-.5.5h-1.5C9.73 10.5 9 9.77 9 9V5.16C7.27 5.6 6 7.13 6 9v1.5A2.5 2.5 0 0 1 8.5 13A2.5 2.5 0 0 1 6 15.5V17c0 2.77 2.23 5 5 5h2c2.77 0 5-2.23 5-5v-1.5a2.5 2.5 0 0 1-2.5-2.5a2.5 2.5 0 0 1 2.5-2.5V9c0-2.22-1.78-4-4-4V3a1 1 0 0 0-1-1zm-.25 14.5h2.5l-.5 3.5h-1.5z'/></g><g transform='translate(-0.8,10.4) scale(0.6)'><path d='M11 2a1 1 0 0 0-1 1v6a.5.5 0 0 0 .5.5H12a.5.5 0 0 1 .5.5a.5.5 0 0 1-.5.5h-1.5C9.73 10.5 9 9.77 9 9V5.16C7.27 5.6 6 7.13 6 9v1.5A2.5 2.5 0 0 1 8.5 13A2.5 2.5 0 0 1 6 15.5V17c0 2.77 2.23 5 5 5h2c2.77 0 5-2.23 5-5v-1.5a2.5 2.5 0 0 1-2.5-2.5a2.5 2.5 0 0 1 2.5-2.5V9c0-2.22-1.78-4-4-4V3a1 1 0 0 0-1-1zm-.25 14.5h2.5l-.5 3.5h-1.5z'/></g><g transform='translate(10.4,10.4) scale(0.6)'><path d='M11 2a1 1 0 0 0-1 1v6a.5.5 0 0 0 .5.5H12a.5.5 0 0 1 .5.5a.5.5 0 0 1-.5.5h-1.5C9.73 10.5 9 9.77 9 9V5.16C7.27 5.6 6 7.13 6 9v1.5A2.5 2.5 0 0 1 8.5 13A2.5 2.5 0 0 1 6 15.5V17c0 2.77 2.23 5 5 5h2c2.77 0 5-2.23 5-5v-1.5a2.5 2.5 0 0 1-2.5-2.5a2.5 2.5 0 0 1 2.5-2.5V9c0-2.22-1.78-4-4-4V3a1 1 0 0 0-1-1zm-.25 14.5h2.5l-.5 3.5h-1.5z'/></g></g></svg>",
    saxophone: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path fill='currentColor' d='M4 2a1 1 0 0 0-1 1a1 1 0 0 0 1 1a3 3 0 0 1 3 3v8.5c0 3.6 2.9 6.5 6.5 6.5s6.5-2.9 6.5-6.5V13a1 1 0 0 0 1-1a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1a1 1 0 0 0 1 1v2a1 1 0 0 1-1 1a1 1 0 0 1-1-1v-4a1 1 0 0 0 1-1a1 1 0 0 0-1-1V8a1 1 0 0 0 1-1a1 1 0 0 0-1-1v-.5A3.5 3.5 0 0 0 8.5 2z'/></svg>"
  };

  var SEGMENTS = [
    { icon: ICONS.pianoGrand,     color: "#2b2b2b",  // ebony lacquer
      label: "Classical Piano",   dir: "classical_piano",           input: "classic_piano" },
    { icon: ICONS.pianoUpright,   color: "#5b7c99",  // steel-blue synth
      label: "Pop Piano",         dir: "pop_piano",                 input: "pop_piano" },
    { icon: ICONS.guitarAcoustic, color: "#cfa16b",  // pale spruce top
      label: "Classical Guitar",  dir: "classical_guitar",          input: "classical_guitar" },
    { icon: ICONS.guitarElectric, color: "#c0392b",  // cherry-red body
      label: "Distorted E-Guitar", dir: "distorted_electric_guitar", input: "distorted_electric_guitar" },
    { icon: ICONS.bassClef,       color: "#3b4a8c",  // deep/low indigo
      label: "Electric Bass",     dir: "electric_bass",             input: "bass" },
    { icon: ICONS.violin,         color: "#a0522d",  // sienna varnish
      label: "Violin Solo",       dir: "violin_solo",               input: "violin_solo" },
    { icon: ICONS.strings4,       color: "#6b2f1a",  // deep mahogany
      label: "String Ensemble",   dir: "string_ensemble",           input: "string_ensemble" },
    { icon: ICONS.saxophone,      color: "#c8a415",  // brass
      label: "Saxophone Solo",    dir: "saxophone_solo",            input: "sax" }
  ];

  function srcFor(seg, m) {
    if (m.file === "original") {
      return BASE + "/audio_seg_mp3/" + seg.input + ".mp3";
    }
    return BASE + "/model_outputs/rendered_by_song/" + seg.dir + "/" + m.file + ".mp3";
  }
  // -----------------------------------------------------------------------

  var table = document.getElementById("qs-table");
  if (!table) return;

  var thead = document.createElement("thead");
  var hrow = document.createElement("tr");
  var corner = document.createElement("th");
  corner.textContent = "Segment";
  hrow.appendChild(corner);
  MODELS.forEach(function (m) {
    var th = document.createElement("th");
    th.textContent = m.label;
    if (m.ours) th.className = "qs-ours";
    hrow.appendChild(th);
  });
  thead.appendChild(hrow);
  table.appendChild(thead);

  var tbody = document.createElement("tbody");
  SEGMENTS.forEach(function (seg) {
    var tr = document.createElement("tr");
    var rowHead = document.createElement("th");
    rowHead.scope = "row";
    var icon = document.createElement("span");
    icon.className = "qs-icon";
    icon.setAttribute("aria-hidden", "true");
    icon.innerHTML = seg.icon;
    if (seg.color) icon.style.color = seg.color;
    rowHead.appendChild(icon);
    rowHead.appendChild(document.createTextNode(seg.label));
    tr.appendChild(rowHead);

    MODELS.forEach(function (m) {
      var td = document.createElement("td");
      if (m.ours) td.className = "qs-ours";
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "qs-btn";
      btn.textContent = "▶";
      btn.setAttribute("aria-label", "Play " + m.label + ", " + seg.label);
      btn.setAttribute("data-src", srcFor(seg, m));
      td.appendChild(btn);
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);

  var audio = new Audio();
  var current = null;

  function reset() {
    if (current) {
      current.textContent = "▶";
      current.classList.remove("playing");
    }
    current = null;
  }

  function stop() {
    audio.pause();
    reset();
  }

  audio.addEventListener("ended", reset);
  audio.addEventListener("error", reset);

  table.addEventListener("click", function (e) {
    var btn = e.target.closest ? e.target.closest(".qs-btn") : null;
    if (!btn) return;
    if (btn === current) {
      stop();
      return;
    }
    stop();
    audio.src = btn.getAttribute("data-src");
    audio.play();
    current = btn;
    btn.textContent = "⏸";
    btn.classList.add("playing");
  });
})();
</script>
{% endraw %}


## Citation
<pre style="background-color: #f0f0f0; font-family: Courier, Consolas, monospace;">
@article{ou2026harmonica,
  title={Harmonica: Accurate and Lightweight Instrument-Agnostic Music Transcription},
  author={Ou, Longshen and Martel, H{\'e}ctor and Hennessy-Priest, Joe and Cho, Taemin},
  year={2026}
}
</pre>


<!-- jQuery -->
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<!-- Bootstrap JS -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
<!-- jQuery Easing -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-easing/1.4.1/jquery.easing.min.js"></script>
<!-- jQuery FitText -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/FitText.js/1.2.0/jquery.fittext.min.js"></script>
<!-- WOW.js -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/wow/1.1.2/wow.min.js"></script>
<!-- Note: creative.js removed - if needed, functionality should be reimplemented or file copied to assets -->

<script src="/assets/js/html-midi-player-bundle.js"></script>
<script src="/assets/js/midi-audio-sync.js"></script>