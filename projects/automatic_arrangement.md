---
layout: page
title: "Unifying Symbolic Music Arrangement: Track-Aware Reconstruction and Structured Tokenization"
permalink: /automatic_arrangement
---
 
<!-- Google Analytics tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-MK1PD93QHP"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-MK1PD93QHP');
</script>

NeurIPS 2025 Submission 19229


# **Links**: [ [Paper](https://arxiv.org/abs/2408.15176){:target="_blank"} ] | [ [Code](https://github.com/Sonata165/music2music_code){:target="_blank"} ] | [ [Citation](#citation) ]

Abstract: We present a unified framework for automatic multitrack music arrangement that enables a single pre-trained symbolic music model to handle diverse arrangement scenarios, including reinterpretation, simplification, and additive generation. At its core is a segment-level reconstruction objective operating on token-level disentangled content and style, allowing for flexible any-to-any instrumentation transformations at inference time. To support track-wise modeling, we introduce REMI-z, a structured tokenization scheme for multitrack symbolic music. By preserving track-wise continuity while reducing sequence length and complexity, it enhances modeling efficiency and effectiveness for both arrangement tasks and unconditional generation. Our method outperforms task-specific state-of-the-art models on representative tasks in different arrangement scenarios—band arrangement, piano reduction, and drum arrangement, in both objective metrics and perceptual evaluations. Taken together, our framework demonstrates strong generality and suggests broader applicability in symbolic music-to-music transformation.

<!-- Merged from ae4rtjsyr.github.io front page. Assets referenced via CDN to avoid 404 errors. -->

<!-- Bootstrap CSS -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
<!-- Font Awesome -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
<!-- Animate.css -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css">

