---
layout: page
title: "PhraseVAE and PhraseLDM: Latent Diffusion for Full-Song Multitrack Symbolic Music Generation"
permalink: /midi_ldm
---
 
<!-- Google Analytics tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-MK1PD93QHP"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-MK1PD93QHP');
</script>


# **Links**: [ [Paper](/assets/pdf/papers/PhraseLDM_Report.pdf){:target="_blank"}   ] | [ [Code](https://github.com/Sonata165/PhraseLDM_code){:target="_blank"} ] | [ [Citation](#citation) ]

Abstract: This technical report presents a new paradigm for full-song symbolic music generation. Existing symbolic models operate on note-attribute tokens and suffer from extremely long sequences, limited context length, and weak support for long-range structure. We address these issues by introducing PhraseVAE and PhraseLDM, the first latent diffusion framework designed for **full-song multitrack** symbolic music. PhraseVAE compresses an arbitrary variable-length polyphonic note sequence into a single compact 64-dimensional phrase-level latent representation with high reconstruction fidelity, allowing a well-structured latent space and efficient generative modeling. Built on this latent space, PhraseLDM generates an entire multi-track song in a single pass without any autoregressive components. The system eliminates bar-wise sequential modeling, supports up to 128 bars of music (8 minutes at 64 bpm), and produces complete songs with coherent local texture, idiomatic instrument patterns, and clear global structure. With only 45M parameters, our framework generates a full song within seconds while maintaining competitive musical quality and generation diversity. Together, these results show that phrase-level latent diffusion provides an effective and scalable solution to long-sequence modeling in symbolic music generation. We hope this work encourages future symbolic music research to move beyond note-attribute tokens and to consider phrase-level units as a more effective and musically meaningful modeling target.


## Demos

Here are some generation examples from our models. The model is trained with a 3-track pop music dataset (POP909), the training set size is around 800 songs.

