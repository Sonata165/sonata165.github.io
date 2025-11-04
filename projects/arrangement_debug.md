---
layout: page
title: "MIDI Visualizer Debug"
permalink: /automatic_arrangement_debug
---

# Minimal MIDI Visualizer Test

<script src="/assets/js/html-midi-player-bundle.js"></script>
<script src="/assets/js/midi-audio-sync.js"></script>

<script>
  var i_vis;
  var visualizers = document.getElementsByTagName("midi-visualizer");
  for (i_vis = 0; i_vis < visualizers.length; i_vis++) {
    visualizers[i_vis].config = {
      noteHeight: 2.5,
      pixelsPerTimeStep: 20,
      minPitch: 32,
      maxPitch: 96,
    };
  }
</script>

<style>
  midi-visualizer { 
    display: block; 
    width: 100%; 
    min-height: 300px; 
  }
  midi-player { 
    display: block; 
    width: 100%; 
    height: 25px;
  }
  
  /* Base note styling with opacity */
  midi-visualizer svg rect.note { 
    opacity: calc(min(1, (var(--midi-velocity) + 30) / 128) * 0.75); 
  }
  
  /* Active note styling for play progress - black stroke to show current position */
  midi-visualizer svg rect.note.active { 
    opacity: calc(min(1, (var(--midi-velocity) + 30) / 128) * 0.9); 
    stroke: rgb(0, 0, 0); 
    stroke-width: 2; 
    stroke-opacity: 1; 
  }
  
  /* Color assignments for different MIDI programs (tracks) - ONLY for Test 2 */
  #test-visualizer-2 svg rect.note { 
    fill: #17becf; 
    opacity: 75%; 
  }
  #test-visualizer-2 svg rect.note[data-program="0"] { fill: #1f77b4; opacity: 75%; }
  #test-visualizer-2 svg rect.note[data-program="8"] { fill: #2ca02c; opacity: 75%; }
  #test-visualizer-2 svg rect.note[data-program="16"] { fill: #bcbd22; opacity: 75%; }
  #test-visualizer-2 svg rect.note[data-program="24"] { fill: #e377c2; opacity: 75%; }
  #test-visualizer-2 svg rect.note[data-program="32"] { fill: #9467bd; opacity: 75%; }
  #test-visualizer-2 svg rect.note[data-program="40"] { fill: #8c564b; opacity: 75%; }
  #test-visualizer-2 svg rect.note[data-program="48"] { fill: #ffbb78; opacity: 75%; }
  #test-visualizer-2 svg rect.note[data-program="56"] { fill: #ff7f0e; opacity: 75%; }
  #test-visualizer-2 svg rect.note[data-program="64"] { fill: #d62728; opacity: 75%; }
  #test-visualizer-2 svg rect.note[data-program="72"] { fill: #d62728; opacity: 75%; }
  #test-visualizer-2 svg rect.note[data-program="80"] { fill: #1b9e77; opacity: 75%; }
  #test-visualizer-2 svg rect.note[data-program="88"] { fill: #d62728; }
  #test-visualizer-2 svg rect.note[data-program="89"] { fill: #98df8a; opacity: 75%; }
  #test-visualizer-2 svg rect.note[data-program="1"] { fill: #d62728; opacity: 75%; }
  
  /* Active note styling for Test 2 - keep black stroke but preserve track color */
  #test-visualizer-2 svg rect.note.active { 
    stroke: rgb(0, 0, 0); 
    stroke-width: 2; 
    stroke-opacity: 1; 
  }
  
  /* Color assignments for Test 3 - same as Test 2 */
  #test-visualizer-3 svg rect.note { 
    fill: #17becf; 
    opacity: 75%; 
  }
  #test-visualizer-3 svg rect.note[data-program="0"] { fill: #1f77b4; opacity: 75%; }
  #test-visualizer-3 svg rect.note[data-program="8"] { fill: #2ca02c; opacity: 75%; }
  #test-visualizer-3 svg rect.note[data-program="16"] { fill: #bcbd22; opacity: 75%; }
  #test-visualizer-3 svg rect.note[data-program="24"] { fill: #e377c2; opacity: 75%; }
  #test-visualizer-3 svg rect.note[data-program="32"] { fill: #9467bd; opacity: 75%; }
  #test-visualizer-3 svg rect.note[data-program="40"] { fill: #8c564b; opacity: 75%; }
  #test-visualizer-3 svg rect.note[data-program="48"] { fill: #ffbb78; opacity: 75%; }
  #test-visualizer-3 svg rect.note[data-program="56"] { fill: #ff7f0e; opacity: 75%; }
  #test-visualizer-3 svg rect.note[data-program="64"] { fill: #d62728; opacity: 75%; }
  #test-visualizer-3 svg rect.note[data-program="72"] { fill: #d62728; opacity: 75%; }
  #test-visualizer-3 svg rect.note[data-program="80"] { fill: #1b9e77; opacity: 75%; }
  #test-visualizer-3 svg rect.note[data-program="88"] { fill: #d62728; }
  #test-visualizer-3 svg rect.note[data-program="89"] { fill: #98df8a; opacity: 75%; }
  #test-visualizer-3 svg rect.note[data-program="1"] { fill: #d62728; opacity: 75%; }
  #test-visualizer-3 svg rect.note.active { 
    stroke: rgb(0, 0, 0); 
    stroke-width: 2; 
    stroke-opacity: 1; 
  }
</style>

## Test 1: Simple MIDI Visualizer (default colors)

<midi-visualizer src="/assets/for_projects/Arrangement/Showcase/band_caihong_output.mid" id="test-visualizer"></midi-visualizer>
<midi-player src="/assets/for_projects/Arrangement/Showcase/band_caihong_output.mid" visualizer="#test-visualizer"></midi-player>

## Test 2: MIDI Visualizer with Track Colors

<midi-visualizer src="/assets/for_projects/Arrangement/Showcase/band_caihong_output.mid" id="test-visualizer-2"></midi-visualizer>
<midi-player src="/assets/for_projects/Arrangement/Showcase/band_caihong_output.mid" visualizer="#test-visualizer-2"></midi-player>

## Test 3: MIDI Visualizer with MP3 Audio (silent MIDI, visual only)

<midi-visualizer src="/assets/for_projects/Arrangement/Showcase/band_caihong_output.mid" id="test-visualizer-3"></midi-visualizer>
<midi-player src="/assets/for_projects/Arrangement/Showcase/band_caihong_output.mid" sound-font="/assets/for_projects/Arrangement/soundfonts/silence" visualizer="#test-visualizer-3" id="test-player-3"></midi-player>
<audio id="test-audio-3">
  <source type="audio/mpeg" src="/assets/for_projects/Arrangement/Showcase/band_caihong_output.mp3">
  Your browser does not support the audio tag.
</audio>

<script>
  // Simple one-line sync
  syncMidiWithAudio('test-player-3', 'test-audio-3');
</script>

## Test 4: Another midi

<midi-visualizer src="/assets/for_projects/Arrangement/Showcase/band_caihong_input.mid" id="test-visualizer-4"></midi-visualizer>
<midi-player src="/assets/for_projects/Arrangement/Showcase/band_caihong_input.mid" sound-font="/assets/for_projects/Arrangement/soundfonts/silence" visualizer="#test-visualizer-4" id="test-player-4"></midi-player>
<audio id="test-audio-4">
  <source type="audio/mpeg" src="/assets/for_projects/Arrangement/Showcase/band_caihong_input.mp3">
  Your browser does not support the audio tag.
</audio>

<script>
  // Simple one-line sync
  syncMidiWithAudio('test-player-4', 'test-audio-4');
</script>
