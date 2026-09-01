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

We introduces *Harmonica*, a family of instrument-agnostic music transcription models built around multi-depth harmonic convolution. At each model scale, *Harmonica* achieves the best performance among the evaluated models: the x-large model attains state-of-the-art performance in instrument-agnostic transcription, while the medium variant offers competitive accuracy with faster inference than all baselines. Pushing the limit of computational efficiency, the nano variant has only 26.3K parameters and runs at 1,622.5x real time, yet achieves a frame F1 of 0.796 on the development set, 14.6 percentage points higher than Basic Pitch. We further demonstrate that multi-depth harmonic convolution effectively exploits harmonic information to benefit transcription performance through comparative experiments with existing harmonic aggregation methods, including harmonic stacking, harmonic attention, single-depth harmonic convolution, and the HD-Conv layer.


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
Below we present the song <a href="https://www.youtube.com/watch?v=XWS1IRF_IFA" target="_blank">Angelina from Tommy Emmanuel</a> and transcription from different models. Note that this is an out-of-domain case for all models, since there is no fingerstyle solo guitar in the training set.

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
      <p class="demo-note">Consistently hallucinate notes in the high register.</p>
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

Our model is capable to handle various instruments, various timbre, various styles and genres. 
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
  var SEGMENTS = [
    { label: "Classical Piano",   dir: "classical_piano",           input: "classic_piano" },
    { label: "Pop Piano",         dir: "pop_piano",                 input: "pop_piano" },
    { label: "Classical Guitar",  dir: "classical_guitar",          input: "classical_guitar" },
    { label: "Distorted E-Guitar", dir: "distorted_electric_guitar", input: "distorted_electric_guitar" },
    { label: "Electric Bass",     dir: "electric_bass",             input: "bass" },
    { label: "Violin Solo",       dir: "violin_solo",               input: "violin_solo" },
    { label: "String Ensemble",   dir: "string_ensemble",           input: "string_ensemble" },
    { label: "Saxophone Solo",    dir: "saxophone_solo",            input: "sax" }
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
    rowHead.textContent = seg.label;
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