**Table of Contents:**
- [Demos](#demos)
  - [Full Song Generation Results](#full-song-generation-results)
    - [Unconditional Model](#unconditional-model)
    - [Length Conditioned Model](#length-conditioned-model)
    - [Length and Structure Conditioned Model](#length-and-structure-conditioned-model)
  - [Quality Showcase](#quality-showcase)
    - [Piano Textures](#piano-textures)
    - [Intro](#intro)
    - [Outro](#outro)
    - [Interlude](#interlude)
  - [VAE results](#vae-results)
    - [Interpolate](#interpolate)
    - [Prior Sampling](#prior-sampling)

You can also download [all generated samples](https://drive.google.com/file/d/1NbEQTythbUfEKNGDaoPU8c8RpMzqBvkT/view?usp=sharing){:target="_blank"} collected throughout the entire course of the project, for both VAE and LDM, without cherry-picking.


### Full Song Generation Results
Below we present a randomly selected subset of LDM generations (no cherry-picking).

#### Unconditional Model

<style>
.tab-container {
  margin: 2em 0;
}

.tab-buttons {
  display: flex;
  border-bottom: 2px solid #ddd;
  margin-bottom: 1em;
}

.tab-btn {
  background: none;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-bottom: 3px solid transparent;
  font-size: 14px;
  color: #666;
  transition: all 0.3s ease;
}

.tab-btn:hover {
  color: #333;
  background-color: #f5f5f5;
}

.tab-btn.active {
  color: #333;
  border-bottom-color: #007cba;
  font-weight: 500;
}

.tab-content {
  display: none;
}

.tab-content.active {
  display: block;
}
</style>

<div class="tab-container">
  <div class="tab-buttons">
    <button onclick="showTab(1)" class="tab-btn active" id="tab-btn-1">Song 1</button>
    <button onclick="showTab(2)" class="tab-btn" id="tab-btn-2">Song 2</button>
    <button onclick="showTab(3)" class="tab-btn" id="tab-btn-3">Song 3</button>
    <button onclick="showTab(4)" class="tab-btn" id="tab-btn-4">Song 4</button>
    <button onclick="showTab(5)" class="tab-btn" id="tab-btn-5">Song 5</button>
    <button onclick="showTab(6)" class="tab-btn" id="tab-btn-6">Song 6</button>
    <button onclick="showTab(7)" class="tab-btn" id="tab-btn-7">Song 7</button>
    <button onclick="showTab(8)" class="tab-btn" id="tab-btn-8">Song 8</button>
  </div>
  
  <div id="tab-1" class="tab-content active">
    <div style="margin-bottom: 2em;">
      <img src="assets/for_projects/PhraseLDM/song_demos/unconditional/1.png" alt="Song 1 Piano Roll" style="width: 100%; height: auto; margin-bottom: 1em;">
      <div style="display: flex; align-items: center; gap: 1em;">
        <a href="assets/for_projects/PhraseLDM/song_demos/unconditional/1.mid" download style="color: #007cba; text-decoration: none; font-size: 14px;">⬇️ MIDI</a>
        <audio controls style="flex: 1;">
          <source src="assets/for_projects/PhraseLDM/song_demos/unconditional/1.mp3" type="audio/mpeg">
        </audio>
      </div>
    </div>
  </div>
  
  <div id="tab-2" class="tab-content">
    <div style="margin-bottom: 2em;">
      <img src="assets/for_projects/PhraseLDM/song_demos/unconditional/2.png" alt="Song 2 Piano Roll" style="width: 100%; height: auto; margin-bottom: 1em;">
      <div style="display: flex; align-items: center; gap: 1em;">
        <a href="assets/for_projects/PhraseLDM/song_demos/unconditional/2.mid" download style="color: #007cba; text-decoration: none; font-size: 14px;">⬇️ MIDI</a>
        <audio controls style="flex: 1;">
          <source src="assets/for_projects/PhraseLDM/song_demos/unconditional/2.mp3" type="audio/mpeg">
        </audio>
      </div>
    </div>
  </div>

  <div id="tab-3" class="tab-content">
    <div style="margin-bottom: 2em;">
      <img src="assets/for_projects/PhraseLDM/song_demos/unconditional/3.png" alt="Song 3 Piano Roll" style="width: 100%; height: auto; margin-bottom: 1em;">
      <div style="display: flex; align-items: center; gap: 1em;">
        <a href="assets/for_projects/PhraseLDM/song_demos/unconditional/3.mid" download style="color: #007cba; text-decoration: none; font-size: 14px;">⬇️ MIDI</a>
        <audio controls style="flex: 1;">
          <source src="assets/for_projects/PhraseLDM/song_demos/unconditional/3.mp3" type="audio/mpeg">
        </audio>
      </div>
    </div>
  </div>

  <div id="tab-4" class="tab-content">
    <div style="margin-bottom: 2em;">
      <img src="assets/for_projects/PhraseLDM/song_demos/unconditional/4.png" alt="Song 4 Piano Roll" style="width: 100%; height: auto; margin-bottom: 1em;">
      <div style="display: flex; align-items: center; gap: 1em;">
        <a href="assets/for_projects/PhraseLDM/song_demos/unconditional/4.mid" download style="color: #007cba; text-decoration: none; font-size: 14px;">⬇️ MIDI</a>
        <audio controls style="flex: 1;">
          <source src="assets/for_projects/PhraseLDM/song_demos/unconditional/4.mp3" type="audio/mpeg">
        </audio>
      </div>
    </div>
  </div>

  <div id="tab-5" class="tab-content">
    <div style="margin-bottom: 2em;">
      <img src="assets/for_projects/PhraseLDM/song_demos/unconditional/5.png" alt="Song 5 Piano Roll" style="width: 100%; height: auto; margin-bottom: 1em;">
      <div style="display: flex; align-items: center; gap: 1em;">
        <a href="assets/for_projects/PhraseLDM/song_demos/unconditional/5.mid" download style="color: #007cba; text-decoration: none; font-size: 14px;">⬇️ MIDI</a>
        <audio controls style="flex: 1;">
          <source src="assets/for_projects/PhraseLDM/song_demos/unconditional/5.mp3" type="audio/mpeg">
        </audio>
      </div>
    </div>
  </div>

  <div id="tab-6" class="tab-content">
    <div style="margin-bottom: 2em;">
      <img src="assets/for_projects/PhraseLDM/song_demos/unconditional/6.png" alt="Song 6 Piano Roll" style="width: 100%; height: auto; margin-bottom: 1em;">
      <div style="display: flex; align-items: center; gap: 1em;">
        <a href="assets/for_projects/PhraseLDM/song_demos/unconditional/6.mid" download style="color: #007cba; text-decoration: none; font-size: 14px;">⬇️ MIDI</a>
        <audio controls style="flex: 1;">
          <source src="assets/for_projects/PhraseLDM/song_demos/unconditional/6.mp3" type="audio/mpeg">
        </audio>
      </div>
    </div>
  </div>

  <div id="tab-7" class="tab-content">
    <div style="margin-bottom: 2em;">
      <img src="assets/for_projects/PhraseLDM/song_demos/unconditional/7.png" alt="Song 7 Piano Roll" style="width: 100%; height: auto; margin-bottom: 1em;">
      <div style="display: flex; align-items: center; gap: 1em;">
        <a href="assets/for_projects/PhraseLDM/song_demos/unconditional/7.mid" download style="color: #007cba; text-decoration: none; font-size: 14px;">⬇️ MIDI</a>
        <audio controls style="flex: 1;">
          <source src="assets/for_projects/PhraseLDM/song_demos/unconditional/7.mp3" type="audio/mpeg">
        </audio>
      </div>
    </div>
  </div>

  <div id="tab-8" class="tab-content">
    <div style="margin-bottom: 2em;">
      <img src="assets/for_projects/PhraseLDM/song_demos/unconditional/8.png" alt="Song 8 Piano Roll" style="width: 100%; height: auto; margin-bottom: 1em;">
      <div style="display: flex; align-items: center; gap: 1em;">
        <a href="assets/for_projects/PhraseLDM/song_demos/unconditional/8.mid" download style="color: #007cba; text-decoration: none; font-size: 14px;">⬇️ MIDI</a>
        <audio controls style="flex: 1;">
          <source src="assets/for_projects/PhraseLDM/song_demos/unconditional/8.mp3" type="audio/mpeg">
        </audio>
      </div>
    </div>
  </div>
</div>

<script>
function showTab(tabNumber) {
  // Hide all tab1 contents
  document.querySelectorAll('[id^="tab-"]').forEach(tab => {
    if (tab.id.startsWith('tab-') && !tab.id.startsWith('tab2-') && !tab.id.startsWith('tab3-') && !tab.id.includes('btn')) {
      tab.classList.remove('active');
    }
  });
  
  // Remove active class from all tab1 buttons
  document.querySelectorAll('[id^="tab-btn-"]').forEach(btn => {
    if (btn.id.startsWith('tab-btn-') && !btn.id.startsWith('tab-btn2-') && !btn.id.startsWith('tab-btn3-')) {
      btn.classList.remove('active');
    }
  });
  
  // Show selected tab content
  document.getElementById('tab-' + tabNumber).classList.add('active');
  document.getElementById('tab-btn-' + tabNumber).classList.add('active');
}

function showTab2(tabNumber) {
  // Hide all tab2 contents
  document.querySelectorAll('[id^="tab2-"]').forEach(tab => {
    tab.classList.remove('active');
  });
  
  // Remove active class from all tab2 buttons
  document.querySelectorAll('[id^="tab-btn2-"]').forEach(btn => {
    btn.classList.remove('active');
  });
  
  // Show selected tab2 content
  document.getElementById('tab2-' + tabNumber).classList.add('active');
  document.getElementById('tab-btn2-' + tabNumber).classList.add('active');
}

function showTab3(tabNumber) {
  // Hide all tab3 contents
  document.querySelectorAll('[id^="tab3-"]').forEach(tab => {
    tab.classList.remove('active');
  });
  
  // Remove active class from all tab3 buttons
  document.querySelectorAll('[id^="tab-btn3-"]').forEach(btn => {
    btn.classList.remove('active');
  });
  
  // Show selected tab3 content
  document.getElementById('tab3-' + tabNumber).classList.add('active');
  document.getElementById('tab-btn3-' + tabNumber).classList.add('active');
}
</script>

#### Length Conditioned Model

<div class="tab-container">
  <div class="tab-buttons">
    <button onclick="showTab2(1)" class="tab-btn active" id="tab-btn2-1">Song 1</button>
    <button onclick="showTab2(2)" class="tab-btn" id="tab-btn2-2">Song 2</button>
    <button onclick="showTab2(3)" class="tab-btn" id="tab-btn2-3">Song 3</button>
    <button onclick="showTab2(4)" class="tab-btn" id="tab-btn2-4">Song 4</button>
    <button onclick="showTab2(5)" class="tab-btn" id="tab-btn2-5">Song 5</button>
    <button onclick="showTab2(6)" class="tab-btn" id="tab-btn2-6">Song 6</button>
    <button onclick="showTab2(7)" class="tab-btn" id="tab-btn2-7">Song 7</button>
    <button onclick="showTab2(8)" class="tab-btn" id="tab-btn2-8">Song 8</button>
  </div>
  
  <div id="tab2-1" class="tab-content active">
    <div style="margin-bottom: 2em;">
      <img src="assets/for_projects/PhraseLDM/song_demos/length_conditioned/1.png" alt="Song 1 Piano Roll" style="width: 100%; height: auto; margin-bottom: 1em;">
      <div style="display: flex; align-items: center; gap: 1em;">
        <a href="assets/for_projects/PhraseLDM/song_demos/length_conditioned/1.mid" download style="color: #007cba; text-decoration: none; font-size: 14px;">⬇️ MIDI</a>
        <audio controls style="flex: 1;">
          <source src="assets/for_projects/PhraseLDM/song_demos/length_conditioned/1.mp3" type="audio/mpeg">
        </audio>
      </div>
    </div>
  </div>
  
  <div id="tab2-2" class="tab-content">
    <div style="margin-bottom: 2em;">
      <img src="assets/for_projects/PhraseLDM/song_demos/length_conditioned/2.png" alt="Song 2 Piano Roll" style="width: 100%; height: auto; margin-bottom: 1em;">
      <div style="display: flex; align-items: center; gap: 1em;">
        <a href="assets/for_projects/PhraseLDM/song_demos/length_conditioned/2.mid" download style="color: #007cba; text-decoration: none; font-size: 14px;">⬇️ MIDI</a>
        <audio controls style="flex: 1;">
          <source src="assets/for_projects/PhraseLDM/song_demos/length_conditioned/2.mp3" type="audio/mpeg">
        </audio>
      </div>
    </div>
  </div>

  <div id="tab2-3" class="tab-content">
    <div style="margin-bottom: 2em;">
      <img src="assets/for_projects/PhraseLDM/song_demos/length_conditioned/3.png" alt="Song 3 Piano Roll" style="width: 100%; height: auto; margin-bottom: 1em;">
      <div style="display: flex; align-items: center; gap: 1em;">
        <a href="assets/for_projects/PhraseLDM/song_demos/length_conditioned/3.mid" download style="color: #007cba; text-decoration: none; font-size: 14px;">⬇️ MIDI</a>
        <audio controls style="flex: 1;">
          <source src="assets/for_projects/PhraseLDM/song_demos/length_conditioned/3.mp3" type="audio/mpeg">
        </audio>
      </div>
    </div>
  </div>

  <div id="tab2-4" class="tab-content">
    <div style="margin-bottom: 2em;">
      <img src="assets/for_projects/PhraseLDM/song_demos/length_conditioned/4.png" alt="Song 4 Piano Roll" style="width: 100%; height: auto; margin-bottom: 1em;">
      <div style="display: flex; align-items: center; gap: 1em;">
        <a href="assets/for_projects/PhraseLDM/song_demos/length_conditioned/4.mid" download style="color: #007cba; text-decoration: none; font-size: 14px;">⬇️ MIDI</a>
        <audio controls style="flex: 1;">
          <source src="assets/for_projects/PhraseLDM/song_demos/length_conditioned/4.mp3" type="audio/mpeg">
        </audio>
      </div>
    </div>
  </div>

  <div id="tab2-5" class="tab-content">
    <div style="margin-bottom: 2em;">
      <img src="assets/for_projects/PhraseLDM/song_demos/length_conditioned/5.png" alt="Song 5 Piano Roll" style="width: 100%; height: auto; margin-bottom: 1em;">
      <div style="display: flex; align-items: center; gap: 1em;">
        <a href="assets/for_projects/PhraseLDM/song_demos/length_conditioned/5.mid" download style="color: #007cba; text-decoration: none; font-size: 14px;">⬇️ MIDI</a>
        <audio controls style="flex: 1;">
          <source src="assets/for_projects/PhraseLDM/song_demos/length_conditioned/5.mp3" type="audio/mpeg">
        </audio>
      </div>
    </div>
  </div>

  <div id="tab2-6" class="tab-content">
    <div style="margin-bottom: 2em;">
      <img src="assets/for_projects/PhraseLDM/song_demos/length_conditioned/6.png" alt="Song 6 Piano Roll" style="width: 100%; height: auto; margin-bottom: 1em;">
      <div style="display: flex; align-items: center; gap: 1em;">
        <a href="assets/for_projects/PhraseLDM/song_demos/length_conditioned/6.mid" download style="color: #007cba; text-decoration: none; font-size: 14px;">⬇️ MIDI</a>
        <audio controls style="flex: 1;">
          <source src="assets/for_projects/PhraseLDM/song_demos/length_conditioned/6.mp3" type="audio/mpeg">
        </audio>
      </div>
    </div>
  </div>

  <div id="tab2-7" class="tab-content">
    <div style="margin-bottom: 2em;">
      <img src="assets/for_projects/PhraseLDM/song_demos/length_conditioned/7.png" alt="Song 7 Piano Roll" style="width: 100%; height: auto; margin-bottom: 1em;">
      <div style="display: flex; align-items: center; gap: 1em;">
        <a href="assets/for_projects/PhraseLDM/song_demos/length_conditioned/7.mid" download style="color: #007cba; text-decoration: none; font-size: 14px;">⬇️ MIDI</a>
        <audio controls style="flex: 1;">
          <source src="assets/for_projects/PhraseLDM/song_demos/length_conditioned/7.mp3" type="audio/mpeg">
        </audio>
      </div>
    </div>
  </div>

  <div id="tab2-8" class="tab-content">
    <div style="margin-bottom: 2em;">
      <img src="assets/for_projects/PhraseLDM/song_demos/length_conditioned/8.png" alt="Song 8 Piano Roll" style="width: 100%; height: auto; margin-bottom: 1em;">
      <div style="display: flex; align-items: center; gap: 1em;">
        <a href="assets/for_projects/PhraseLDM/song_demos/length_conditioned/8.mid" download style="color: #007cba; text-decoration: none; font-size: 14px;">⬇️ MIDI</a>
        <audio controls style="flex: 1;">
          <source src="assets/for_projects/PhraseLDM/song_demos/length_conditioned/8.mp3" type="audio/mpeg">
        </audio>
      </div>
    </div>
  </div>
</div>

#### Length and Structure Conditioned Model

<div class="tab-container">
  <div class="tab-buttons">
    <button onclick="showTab3(1)" class="tab-btn active" id="tab-btn3-1">Song 1</button>
    <button onclick="showTab3(2)" class="tab-btn" id="tab-btn3-2">Song 2</button>
    <button onclick="showTab3(3)" class="tab-btn" id="tab-btn3-3">Song 3</button>
    <button onclick="showTab3(4)" class="tab-btn" id="tab-btn3-4">Song 4</button>
    <button onclick="showTab3(5)" class="tab-btn" id="tab-btn3-5">Song 5</button>
    <button onclick="showTab3(6)" class="tab-btn" id="tab-btn3-6">Song 6</button>
    <button onclick="showTab3(7)" class="tab-btn" id="tab-btn3-7">Song 7</button>
    <button onclick="showTab3(8)" class="tab-btn" id="tab-btn3-8">Song 8</button>
  </div>
  
  <div id="tab3-1" class="tab-content active">
    <div style="margin-bottom: 2em;">
      <img src="assets/for_projects/PhraseLDM/song_demos/length_structure_conditioned/1.png" alt="Song 1 Piano Roll" style="width: 100%; height: auto; margin-bottom: 1em;">
      <div style="display: flex; align-items: center; gap: 1em;">
        <a href="assets/for_projects/PhraseLDM/song_demos/length_structure_conditioned/1.mid" download style="color: #007cba; text-decoration: none; font-size: 14px;">⬇️ MIDI</a>
        <audio controls style="flex: 1;">
          <source src="assets/for_projects/PhraseLDM/song_demos/length_structure_conditioned/1.mp3" type="audio/mpeg">
        </audio>
      </div>
    </div>
  </div>
  
  <div id="tab3-2" class="tab-content">
    <div style="margin-bottom: 2em;">
      <img src="assets/for_projects/PhraseLDM/song_demos/length_structure_conditioned/2.png" alt="Song 2 Piano Roll" style="width: 100%; height: auto; margin-bottom: 1em;">
      <div style="display: flex; align-items: center; gap: 1em;">
        <a href="assets/for_projects/PhraseLDM/song_demos/length_structure_conditioned/2.mid" download style="color: #007cba; text-decoration: none; font-size: 14px;">⬇️ MIDI</a>
        <audio controls style="flex: 1;">
          <source src="assets/for_projects/PhraseLDM/song_demos/length_structure_conditioned/2.mp3" type="audio/mpeg">
        </audio>
      </div>
    </div>
  </div>

  <div id="tab3-3" class="tab-content">
    <div style="margin-bottom: 2em;">
      <img src="assets/for_projects/PhraseLDM/song_demos/length_structure_conditioned/3.png" alt="Song 3 Piano Roll" style="width: 100%; height: auto; margin-bottom: 1em;">
      <div style="display: flex; align-items: center; gap: 1em;">
        <a href="assets/for_projects/PhraseLDM/song_demos/length_structure_conditioned/3.mid" download style="color: #007cba; text-decoration: none; font-size: 14px;">⬇️ MIDI</a>
        <audio controls style="flex: 1;">
          <source src="assets/for_projects/PhraseLDM/song_demos/length_structure_conditioned/3.mp3" type="audio/mpeg">
        </audio>
      </div>
    </div>
  </div>

  <div id="tab3-4" class="tab-content">
    <div style="margin-bottom: 2em;">
      <img src="assets/for_projects/PhraseLDM/song_demos/length_structure_conditioned/4.png" alt="Song 4 Piano Roll" style="width: 100%; height: auto; margin-bottom: 1em;">
      <div style="display: flex; align-items: center; gap: 1em;">
        <a href="assets/for_projects/PhraseLDM/song_demos/length_structure_conditioned/4.mid" download style="color: #007cba; text-decoration: none; font-size: 14px;">⬇️ MIDI</a>
        <audio controls style="flex: 1;">
          <source src="assets/for_projects/PhraseLDM/song_demos/length_structure_conditioned/4.mp3" type="audio/mpeg">
        </audio>
      </div>
    </div>
  </div>

  <div id="tab3-5" class="tab-content">
    <div style="margin-bottom: 2em;">
      <img src="assets/for_projects/PhraseLDM/song_demos/length_structure_conditioned/5.png" alt="Song 5 Piano Roll" style="width: 100%; height: auto; margin-bottom: 1em;">
      <div style="display: flex; align-items: center; gap: 1em;">
        <a href="assets/for_projects/PhraseLDM/song_demos/length_structure_conditioned/5.mid" download style="color: #007cba; text-decoration: none; font-size: 14px;">⬇️ MIDI</a>
        <audio controls style="flex: 1;">
          <source src="assets/for_projects/PhraseLDM/song_demos/length_structure_conditioned/5.mp3" type="audio/mpeg">
        </audio>
      </div>
    </div>
  </div>

  <div id="tab3-6" class="tab-content">
    <div style="margin-bottom: 2em;">
      <img src="assets/for_projects/PhraseLDM/song_demos/length_structure_conditioned/6.png" alt="Song 6 Piano Roll" style="width: 100%; height: auto; margin-bottom: 1em;">
      <div style="display: flex; align-items: center; gap: 1em;">
        <a href="assets/for_projects/PhraseLDM/song_demos/length_structure_conditioned/6.mid" download style="color: #007cba; text-decoration: none; font-size: 14px;">⬇️ MIDI</a>
        <audio controls style="flex: 1;">
          <source src="assets/for_projects/PhraseLDM/song_demos/length_structure_conditioned/6.mp3" type="audio/mpeg">
        </audio>
      </div>
    </div>
  </div>

  <div id="tab3-7" class="tab-content">
    <div style="margin-bottom: 2em;">
      <img src="assets/for_projects/PhraseLDM/song_demos/length_structure_conditioned/7.png" alt="Song 7 Piano Roll" style="width: 100%; height: auto; margin-bottom: 1em;">
      <div style="display: flex; align-items: center; gap: 1em;">
        <a href="assets/for_projects/PhraseLDM/song_demos/length_structure_conditioned/7.mid" download style="color: #007cba; text-decoration: none; font-size: 14px;">⬇️ MIDI</a>
        <audio controls style="flex: 1;">
          <source src="assets/for_projects/PhraseLDM/song_demos/length_structure_conditioned/7.mp3" type="audio/mpeg">
        </audio>
      </div>
    </div>
  </div>

  <div id="tab3-8" class="tab-content">
    <div style="margin-bottom: 2em;">
      <img src="assets/for_projects/PhraseLDM/song_demos/length_structure_conditioned/8.png" alt="Song 8 Piano Roll" style="width: 100%; height: auto; margin-bottom: 1em;">
      <div style="display: flex; align-items: center; gap: 1em;">
        <a href="assets/for_projects/PhraseLDM/song_demos/length_structure_conditioned/8.mid" download style="color: #007cba; text-decoration: none; font-size: 14px;">⬇️ MIDI</a>
        <audio controls style="flex: 1;">
          <source src="assets/for_projects/PhraseLDM/song_demos/length_structure_conditioned/8.mp3" type="audio/mpeg">
        </audio>
      </div>
    </div>
  </div>
</div>

### Quality Showcase

Below are some representative (cherry picked) results to showcase the generation quality.

#### Piano Track's Textures

<div style="margin: 2em 0;">
  
  <!-- Song 1 -->
  <div style="display: flex; align-items: center; gap: 1em; margin-bottom: 2em;">
    <div style="flex: 0 0 75%;">
      <img src="assets/for_projects/PhraseLDM/quality_showcase/texture/1.png" alt="Piano Texture 1" style="width: 100%; height: auto;">
    </div>
    <div style="flex: 0 0 25%; display: flex; flex-direction: column; justify-content: center;">
      <audio controls style="width: 100%; margin-bottom: 1em;">
        <source src="assets/for_projects/PhraseLDM/quality_showcase/texture/1.mp3" type="audio/mpeg">
      </audio>
      <p style="font-size: 12px; color: #666; margin: 0; line-height: 1.4;">Classic arpeggiated patterns, resolving with a II–V–I progression.</p>
    </div>
  </div>

  <!-- Song 2 -->
  <div style="display: flex; align-items: center; gap: 1em; margin-bottom: 2em;">
    <div style="flex: 0 0 75%;">
      <img src="assets/for_projects/PhraseLDM/quality_showcase/texture/2.png" alt="Piano Texture 2" style="width: 100%; height: auto;">
    </div>
    <div style="flex: 0 0 25%; display: flex; flex-direction: column; justify-content: center;">
      <audio controls style="width: 100%; margin-bottom: 1em;">
        <source src="assets/for_projects/PhraseLDM/quality_showcase/texture/2.mp3" type="audio/mpeg">
      </audio>
      <p style="font-size: 12px; color: #666; margin: 0; line-height: 1.4;">Chord stabs with a syncopated bass, and occasional fast arpeggios to drive the momentum forward.</p>
    </div>
  </div>

  <!-- Song 3 -->
  <div style="display: flex; align-items: center; gap: 1em; margin-bottom: 2em;">
    <div style="flex: 0 0 75%;">
      <img src="assets/for_projects/PhraseLDM/quality_showcase/texture/3.png" alt="Piano Texture 3" style="width: 100%; height: auto;">
    </div>
    <div style="flex: 0 0 25%; display: flex; flex-direction: column; justify-content: center;">
      <audio controls style="width: 100%; margin-bottom: 1em;">
        <source src="assets/for_projects/PhraseLDM/quality_showcase/texture/3.mp3" type="audio/mpeg">
      </audio>
      <p style="font-size: 12px; color: #666; margin: 0; line-height: 1.4;">A semi-arpeggiated pattern with an embedded counter-melody, forming an intricate texture, punctuated by short block-chord stabs for surprise.</p>
    </div>
  </div>

</div>

#### Intro


<div style="margin: 2em 0;">
  
  <!-- Piano Roll Row -->
  <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1em; margin-bottom: 1em;">
    <div>
      <img src="assets/for_projects/PhraseLDM/quality_showcase/intro/1.png" alt="Intro Song 1 Piano Roll" style="width: 100%; height: auto;">
    </div>
    <div>
      <img src="assets/for_projects/PhraseLDM/quality_showcase/intro/2.png" alt="Intro Song 2 Piano Roll" style="width: 100%; height: auto;">
    </div>
    <div>
      <img src="assets/for_projects/PhraseLDM/quality_showcase/intro/3.png" alt="Intro Song 3 Piano Roll" style="width: 100%; height: auto;">
    </div>
  </div>

  <!-- Audio Player Row -->
  <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1em;">
    <div>
      <audio controls style="width: 100%;">
        <source src="assets/for_projects/PhraseLDM/quality_showcase/intro/1.mp3" type="audio/mpeg">
      </audio>
    </div>
    <div>
      <audio controls style="width: 100%;">
        <source src="assets/for_projects/PhraseLDM/quality_showcase/intro/2.mp3" type="audio/mpeg">
      </audio>
    </div>
    <div>
      <audio controls style="width: 100%;">
        <source src="assets/for_projects/PhraseLDM/quality_showcase/intro/3.mp3" type="audio/mpeg">
      </audio>
    </div>
  </div>

</div>

#### Outro

<div style="margin: 2em 0;">
  
  <!-- Piano Roll Row -->
  <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1em; margin-bottom: 1em;">
    <div>
      <img src="assets/for_projects/PhraseLDM/quality_showcase/outro/1.png" alt="Outro Song 1 Piano Roll" style="width: 100%; height: auto;">
    </div>
    <div>
      <img src="assets/for_projects/PhraseLDM/quality_showcase/outro/2.png" alt="Outro Song 2 Piano Roll" style="width: 100%; height: auto;">
    </div>
    <div>
      <img src="assets/for_projects/PhraseLDM/quality_showcase/outro/3.png" alt="Outro Song 3 Piano Roll" style="width: 100%; height: auto;">
    </div>
  </div>

  <!-- Audio Player Row -->
  <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1em;">
    <div>
      <audio controls style="width: 100%;">
        <source src="assets/for_projects/PhraseLDM/quality_showcase/outro/1.mp3" type="audio/mpeg">
      </audio>
    </div>
    <div>
      <audio controls style="width: 100%;">
        <source src="assets/for_projects/PhraseLDM/quality_showcase/outro/2.mp3" type="audio/mpeg">
      </audio>
    </div>
    <div>
      <audio controls style="width: 100%;">
        <source src="assets/for_projects/PhraseLDM/quality_showcase/outro/3.mp3" type="audio/mpeg">
      </audio>
    </div>
  </div>

</div>

#### Interlude

<div style="margin: 2em 0;">
  
  <!-- Piano Roll Row -->
  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1em; margin-bottom: 1em;">
    <div>
      <img src="assets/for_projects/PhraseLDM/quality_showcase/interlude/1.png" alt="Interlude Song 1 Piano Roll" style="width: 100%; height: auto;">
    </div>
    <div>
      <img src="assets/for_projects/PhraseLDM/quality_showcase/interlude/2.png" alt="Interlude Song 2 Piano Roll" style="width: 100%; height: auto;">
    </div>
  </div>

  <!-- Audio Player Row -->
  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1em;">
    <div>
      <audio controls style="width: 100%;">
        <source src="assets/for_projects/PhraseLDM/quality_showcase/interlude/1.mp3" type="audio/mpeg">
      </audio>
    </div>
    <div>
      <audio controls style="width: 100%;">
        <source src="assets/for_projects/PhraseLDM/quality_showcase/interlude/2.mp3" type="audio/mpeg">
      </audio>
    </div>
  </div>

</div>

### VAE results

#### Interpolate

<div style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 1em; margin: 2em 0;">
  <div style="text-align: center;">
    <img src="assets/for_projects/PhraseLDM/vae/interpolate/interp_w0.0.png" alt="Interpolation α=0.0" style="width: 100%; height: auto; margin-bottom: 0.5em;">
    <p style="font-size: 12px; color: #666; margin: 0;">α = 0.0</p>
  </div>
  <div style="text-align: center;">
    <img src="assets/for_projects/PhraseLDM/vae/interpolate/interp_w0.3.png" alt="Interpolation α=0.3" style="width: 100%; height: auto; margin-bottom: 0.5em;">
    <p style="font-size: 12px; color: #666; margin: 0;">α = 0.3</p>
  </div>
  <div style="text-align: center;">
    <img src="assets/for_projects/PhraseLDM/vae/interpolate/interp_w0.4.png" alt="Interpolation α=0.4" style="width: 100%; height: auto; margin-bottom: 0.5em;">
    <p style="font-size: 12px; color: #666; margin: 0;">α = 0.4</p>
  </div>
  <div style="text-align: center;">
    <img src="assets/for_projects/PhraseLDM/vae/interpolate/interp_w0.5.png" alt="Interpolation α=0.5" style="width: 100%; height: auto; margin-bottom: 0.5em;">
    <p style="font-size: 12px; color: #666; margin: 0;">α = 0.5</p>
  </div>
  <div style="text-align: center;">
    <img src="assets/for_projects/PhraseLDM/vae/interpolate/interp_w0.6.png" alt="Interpolation α=0.6" style="width: 100%; height: auto; margin-bottom: 0.5em;">
    <p style="font-size: 12px; color: #666; margin: 0;">α = 0.6</p>
  </div>
  <div style="text-align: center;">
    <img src="assets/for_projects/PhraseLDM/vae/interpolate/interp_w0.7.png" alt="Interpolation α=0.7" style="width: 100%; height: auto; margin-bottom: 0.5em;">
    <p style="font-size: 12px; color: #666; margin: 0;">α = 0.7</p>
  </div>
  <div style="text-align: center;">
    <img src="assets/for_projects/PhraseLDM/vae/interpolate/interp_w0.8.png" alt="Interpolation α=0.8" style="width: 100%; height: auto; margin-bottom: 0.5em;">
    <p style="font-size: 12px; color: #666; margin: 0;">α = 0.8</p>
  </div>
  <div style="text-align: center;">
    <img src="assets/for_projects/PhraseLDM/vae/interpolate/interp_w1.0.png" alt="Interpolation α=1.0" style="width: 100%; height: auto; margin-bottom: 0.5em;">
    <p style="font-size: 12px; color: #666; margin: 0;">α = 1.0</p>
  </div>
</div>

#### Prior Sampling

<div style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 1em; margin: 2em 0;">
  <div>
    <img src="assets/for_projects/PhraseLDM/vae/prior_sampling/bar_sample_0.png" alt="Prior Sample 0" style="width: 100%; height: auto;">
  </div>
  <div>
    <img src="assets/for_projects/PhraseLDM/vae/prior_sampling/bar_sample_1.png" alt="Prior Sample 1" style="width: 100%; height: auto;">
  </div>
  <div>
    <img src="assets/for_projects/PhraseLDM/vae/prior_sampling/bar_sample_2.png" alt="Prior Sample 2" style="width: 100%; height: auto;">
  </div>
  <div>
    <img src="assets/for_projects/PhraseLDM/vae/prior_sampling/bar_sample_3.png" alt="Prior Sample 3" style="width: 100%; height: auto;">
  </div>
  <div>
    <img src="assets/for_projects/PhraseLDM/vae/prior_sampling/bar_sample_4.png" alt="Prior Sample 4" style="width: 100%; height: auto;">
  </div>
  <div>
    <img src="assets/for_projects/PhraseLDM/vae/prior_sampling/bar_sample_5.png" alt="Prior Sample 5" style="width: 100%; height: auto;">
  </div>
  <div>
    <img src="assets/for_projects/PhraseLDM/vae/prior_sampling/bar_sample_6.png" alt="Prior Sample 6" style="width: 100%; height: auto;">
  </div>
  <div>
    <img src="assets/for_projects/PhraseLDM/vae/prior_sampling/bar_sample_7.png" alt="Prior Sample 7" style="width: 100%; height: auto;">
  </div>
</div>

## Citation
<pre style="background-color: #f0f0f0; font-family: Courier, Consolas, monospace;">
<!-- @misc{ou2025phraseldm,
  title         = {PhraseVAE and PhraseLDM: Latent Diffusion for Full-Song Multitrack Symbolic Music Generation},
  author        = {Longshen Ou and Ye Wang},
  year          = {2025},
  note          = {Technical Report}
} -->
@article{ou2025phrasevae,
  title={PhraseVAE and PhraseLDM: Latent Diffusion for Full-Song Multitrack Symbolic Music Generation},
  author={Ou, Longshen and Wang, Ye},
  journal={arXiv preprint arXiv:2512.11348},
  year={2025}
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