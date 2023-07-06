---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

layout: home
---

<!-- 
Sections: 
Intro
News
Publication
Other Projects
Honors and Awards
Teaching
Academic Reviewers
 -->

<!-- Navigator -->
<div style="text-align:center;">
[ <a href="#recent-news">News</a> | <a href="#publication">Publication</a> | <a href="#other-projects">Projects</a> | <a href="#honors-and-awards">Awards</a> | <a href="#teaching">Teaching</a> | <a href="#academic-reviewers">Reviewer</a> ]
</div>

# I'm a violinist, guitarist, and CS researcher.

<!-- Style for image width at intro (responsive) -->
<style>
    .content {
      display: flex;
      align-items: center;
    }

    .image {
      width: 200px;
      margin-right: 30px;
    }

    @media screen and (max-width: 600px) {
    .content {
      display: block;
      text-align: left;
    }

    .image {
      display: block;
      width: 50%;
      height: auto;
      margin: 0 auto 30px;
    }
  }
</style>

<!-- Intro -->
<div class="content">
  <img class="image" src="/assets/images/myself.png" alt="Image description">
  <p>
    I am currently a proud PhD candidate (2nd year) in the [Sound and Music Computing Lab](https://smcnus.comp.nus.edu.sg/), School of Computing, National University of Singapore. My research centers on solving music information retrieval challenges using machine learning techniques. I am particularly interested in the automatic transcription of music and lyrics, as well as lyric generation. Prior to joining NUS, I earned my Bachelor's degree in Computer Science with honors from the Harbin Institute of Technology. 
    <br> <br>
    Moreover, I am a professional-level violinist and guitarist. Please visit the "<a href="/musician">As Musician</a>" page to explore my music portfolio. I feel incredibly fortunate to have discovered my passion for music and to have the opportunity to work and conduct research in a music-related field. My love for music energizes and motivates me to continually grow and excel in this area.
  </p>
</div>

<!-- Contact -->
<!-- Email ` Scholar ` CV/LinkedIn ` Twitter ` Bilibili ` Youtube -->
<div style="text-align:center;">
<a href="mailto:oulongshen@u.nus.edu">Email</a> &middot; <a href="https://scholar.google.com/citations?user=hf-xY6gAAAAJ">Google Scholar</a> &middot; <a href="https://www.linkedin.com/in/longshen-ou/">CV / LinkedIn</a> &middot; <a href="https://twitter.com/LongshenO">Twitter</a> &middot; <a href="https://space.bilibili.com/8419079/audio">Bilibili</a> &middot; <a href="https://www.youtube.com/channel/UC6kT17cxNvNzUXcM9piNqMg">Youtube</a>
</div>

<br>

# Recent News

<div style="height: 100px; overflow-y: scroll; border: 1px solid #ccc; padding: 10px; font-family: Times New Roman;background-color: gainsboro;">
<ul>
    <!-- <li> <b>[2023.6]</b> My paper <i>LOAF-M2L: Joint Learning of Wording and Formatting for Singable Melody-to-Lyric Generation</i> is rejected by ISMIR 2023. Sadge! </li> -->
    <li> <b>[2023.5]</b> I passed the Qualification Exam. Now I am a PhD candidate! </li>
    <li> <b>[2023.5]</b> My paper <i>Songs Across Borders: Singable and Controllable Neural Lyric Translation</i> is accepted by ACL 2023. </li>
    <li> <b>[2023.1]</b> I receive Research Achievement Award (2022/2023) from School of Computing, NUS. </li>
    <li> <b>[2022.12]</b> I'm attending ISMIR 2023 at Bengaluru, India. </li>
    <li> <b>[2022.11]</b> Our ACM Multimedia paper receives the top paper award (2% of accepted full papers). </li>
    <li> <b>[2022.10]</b> I'm attending ACM Multimedia at Lisbon, Portugal. </li>
    <li> <b>[2022.7]</b> An extension work of our previous paper, <i>Transfer Learning of wav2vec 2.0 for Automatic Lyric Transcription</i> is acctepted by ISMIR 2023.</li>
    <li> <b>[2022.7]</b> My paper collaborated with <a href="https://guxm2021.github.io/">Xiangming Gu</a>, <i>MM-ALT: A multimodal automatic lyric transcription system</i> is accepted by ACM Multimedia 2022. </li>
    <li> <b>[2022.5]</b> I'm attending ICASSP 2022 at Singapore. </li>
    <li> <b>[2022.1]</b> My first paper, which achieves another SOTA on piano music transcription, is accepted by ICASSP 2022.</li>
    <li> <b>[2022.1]</b> I start my PhD journey in NUS SMCL, advised by <a href="https://www.comp.nus.edu.sg/cs/people/wangye/">Prof. Wang Ye</a>. </li>
    <li> <b>[2021.8]</b> I join National University of Singapore as a student in Master of Computing program (AI track), start my research in <a href="https://smcnus.comp.nus.edu.sg/"> Sound and Music Computing Lab </a>.</li>
</ul>
</div>


<br>

# Publication
- **[Songs Across Borders: Singable and Controllable Neural Lyric Translation](https://arxiv.org/abs/2305.16816)**  
  **Longshen Ou**, [Xichu Ma](https://dblp.org/pid/179/9890.html), [Min-Yen Kan](https://www.comp.nus.edu.sg/~kanmy/), [Ye Wang](https://www.comp.nus.edu.sg/cs/people/wangye/)  
  *The 61st Annual Meeting of the Association for Computational Linguistics (ACL 2023)*  
  [[demo](/lyric_translation) | [code](https://github.com/Sonata165/ControllableLyricTranslation)]
  
- **[Transfer Learning of wav2vec 2.0 for Automatic Lyric Transcription](https://arxiv.org/abs/2207.09747)**  
  **Longshen Ou**\*, [Xiangming Gu](https://guxm2021.github.io/)\*, and [Ye Wang](https://www.comp.nus.edu.sg/cs/people/wangye/)  
  *Proceedings of the 23rd International Society for Music Information Retrieval Conf. (ISMIR 2022)*  
  [[code](https://github.com/guxm2021/ALT_SpeechBrain)]

- **[MM-ALT: A Multimodal Automatic Lyric Transcription System](https://dl.acm.org/doi/abs/10.1145/3503161.3548411)** (*<span style="color:red">Oral, Top Paper Award</span>*)  
  [Xiangming Gu](https://guxm2021.github.io/)\*, **Longshen Ou**\*, [Danielle Ong](https://www.linkedin.com/in/danielle-ong-854b88177/), and [Ye Wang](https://www.comp.nus.edu.sg/cs/people/wangye/)  
  *Proceedings of the 30th ACM International Conference on Multimedia (ACM Multimedia 2022)*   
  [[demo](https://n20em.github.io/) | [code](https://github.com/guxm2021/MM_ALT) | [dataset](https://zenodo.org/record/7545968) | [press](https://www.comp.nus.edu.sg/news/features/2023-marvellous-richness-wye/)]

- [**Exploring Transformer’s Potential on Automatic Piano Transcription**](https://ieeexplore.ieee.org/abstract/document/9746789)  
  **Longshen Ou**, [Ziyi Guo](https://www.linkedin.com/in/zi-yi-guo/), [Emmanouil Benetos](https://www.eecs.qmul.ac.uk/~emmanouilb/), [Jiqing Han](https://dblp.org/pid/h/JiqingHan.html), and [Ye Wang](https://www.comp.nus.edu.sg/cs/people/wangye/)    
  *2022 IEEE International Conference on Acoustics, Speech and Signal Processing (ICASSP 2022)*
  


## Preprint
- **[LOAF-M2L: Joint Learning of Wording and Formatting for Singable Melody-to-Lyric Generation](https://arxiv.org/abs/2307.02146)**  
  **Longshen Ou**, [Xichu Ma](https://dblp.org/pid/179/9890.html), and [Ye Wang](https://www.comp.nus.edu.sg/cs/people/wangye/)  
  *arXiv:2304.12082 (2023)*  

- **[Deep Audio-Visual Singing Voice Transcription based on Self-Supervised Learning Models](https://arxiv.org/abs/2304.12082)**  
  [Xiangming Gu](https://guxm2021.github.io/), Wei Zeng, Jianan Zhang, **Longshen Ou**, and [Ye Wang](https://www.comp.nus.edu.sg/cs/people/wangye/)  
  *arXiv:2304.12082 (2023)*  
  [[code](https://github.com/guxm2021/SVT_SpeechBrain)]

- **[Automatic Hyper-Parameter Optimization Based on Mapping Discovery from Data to Hyper-Parameters](https://arxiv.org/abs/2003.01751)**  
  [Bozhou Chen](https://www.researchgate.net/profile/Bozhou-Chen), [Kaixin Zhang](https://www.researchgate.net/profile/Kaixin-Zhang-6), **Longshen Ou**, [Chenmin Ba](https://dblp.uni-trier.de/pid/259/9983.html), [Hongzhi Wang](https://dblp.org/pid/81/940.html), and [Chunnan Wang](https://scholar.google.com/citations?user=F0xRt20AAAAJ&hl=en).  
  *arXiv:2003.01751* (2020)

<br>

# Other Projects
- [**GNN-based Music Recommender**](https://github.com/Sonata165/MusicRecommenderGCN)  
    This project aims to tackle the music artist recommendation challenge using Graph Convolutional Networks (GCNs). By modeling artist and user identities through their interactive relationships, the network predicts affinity scores between users and previously unexplored artists to generate personalized recommendations. I implemented the original GCN as a baseline and proposed three enhancements: incorporating edge weight for aggregation, augmenting edge weight with attention mechanisms, and implementing data augmentation by introducing noise to edge values.

- [**DNA Storage Simulation**](https://github.com/Sonata165/DNA-Storage-Simulation)  
    DNA-based storage systems present unique challenges, as reading and writing operations can sometimes result in alterations to the original information. To model the changes introduced by such storage systems in a wet lab environment, we designed a simulation system to emulate DNA behavioral changes. This system includes a rule-based method, a Multi-Layer Perceptron (MLP) method, and a sequence-to-sequence attention-based Recurrent Neural Network (RNN). The experiments based on the Microsoft Nanopore dataset shows the sequence-to-sequence method is highly effective.

<br>

# Honors and Awards
- **Research Achievement Award** (2022/2023), issued by School of Computing, NUS, 2023.5.
- **Top Paper Award** (2% of accepted full papers), issued by ACM Multimedia 2022, 2022.11.
- **Honor Degree of Bachelor of Engineering**, issued by Harbin Institute of Technology Honors School, 2021.6.
- **People Scholarship** (6%), issued by Harbin Institute of Technology, 2020.6.
- **Third Prize**, Sogou Innovative Practice Project for College Student, 2018.10.

<br>

# Teaching
- Teaching Assistant, CS4248 Natural Language Processing (2022/2023 sem 2).
- Teaching Assistant, CS4347 Sound and Music Computing (2022/2023 sem 1).

<br>

# Academic Reviewers
- ISMIR 2023.
- ACM Multimedia 2023.
- ISMIR 2022.