<style>
  /* Extracted key styles from ae4rtjsyr front layout */
  midi-player { display: block; width: inherit; height: 25px; margin: 0 0px 0rem 0px; margin-top: 0; }
  midi-player::part(control-panel) { background: linear-gradient(#fefefe, #e9e9e9); border: 1px solid #e9e9e9; border-top: none; border-radius: 0px 0px 10px 10px; }
  midi-visualizer .piano-roll-visualizer { background: #fefefe; border: 1px solid #e9e9e9; border-bottom: none; border-radius: 0px 0px 0 0; margin: 0 0px; margin-bottom: 0; width: inherit; overflow-x: auto; overflow-y: hidden; }
  midi-visualizer svg { margin: 2px; }
  midi-visualizer svg rect.note { opacity: calc(min(1, (var(--midi-velocity) + 30) / 128) * 0.75); }
  midi-visualizer svg rect.note.active { opacity: calc(min(1, (var(--midi-velocity) + 30) / 128) * 0.9); stroke: rgb(0, 0, 0); stroke-width: 1; stroke-opacity: 1; }
  midi-visualizer svg rect.note { fill: #17becf; opacity: 75%; }
  midi-visualizer svg rect.note[data-program="0"] { fill: #1f77b4; opacity: 75%; }
  midi-visualizer svg rect.note[data-program="8"] { fill: #2ca02c; opacity: 75%; }
  midi-visualizer svg rect.note[data-program="16"] { fill: #bcbd22; opacity: 75%; }
  midi-visualizer svg rect.note[data-program="24"] { fill: #e377c2; opacity: 75%; }
  midi-visualizer svg rect.note[data-program="32"] { fill: #9467bd; opacity: 75%; }
  midi-visualizer svg rect.note[data-program="40"] { fill: #8c564b; opacity: 75%; }
  midi-visualizer svg rect.note[data-program="48"] { fill: #ffbb78; opacity: 75%; }
  midi-visualizer svg rect.note[data-program="56"] { fill: #ff7f0e; opacity: 75%; }
  midi-visualizer svg rect.note[data-program="64"] { fill: #d62728; opacity: 75%; }
  midi-visualizer svg rect.note[data-program="72"] { fill: #d62728; opacity: 75%; }
  midi-visualizer svg rect.note[data-program="80"] { fill: #1b9e77; opacity: 75%; }
  midi-visualizer svg rect.note[data-program="88"] { fill: #d62728; }
  midi-visualizer svg rect.note[data-program="89"] { fill: #98df8a; opacity: 75%; }
  midi-visualizer svg rect.note[data-program="1"] { fill: #d62728; opacity: 75%; }
  .tabs { position: relative; display: flex; min-height: 250; border-radius: 10px 10px 0px 0px; overflow: hidden; }
  .tabby-tab { width: 100px; }
  .tabby-tab label { display: block; box-sizing: border-box; height: 25px; padding: 3px; text-align: center; background: rgb(225, 225, 250); cursor: pointer; border-radius: 10px 10px 0px 0px; }
  .tabby-tab label:hover { background: rgb(182, 182, 250); }
  .tabby-content { position: absolute; left: 0px; bottom: 0; right: 0px; top: 25; padding: 0px; border-radius: 0px; background: #ffffff; opacity: 0; transform: scale(0.95); }
  .tabby-tab [type=radio] { display: none; }
  [type=radio]:checked ~ label { background: rgb(152, 152, 255); z-index: 2; }
  [type=radio]:checked ~ label ~ .tabby-content { z-index: 1; opacity: 1; transform: scale(1); }
  /* Match Test 3 layout exactly, then scale to 75% height */
  midi-visualizer { 
    display: block; 
    width: 100%; 
    min-height: 300px;
    max-height: 450px;
    /* height: 450px; */
    transform: scaleY(0.75);
    transform-origin: top center;
    margin-bottom: -90px; /* Compensate for 75% scale: 25% of 300px = 75px gap */
    overflow: hidden;
  }
  midi-player { 
    display: block; 
    width: 100%; 
    height: 25px;
    margin-top: 0px;
  }
</style>

<style>
  /* Ensure embedded audio controls are visible inside tables */
  .wide-table { overflow-x: auto; }
  .wide-table table { min-width: 1100px; border-collapse: separate; border-spacing: 0; }
  .table.table-bordered td audio { width: 100%; min-width: 200px; display: block; }

  /* Freeze first column during horizontal scroll */
  .wide-table table th:first-child,
  .wide-table table td:first-child {
    position: sticky;
    left: 0;
    background: #ffffff;
    z-index: 2;
    background-clip: padding-box;
  }
  /* Match header background color across all header cells */
  .wide-table table thead th { background: #f5f5f5; }
  /* Keep header's first cell sticky and above others */
  .wide-table table thead th:first-child {
    position: sticky;
    left: 0;
    z-index: 5;
    background: #f5f5f5;
    background-clip: padding-box;
  }
  /* Optional subtle divider to indicate stickiness overlap */
  .wide-table table td:first-child { box-shadow: 2px 0 0 #ddd; }
  .wide-table table thead th:first-child { box-shadow: 2px 0 0 #ddd; }
</style>

<section class="bg-white">
  <div class="container no-gutter no-padding">
    <div class="col-lg-12 text-center">
        <h3></h3>
    </div>
  </div>

</section>

## Band Arrangement

This task involves arranging an existing piece of music for arbitrary combinations of instruments. The model must understand the properties and typical playing styles of each instrument to allocate or generate new notes appropriately. We adopt **Transformer-VAE** from ([Zhao, 2024](https://openreview.net/forum?id=M75dBr10dZ){:target="_blank"}) as the major baseline, the strongest previously reported model for multitrack arrangement without assumptions on track type or number. It combines Transformer-based long-term and inter-track modeling with a VQ-VAE generation module. Additionally, the **Rule-Based** method distributes notes evenly by pitch across instruments. Results from an ablation variant of our model are also included where the generative pre-training phrase is removed (**w/o PT**).

<div class="wide-table">
<div class="wide-table">
<table class="table table-bordered">
  <thead>
    <tr>
      <th>Model</th>
      <th>#1 (Jazz Band)</th>
      <th>#2 (Jazz Band)</th>
      <th>#3 (Rock Band)</th>
      <th>#4 (Rock Band)</th>
      <th>#5 (String Trio)</th>
      <th>#6 (String Trio)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>Source Music</th>
      <td><audio controls><source src="/assets/for_projects/Arrangement/Band Arrangement/jazz band/fly_me__song.mp3" type="audio/mpeg"></audio></td>
      <td><audio controls><source src="/assets/for_projects/Arrangement/Band Arrangement/jazz band/rainbow__song.mp3" type="audio/mpeg"></audio></td>
      <td><audio controls><source src="/assets/for_projects/Arrangement/Band Arrangement/rock band/butterfly__song.mp3" type="audio/mpeg"></audio></td>
      <td><audio controls><source src="/assets/for_projects/Arrangement/Band Arrangement/rock band/buweishei__song.mp3" type="audio/mpeg"></audio></td>
      <td><audio controls><source src="/assets/for_projects/Arrangement/Band Arrangement/string trio/first_love__song.mp3" type="audio/mpeg"></audio></td>
      <td><audio controls><source src="/assets/for_projects/Arrangement/Band Arrangement/string trio/rainbow__song.mp3" type="audio/mpeg"></audio></td>
    </tr>
    <tr>
      <th>Ours</th>
      <td><audio controls><source src="/assets/for_projects/Arrangement/Band Arrangement/jazz band/fly_me_ours.mp3" type="audio/mpeg"></audio></td>
      <td><audio controls><source src="/assets/for_projects/Arrangement/Band Arrangement/jazz band/rainbow_ours.mp3" type="audio/mpeg"></audio></td>
      <td><audio controls><source src="/assets/for_projects/Arrangement/Band Arrangement/rock band/butterfly_ours.mp3" type="audio/mpeg"></audio></td>
      <td><audio controls><source src="/assets/for_projects/Arrangement/Band Arrangement/rock band/buweishei_ours.mp3" type="audio/mpeg"></audio></td>
      <td><audio controls><source src="/assets/for_projects/Arrangement/Band Arrangement/string trio/first_love_ours.mp3" type="audio/mpeg"></audio></td>
      <td><audio controls><source src="/assets/for_projects/Arrangement/Band Arrangement/string trio/rainbow_ours.mp3" type="audio/mpeg"></audio></td>
    </tr>
    <tr>
      <th>Transformer-VAE</th>
      <td><audio controls><source src="/assets/for_projects/Arrangement/Band Arrangement/jazz band/fly_me_qnaxl.mp3" type="audio/mpeg"></audio></td>
      <td><audio controls><source src="/assets/for_projects/Arrangement/Band Arrangement/jazz band/rainbow_qnaxl.mp3" type="audio/mpeg"></audio></td>
      <td><audio controls><source src="/assets/for_projects/Arrangement/Band Arrangement/rock band/butterfly_qnaxl.mp3" type="audio/mpeg"></audio></td>
      <td><audio controls><source src="/assets/for_projects/Arrangement/Band Arrangement/rock band/buweishei_qnaxl.mp3" type="audio/mpeg"></audio></td>
      <td><audio controls><source src="/assets/for_projects/Arrangement/Band Arrangement/string trio/first_love_qnaxl.mp3" type="audio/mpeg"></audio></td>
      <td><audio controls><source src="/assets/for_projects/Arrangement/Band Arrangement/string trio/rainbow_qnaxl.mp3" type="audio/mpeg"></audio></td>
    </tr>
    <tr>
      <th>w/o PT</th>
      <td><audio controls><source src="/assets/for_projects/Arrangement/Band Arrangement/jazz band/fly_me_no_pt.mp3" type="audio/mpeg"></audio></td>
      <td><audio controls><source src="/assets/for_projects/Arrangement/Band Arrangement/jazz band/rainbow_no_pt.mp3" type="audio/mpeg"></audio></td>
      <td><audio controls><source src="/assets/for_projects/Arrangement/Band Arrangement/rock band/butterfly_no_pt.mp3" type="audio/mpeg"></audio></td>
      <td><audio controls><source src="/assets/for_projects/Arrangement/Band Arrangement/rock band/buweishei_no_pt.mp3" type="audio/mpeg"></audio></td>
      <td><audio controls><source src="/assets/for_projects/Arrangement/Band Arrangement/string trio/first_love_no_pt.mp3" type="audio/mpeg"></audio></td>
      <td><audio controls><source src="/assets/for_projects/Arrangement/Band Arrangement/string trio/rainbow_no_pt.mp3" type="audio/mpeg"></audio></td>
    </tr>
    <tr>
      <th>Rule-Based</th>
      <td><audio controls><source src="/assets/for_projects/Arrangement/Band Arrangement/jazz band/fly_me_rule.mp3" type="audio/mpeg"></audio></td>
      <td><audio controls><source src="/assets/for_projects/Arrangement/Band Arrangement/jazz band/rainbow_rule.mp3" type="audio/mpeg"></audio></td>
      <td><audio controls><source src="/assets/for_projects/Arrangement/Band Arrangement/rock band/butterfly_rule.mp3" type="audio/mpeg"></audio></td>
      <td><audio controls><source src="/assets/for_projects/Arrangement/Band Arrangement/rock band/buweishei_rule.mp3" type="audio/mpeg"></audio></td>
      <td><audio controls><source src="/assets/for_projects/Arrangement/Band Arrangement/string trio/first_love_rule.mp3" type="audio/mpeg"></audio></td>
      <td><audio controls><source src="/assets/for_projects/Arrangement/Band Arrangement/string trio/rainbow_rule.mp3" type="audio/mpeg"></audio></td>
    </tr>
  </tbody>
</table>
</div>
</div>

  <div class="container no-gutter small-padding"> </div>

## Piano Reduction

This task focuses on simplifying multi-instrumental musical pieces into solo piano accompaniments that ensure pianistic playability while preserving the original musical essence, i.e., harmonies and textures. The major baseline is **UNet** from ([Terao, 2023](https://ieeexplore.ieee.org/abstract/document/10095462){:target="_blank"}), the most recent work in this area. Additionally, **Rule-F** is the flattened multitrack where the piano plays all notes, and **Rule-O** is the original piano track.

The original melody is played with a different instrument and mixed with the generated piano accompaniments.

<div class="wide-table">
<table class="table table-bordered">
  <thead>
    <tr>
      <th>Model</th>
      <th>#1</th>
      <th>#2</th>
      <th>#3</th>
      <th>#4</th>
      <th>#5</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>Source Music</th>
      <td><audio controls><source src="/assets/for_projects/Arrangement/Piano Reduction/1876--song.mp3" type="audio/mpeg"></audio></td>
      <td><audio controls><source src="/assets/for_projects/Arrangement/Piano Reduction/1877--song.mp3" type="audio/mpeg"></audio></td>
      <td><audio controls><source src="/assets/for_projects/Arrangement/Piano Reduction/1880--song.mp3" type="audio/mpeg"></audio></td>
      <td><audio controls><source src="/assets/for_projects/Arrangement/Piano Reduction/1884--song.mp3" type="audio/mpeg"></audio></td>
      <td><audio controls><source src="/assets/for_projects/Arrangement/Piano Reduction/1889--song.mp3" type="audio/mpeg"></audio></td>
    </tr>
    <tr>
      <th>Ours</th>
      <td><audio controls><source src="/assets/for_projects/Arrangement/Piano Reduction/1876-ours.mp3" type="audio/mpeg"></audio></td>
      <td><audio controls><source src="/assets/for_projects/Arrangement/Piano Reduction/1877-ours.mp3" type="audio/mpeg"></audio></td>
      <td><audio controls><source src="/assets/for_projects/Arrangement/Piano Reduction/1880-ours.mp3" type="audio/mpeg"></audio></td>
      <td><audio controls><source src="/assets/for_projects/Arrangement/Piano Reduction/1884-ours.mp3" type="audio/mpeg"></audio></td>
      <td><audio controls><source src="/assets/for_projects/Arrangement/Piano Reduction/1889-ours.mp3" type="audio/mpeg"></audio></td>
    </tr>
    <tr>
      <th>UNet</th>
      <td><audio controls><source src="/assets/for_projects/Arrangement/Piano Reduction/1876-unet.mp3" type="audio/mpeg"></audio></td>
      <td><audio controls><source src="/assets/for_projects/Arrangement/Piano Reduction/1877-unet.mp3" type="audio/mpeg"></audio></td>
      <td><audio controls><source src="/assets/for_projects/Arrangement/Piano Reduction/1880-unet.mp3" type="audio/mpeg"></audio></td>
      <td><audio controls><source src="/assets/for_projects/Arrangement/Piano Reduction/1884-unet.mp3" type="audio/mpeg"></audio></td>
      <td><audio controls><source src="/assets/for_projects/Arrangement/Piano Reduction/1889-unet.mp3" type="audio/mpeg"></audio></td>
    </tr>
    <tr>
      <th>w/o PT</th>
      <td><audio controls><source src="/assets/for_projects/Arrangement/Piano Reduction/1876-nopt.mp3" type="audio/mpeg"></audio></td>
      <td><audio controls><source src="/assets/for_projects/Arrangement/Piano Reduction/1877-nopt.mp3" type="audio/mpeg"></audio></td>
      <td><audio controls><source src="/assets/for_projects/Arrangement/Piano Reduction/1880-nopt.mp3" type="audio/mpeg"></audio></td>
      <td><audio controls><source src="/assets/for_projects/Arrangement/Piano Reduction/1884-nopt.mp3" type="audio/mpeg"></audio></td>
      <td><audio controls><source src="/assets/for_projects/Arrangement/Piano Reduction/1889-nopt.mp3" type="audio/mpeg"></audio></td>
    </tr>
    <tr>
      <th>Rule-F</th>
      <td><audio controls><source src="/assets/for_projects/Arrangement/Piano Reduction/1876-rule-f.mp3" type="audio/mpeg"></audio></td>
      <td><audio controls><source src="/assets/for_projects/Arrangement/Piano Reduction/1877-rule-f.mp3" type="audio/mpeg"></audio></td>
      <td><audio controls><source src="/assets/for_projects/Arrangement/Piano Reduction/1880-rule-f.mp3" type="audio/mpeg"></audio></td>
      <td><audio controls><source src="/assets/for_projects/Arrangement/Piano Reduction/1884-rule-f.mp3" type="audio/mpeg"></audio></td>
      <td><audio controls><source src="/assets/for_projects/Arrangement/Piano Reduction/1889-rule-f.mp3" type="audio/mpeg"></audio></td>
    </tr>
    <tr>
      <th>Rule-O</th>
      <td><audio controls><source src="/assets/for_projects/Arrangement/Piano Reduction/1876-rule-o.mp3" type="audio/mpeg"></audio></td>
      <td><audio controls><source src="/assets/for_projects/Arrangement/Piano Reduction/1877-rule-o.mp3" type="audio/mpeg"></audio></td>
      <td><audio controls><source src="/assets/for_projects/Arrangement/Piano Reduction/1880-rule-o.mp3" type="audio/mpeg"></audio></td>
      <td><audio controls><source src="/assets/for_projects/Arrangement/Piano Reduction/1884-rule-o.mp3" type="audio/mpeg"></audio></td>
      <td><audio controls><source src="/assets/for_projects/Arrangement/Piano Reduction/1889-rule-o.mp3" type="audio/mpeg"></audio></td>
    </tr>
  </tbody>
</table>
</div>

  <div class="container no-gutter small-padding"> </div>

## Drum Arrangement

This task involves creating a drum track for songs that lack one. The model needs to recognize the groove of the music and enhance it using the drum set, and further, handle transitions between musical phrases to drive the music forward and make it more engaging, which consequently requires a better understanding of musical structure. The **Composer's Assistant 2 (CA v2)** from ([Malandro, 2024](https://ismir2024program.ismir.net/poster_60.html){:target="_blank"}) was used as the major baseline, which is a strong track infilling model capable of handling multitrack inputs and generating drum outputs.

<div class="wide-table">
<table class="table table-bordered">
  <thead>
    <tr>
      <th>Model</th>
      <th>#1</th>
      <th>#2</th>
      <th>#3</th>
      <th>#4</th>
      <th>#5</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>Source Music</th>
      <td><audio controls><source src="/assets/for_projects/Arrangement/Drum Arrangement/1876--song.mp3" type="audio/mpeg"></audio></td>
      <td><audio controls><source src="/assets/for_projects/Arrangement/Drum Arrangement/1877--song.mp3" type="audio/mpeg"></audio></td>
      <td><audio controls><source src="/assets/for_projects/Arrangement/Drum Arrangement/1881--song.mp3" type="audio/mpeg"></audio></td>
      <td><audio controls><source src="/assets/for_projects/Arrangement/Drum Arrangement/1882--song.mp3" type="audio/mpeg"></audio></td>
      <td><audio controls><source src="/assets/for_projects/Arrangement/Drum Arrangement/1887--song.mp3" type="audio/mpeg"></audio></td>
    </tr>
    <tr>
      <th>Ours</th>
      <td><audio controls><source src="/assets/for_projects/Arrangement/Drum Arrangement/1876-ours.mp3" type="audio/mpeg"></audio></td>
      <td><audio controls><source src="/assets/for_projects/Arrangement/Drum Arrangement/1877-ours.mp3" type="audio/mpeg"></audio></td>
      <td><audio controls><source src="/assets/for_projects/Arrangement/Drum Arrangement/1881-ours.mp3" type="audio/mpeg"></audio></td>
      <td><audio controls><source src="/assets/for_projects/Arrangement/Drum Arrangement/1882-ours.mp3" type="audio/mpeg"></audio></td>
      <td><audio controls><source src="/assets/for_projects/Arrangement/Drum Arrangement/1887-ours.mp3" type="audio/mpeg"></audio></td>
    </tr>
    <tr>
      <th>Ground Truth</th>
      <td><audio controls><source src="/assets/for_projects/Arrangement/Drum Arrangement/1876-gt.mp3" type="audio/mpeg"></audio></td>
      <td><audio controls><source src="/assets/for_projects/Arrangement/Drum Arrangement/1877-gt.mp3" type="audio/mpeg"></audio></td>
      <td><audio controls><source src="/assets/for_projects/Arrangement/Drum Arrangement/1881-gt.mp3" type="audio/mpeg"></audio></td>
      <td><audio controls><source src="/assets/for_projects/Arrangement/Drum Arrangement/1882-gt.mp3" type="audio/mpeg"></audio></td>
      <td><audio controls><source src="/assets/for_projects/Arrangement/Drum Arrangement/1887-gt.mp3" type="audio/mpeg"></audio></td>
    </tr>
    <tr>
      <th>CA v2</th>
      <td><audio controls><source src="/assets/for_projects/Arrangement/Drum Arrangement/1876-cav2.mp3" type="audio/mpeg"></audio></td>
      <td><audio controls><source src="/assets/for_projects/Arrangement/Drum Arrangement/1877-cav2.mp3" type="audio/mpeg"></audio></td>
      <td><audio controls><source src="/assets/for_projects/Arrangement/Drum Arrangement/1881-cav2.mp3" type="audio/mpeg"></audio></td>
      <td><audio controls><source src="/assets/for_projects/Arrangement/Drum Arrangement/1882-cav2.mp3" type="audio/mpeg"></audio></td>
      <td><audio controls><source src="/assets/for_projects/Arrangement/Drum Arrangement/1887-cav2.mp3" type="audio/mpeg"></audio></td>
    </tr>
    <tr>
      <th>w/o PT</th>
      <td><audio controls><source src="/assets/for_projects/Arrangement/Drum Arrangement/1876-nopt.mp3" type="audio/mpeg"></audio></td>
      <td><audio controls><source src="/assets/for_projects/Arrangement/Drum Arrangement/1877-nopt.mp3" type="audio/mpeg"></audio></td>
      <td><audio controls><source src="/assets/for_projects/Arrangement/Drum Arrangement/1881-nopt.mp3" type="audio/mpeg"></audio></td>
      <td><audio controls><source src="/assets/for_projects/Arrangement/Drum Arrangement/1882-nopt.mp3" type="audio/mpeg"></audio></td>
      <td><audio controls><source src="/assets/for_projects/Arrangement/Drum Arrangement/1887-nopt.mp3" type="audio/mpeg"></audio></td>
    </tr>
  </tbody>
</table>
</div>

## Long-Term Arrangement

Our model also supports long-term arrangement. Below, we present full-song arrangement results for three tasks: band arrangement, piano reduction, and drum arrangement.

 
### Band Arrangement

Original instruments: <em style="color: #d62728;">Piccolo</em>, <em style="color: #1f77b4;">Acoustic Piano</em>, <em style="color: #2ca02c;">Electric Piano</em>, <em style="color: #17becf;">Strings</em>, and <em style="color: #ff7f0e;">Drumset</em>.

<midi-visualizer src="/assets/for_projects/Arrangement/Showcase/band_caihong_input.mid" id="original-visualizer-band"></midi-visualizer>
<midi-player src="/assets/for_projects/Arrangement/Showcase/band_caihong_input.mid" sound-font="/assets/for_projects/Arrangement/soundfonts/silence" visualizer="#original-visualizer-band" id="original-player-band"></midi-player>
<audio id="original-audio-band">
  <source type="audio/mpeg" src="/assets/for_projects/Arrangement/Showcase/band_caihong_input.mp3">
  Your browser does not support the audio tag.
</audio>

<script>
  // Wait for scripts to load, then sync
  document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit for the sync script to be available
    setTimeout(function() {
      if (typeof syncMidiWithAudio === 'function') {
        syncMidiWithAudio('original-player-band', 'original-audio-band');
      }
    }, 100);
  });
</script>
<div style="margin-top: 1em;"></div>

Arrange for instruments: <em style="color: #d62728;">Soprano Sax</em>, <em style="color: #1f77b4;">Acoustic Piano</em>, <em style="color: #e377c2;">Acoustic Guitar</em>, <em style="color: #9467bd;">Electric Bass</em>, <em style="color: #8c564b;">Violin</em>, <em style="color: #17becf;">Strings</em>, and <em style="color: #ff7f0e;">Brass Section</em>.

<midi-visualizer src="/assets/for_projects/Arrangement/Showcase/band_caihong_output.mid" id="test-visualizer-band"></midi-visualizer>
<midi-player src="/assets/for_projects/Arrangement/Showcase/band_caihong_output.mid" sound-font="/assets/for_projects/Arrangement/soundfonts/silence" visualizer="#test-visualizer-band" id="test-player-band"></midi-player>
<audio id="test-audio-band">
  <source type="audio/mpeg" src="/assets/for_projects/Arrangement/Showcase/band_caihong_output.mp3">
  Your browser does not support the audio tag.
</audio>

<script>
  // Wait for scripts to load, then sync
  document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit for the sync script to be available
    setTimeout(function() {
      if (typeof syncMidiWithAudio === 'function') {
        syncMidiWithAudio('test-player-band', 'test-audio-band');
      }
    }, 100);
  });
</script>
<div style="margin-top: 1em;"></div>

### Piano Reduction

Original instruments: <em style="color: #d62728;">Dizi</em>, <em style="color: #17becf;">Erhu</em>, <em style="color: #bcbd22;">Guzheng</em>, <em style="color: #1f77b4;">Strings</em>, <em style="color: #9467bd;">Contrabass</em>, <em style="color: #2ca02c;">Glockenspiel</em>, <em style="color: #e377c2;">Piano</em>, and <em style="color: #98df8a;">Sound Effects</em>.

<midi-visualizer src="/assets/for_projects/Arrangement/Showcase/piano_mengdeguangdian_input.mid" id="demo_p2_input-visualizer"></midi-visualizer>
<midi-player src="/assets/for_projects/Arrangement/Showcase/piano_mengdeguangdian_input.mid" sound-font="/assets/for_projects/Arrangement/soundfonts/silence" visualizer="#demo_p2_input-visualizer" id="demo_p2_input-player"></midi-player>
<audio id="demo_p2_input-audio">
  <source type="audio/mpeg" src="/assets/for_projects/Arrangement/Showcase/piano_mengdeguangdian_input.mp3">
  Your browser does not support the audio tag.
</audio>

<script>
  // Wait for scripts to load, then sync
  document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit for the sync script to be available
    setTimeout(function() {
      if (typeof syncMidiWithAudio === 'function') {
        syncMidiWithAudio('demo_p2_input-player', 'demo_p2_input-audio');
      }
    }, 100);
  });
</script>
<div style="margin-top: 1em;"></div>

Arrange for instrument: <em style="color: #1f77b4;">Acoustic Piano</em>. The original melody is played with a different instrument and mixed with the generated piano accompaniment.

<midi-visualizer src="/assets/for_projects/Arrangement/Showcase/piano_mengdeguangdian_output.mid" id="demo_p2_output-visualizer"></midi-visualizer>
<midi-player src="/assets/for_projects/Arrangement/Showcase/piano_mengdeguangdian_output.mid" sound-font="/assets/for_projects/Arrangement/soundfonts/silence" visualizer="#demo_p2_output-visualizer" id="demo_p2_output-player"></midi-player>
<audio id="demo_p2_output-audio">
  <source type="audio/mpeg" src="/assets/for_projects/Arrangement/Showcase/piano_mengdeguangdian_output.mp3">
  Your browser does not support the audio tag.
</audio>

<script>
  // Wait for scripts to load, then sync
  document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit for the sync script to be available
    setTimeout(function() {
      if (typeof syncMidiWithAudio === 'function') {
        syncMidiWithAudio('demo_p2_output-player', 'demo_p2_output-audio');
      }
    }, 100);
  });
</script>
<div style="margin-top: 1em;"></div>

### Drum Arrangement

Original instrument: <em style="color: #1f77b4;">Acoustic Piano</em>.

<midi-visualizer src="/assets/for_projects/Arrangement/Showcase/drum_butterfly_input.mid" id="demo_p3_input-visualizer"></midi-visualizer>
<midi-player src="/assets/for_projects/Arrangement/Showcase/drum_butterfly_input.mid" sound-font="/assets/for_projects/Arrangement/soundfonts/silence" visualizer="#demo_p3_input-visualizer" id="demo_p3_input-player"></midi-player>
<audio id="demo_p3_input-audio">
  <source type="audio/mpeg" src="/assets/for_projects/Arrangement/Showcase/drum_butterfly_input.mp3">
  Your browser does not support the audio tag.
</audio>

<script>
  // Wait for scripts to load, then sync
  document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit for the sync script to be available
    setTimeout(function() {
      if (typeof syncMidiWithAudio === 'function') {
        syncMidiWithAudio('demo_p3_input-player', 'demo_p3_input-audio');
      }
    }, 100);
  });
</script>
<div style="margin-top: 1em;"></div>

Arrange for instrument: <em style="color: #d62728;">Drumset</em>.

<midi-visualizer src="/assets/for_projects/Arrangement/Showcase/drum_butterfly_output_mixed.mid" id="demo_p3_output-visualizer"></midi-visualizer>
<midi-player src="/assets/for_projects/Arrangement/Showcase/drum_butterfly_output_mixed.mid" sound-font="/assets/for_projects/Arrangement/soundfonts/silence" visualizer="#demo_p3_output-visualizer" id="demo_p3_output-player"></midi-player>
<audio id="demo_p3_output-audio">
  <source type="audio/mpeg" src="/assets/for_projects/Arrangement/Showcase/drum_butterfly_output.mp3">
  Your browser does not support the audio tag.
</audio>

<script>
  // Wait for scripts to load, then sync
  document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit for the sync script to be available
    setTimeout(function() {
      if (typeof syncMidiWithAudio === 'function') {
        syncMidiWithAudio('demo_p3_output-player', 'demo_p3_output-audio');
      }
    }, 100);
  });
</script>
<div style="margin-top: 1em;"></div>
 
  <div class="container no-gutter no-padding">  
  </div>
 
  <div class="container no-gutter no-padding">  
  </div>
 
 

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

## Citation
<pre style="background-color: #f0f0f0; font-family: Courier, Consolas, monospace;">
@inproceedings{ou2025unifying,
  title     = {Unifying Symbolic Music Arrangement: Track-Aware Reconstruction and Structured Tokenization},
  author    = {Ou, Longshen and Zhao, Jingwei and Wang, Ziyu and Xia, Gus and Liang, Qihao and Hopkins, Torin and Wang, Ye},
  booktitle = {Proceedings of the 39th Conference on Neural Information Processing Systems (NeurIPS)},
  year      = {2025}
}
</pre>