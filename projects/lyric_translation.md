---
layout: page
title: "Songs Across Boarders: Singable and Controllable Neural Lyric Translation"
permalink: /lyric_translation
---

<!-- Google Analytics tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-MK1PD93QHP"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-MK1PD93QHP');
</script>


# **Links**: [ [Paper](https://aclanthology.org/2023.acl-long.27/){:target="_blank"} ] | [ [Code](https://github.com/Sonata165/ControllableLyricTranslation){:target="_blank"} ] | [ [Citation](#citation) ]

The development of general-domain neural machine translation (NMT) methods has advanced significantly in recent years, but the lack of naturalness and musical constraints in the outputs makes them unable to produce singable lyric translations. This paper bridges the singability quality gap by formalizing lyric translation into a constrained translation problem, converting theoretical guidance and practical techniques from translatology literature to prompt-driven NMT approaches, exploring better adaptation methods, and instantiating them to an English-Chinese lyric translation system. Our model achieves 99.85%, 99.00%, and 95.52% on length accuracy, rhyme accuracy, and word boundary recall. In our subjective evaluation, our model shows a 75% relative enhancement on overall quality, compared against naive fine-tuning. 

Contribution brief:
- **Necessary word boundary control**: a prompt-based solution that enhances singability.
- **Reverse-order decoding**: effectively boost prompt-based rhyme control.
- **Rhyme ranking**: the model will help you pick the best rhyme for stanzas.
- **Comparative study** of different prompt forms on length, rhyme, word boundary control.
- **Back-translation**: help with both sense and naturalness.




<p align="center">
<b>Table of Contents</b>: [ <a href="#model-output-demo">Output Demo</a> 
| <a href="#subjective-evaluation">Subjective Evaluation</a> 
| <a href="#different-rhyming-difficulties">Rhyme Ranking</a>
| <a href="#typical-issues-of-modifying-beam-search">Modify Beam Search</a> ] 
</p>

## Model Output Demo
![image tooltip here](/assets/for_projects/LyricTrans/images/fig_letitgo.png)
<table>
  <tr>
    <th>Lyrics from</th>
    <th>Audio</th>
  </tr>
  <tr>
    <td> Original song </td>
    <td>
      <audio controls>
        <source src="/assets/for_projects/LyricTrans/audio/demo_original.mp3" type="audio/mpeg">
        Your browser does not support the audio element.
      </audio>
    </td>

  </tr>
  <tr>
    <td> Our model </td>
    <td>
      <audio controls>
        <source src="/assets/for_projects/LyricTrans/audio/demo_ours.mp3" type="audio/mpeg">
        Your browser does not support the audio element.
      </audio>
    </td>
  </tr>
  <tr>
    <td> Baseline model </td>
    <td>
      <audio controls>
        <source src="/assets/for_projects/LyricTrans/audio/demo_baseline.mp3" type="audio/mpeg">
        Your browser does not support the audio element.
      </audio>
    </td>
  </tr>
</table>

The outputs of our model (2nd row) are perfect in the number of syllables
and rhyme constraints. The output has a same number of syllables as the number of notes in the music, 
hence there is no need to merge or 
split any musical notes to match the lyrics. Also, all the sentences
end with the same rhyme category [o, e, uo], which is the rhyme that is ranked 1st.
In addition, there is a downbeat lying on the note
of the second word in the source lyrics, "snow",
creating a melody boundary between the first and
the second note. To get rid of pronunciation interruption,
our system successfully places a word
boundary here, avoiding the scenario where the
second syllable of the word "今夜" is highlighted.
Similarly, in the fourth sentence, our system places
a word boundary at the place between the translation
of "it looks like" and "I’m the queen", where
there exists a musical pause.

## Subjective Evaluation
<!-- Procedures+Metrics, Outputs, Results -->
We select the same five songs as [GagaST (Guo
et al., 2022)](https://aclanthology.org/2022.findings-acl.60/) for our subjective testing. When doing
this experiments, we ensure these songs are not in
the training set.

### List of Songs

| Song No.  | #Paragraphs | Song Name |
| --------  | -------- | -------- |
| 1    | 2 | *A World without Danger* (Code Lyoko Theme Song)   |
| 2    | 3 | *As The Deer*, by Marty Nystrom   |
| 3    | 2 | *Autumn in New York*, by Vernon Duke |
| 4    | 4 | *Best Mistake*, by Ariana Grande |
| 5    | 3 | *Better Together*, Luke Combs |

### List of Models

| Model No. | Component |
| -------- | -------- |
| Model 1   | Baseline: mBART with finetuning   |
| Model 2   | [GagaST (Guo et al., 2022)](https://aclanthology.org/2022.findings-acl.60/)   |
| **Model 3**   | Our final model (Baseline + BT + controlling length, rhyme, word boundary) |
| Model 4   | Ablated model (Baseline + BT + controlling length, rhyme) |
| Model 5   | Ablated model (Baseline + BT + controlling length) |
| Model 6   | Ablated model (Baseline + BT) |

### Generation Results

| Song | Original | Model 1 | Model 2 | Model 3 | Model 4 | Model 5 | Model 6 |
| -------- | -------- | -------- | -------- | -------- | -------- | -------- |
| 1   | [pdf](/assets/for_projects/LyricTrans/original/pdf/1.pdf){:target="_blank"} [mp3](/assets/for_projects/LyricTrans/original/mp3/1.mp3){:target="_blank"} | [pdf](/assets/for_projects/LyricTrans/1/pdf/1.pdf){:target="_blank"} [mp3](/assets/for_projects/LyricTrans/1/mp3/1.mp3){:target="_blank"} | [pdf](/assets/for_projects/LyricTrans/2/pdf/1.pdf){:target="_blank"} [mp3](/assets/for_projects/LyricTrans/2/mp3/1.mp3){:target="_blank"} | [pdf](/assets/for_projects/LyricTrans/3/pdf/1.pdf){:target="_blank"} [mp3](/assets/for_projects/LyricTrans/3/mp3/1.mp3){:target="_blank"} | [pdf](/assets/for_projects/LyricTrans/4/pdf/1.pdf){:target="_blank"} [mp3](/assets/for_projects/LyricTrans/4/mp3/1.mp3){:target="_blank"} | [pdf](/assets/for_projects/LyricTrans/5/pdf/1.pdf){:target="_blank"} [mp3](/assets/for_projects/LyricTrans/5/mp3/1.mp3){:target="_blank"} | [pdf](/assets/for_projects/LyricTrans/6/pdf/1.pdf){:target="_blank"} [mp3](/assets/for_projects/LyricTrans/6/mp3/1.mp3){:target="_blank"} |
| 2   | [pdf](/assets/for_projects/LyricTrans/original/pdf/2.pdf){:target="_blank"} [mp3](/assets/for_projects/LyricTrans/original/mp3/2.mp3){:target="_blank"} | [pdf](/assets/for_projects/LyricTrans/1/pdf/2.pdf){:target="_blank"} [mp3](/assets/for_projects/LyricTrans/1/mp3/2.mp3){:target="_blank"} | [pdf](/assets/for_projects/LyricTrans/2/pdf/2.pdf){:target="_blank"} [mp3](/assets/for_projects/LyricTrans/2/mp3/2.mp3){:target="_blank"} | [pdf](/assets/for_projects/LyricTrans/3/pdf/2.pdf){:target="_blank"} [mp3](/assets/for_projects/LyricTrans/3/mp3/2.mp3){:target="_blank"} | [pdf](/assets/for_projects/LyricTrans/4/pdf/2.pdf){:target="_blank"} [mp3](/assets/for_projects/LyricTrans/4/mp3/2.mp3){:target="_blank"} | [pdf](/assets/for_projects/LyricTrans/5/pdf/2.pdf){:target="_blank"} [mp3](/assets/for_projects/LyricTrans/5/mp3/2.mp3){:target="_blank"} | [pdf](/assets/for_projects/LyricTrans/6/pdf/2.pdf){:target="_blank"} [mp3](/assets/for_projects/LyricTrans/6/mp3/2.mp3){:target="_blank"} |
| 3   | [pdf](/assets/for_projects/LyricTrans/original/pdf/3.pdf){:target="_blank"} [mp3](/assets/for_projects/LyricTrans/original/mp3/3.mp3){:target="_blank"} | [pdf](/assets/for_projects/LyricTrans/1/pdf/3.pdf){:target="_blank"} [mp3](/assets/for_projects/LyricTrans/1/mp3/3.mp3){:target="_blank"} | [pdf](/assets/for_projects/LyricTrans/2/pdf/3.pdf){:target="_blank"} [mp3](/assets/for_projects/LyricTrans/2/mp3/3.mp3){:target="_blank"} | [pdf](/assets/for_projects/LyricTrans/3/pdf/3.pdf){:target="_blank"} [mp3](/assets/for_projects/LyricTrans/3/mp3/3.mp3){:target="_blank"} | [pdf](/assets/for_projects/LyricTrans/4/pdf/3.pdf){:target="_blank"} [mp3](/assets/for_projects/LyricTrans/4/mp3/3.mp3){:target="_blank"} | [pdf](/assets/for_projects/LyricTrans/5/pdf/3.pdf){:target="_blank"} [mp3](/assets/for_projects/LyricTrans/5/mp3/3.mp3){:target="_blank"} | [pdf](/assets/for_projects/LyricTrans/6/pdf/3.pdf){:target="_blank"} [mp3](/assets/for_projects/LyricTrans/6/mp3/3.mp3){:target="_blank"} |
| 4   | [pdf](/assets/for_projects/LyricTrans/original/pdf/4.pdf){:target="_blank"} [mp3](/assets/for_projects/LyricTrans/original/mp3/4.mp3){:target="_blank"} | [pdf](/assets/for_projects/LyricTrans/1/pdf/4.pdf){:target="_blank"} [mp3](/assets/for_projects/LyricTrans/1/mp3/4.mp3){:target="_blank"} | [pdf](/assets/for_projects/LyricTrans/2/pdf/4.pdf){:target="_blank"} [mp3](/assets/for_projects/LyricTrans/2/mp3/4.mp3){:target="_blank"} | [pdf](/assets/for_projects/LyricTrans/3/pdf/4.pdf){:target="_blank"} [mp3](/assets/for_projects/LyricTrans/3/mp3/4.mp3){:target="_blank"} | [pdf](/assets/for_projects/LyricTrans/4/pdf/4.pdf){:target="_blank"} [mp3](/assets/for_projects/LyricTrans/4/mp3/4.mp3){:target="_blank"} | [pdf](/assets/for_projects/LyricTrans/5/pdf/4.pdf){:target="_blank"} [mp3](/assets/for_projects/LyricTrans/5/mp3/4.mp3){:target="_blank"} | [pdf](/assets/for_projects/LyricTrans/6/pdf/4.pdf){:target="_blank"} [mp3](/assets/for_projects/LyricTrans/6/mp3/4.mp3){:target="_blank"} |
| 5   | [pdf](/assets/for_projects/LyricTrans/original/pdf/5.pdf){:target="_blank"} [mp3](/assets/for_projects/LyricTrans/original/mp3/5.mp3){:target="_blank"} | [pdf](/assets/for_projects/LyricTrans/1/pdf/5.pdf){:target="_blank"} [mp3](/assets/for_projects/LyricTrans/1/mp3/5.mp3){:target="_blank"} | [pdf](/assets/for_projects/LyricTrans/2/pdf/5.pdf){:target="_blank"} [mp3](/assets/for_projects/LyricTrans/2/mp3/5.mp3){:target="_blank"} | [pdf](/assets/for_projects/LyricTrans/3/pdf/5.pdf){:target="_blank"} [mp3](/assets/for_projects/LyricTrans/3/mp3/5.mp3){:target="_blank"} | [pdf](/assets/for_projects/LyricTrans/4/pdf/5.pdf){:target="_blank"} [mp3](/assets/for_projects/LyricTrans/4/mp3/5.mp3){:target="_blank"} | [pdf](/assets/for_projects/LyricTrans/5/pdf/5.pdf){:target="_blank"} [mp3](/assets/for_projects/LyricTrans/5/mp3/5.mp3){:target="_blank"} | [pdf](/assets/for_projects/LyricTrans/6/pdf/5.pdf){:target="_blank"} [mp3](/assets/for_projects/LyricTrans/6/mp3/5.mp3){:target="_blank"} |

## Different Rhyming Difficulties
We noticed that an improper rhyme prompt will
lead to lower text quality and a lower chance of
constraints being satisfied. For example, 
<p align="center">
  <img width="450" src="/assets/for_projects/LyricTrans/images/fig_rhyme_dist.png">
</p>
The figure above shows the "rhyme distribution" when translating the paragraph in the "Model Output Demo" section. This distribution is obtained from our reverse-order decoder, which is a text quality prediction when using different rhyme type as requirement.
When using the 1st best and 2nd worst rhymes as constraints, the results are as below.

<p align="center">
  <img width="400" src="/assets/for_projects/LyricTrans/images/fig_rhydif.png">
</p>

With the 1st-ranked rhyme as prompt (left paragraph), the output is perfect in length and rhyme control and has a satisfactory translation quality.
However, various translation errors appear in the 2nd output, i.e., the output with 2nd worst rhyme (right paragraph): wrong translation (red text), violation of target language grammar (green text), repeated phrases (orange text), failed rhyme control (highlighted text). 

## Typical Issues of Modifying Beam Search
The previous common practice of achieving controllability is to modify the beam search (force output length, or give beams that have desired properties higher scores). However, this method tend to lead lower control effectiveness as well as lower text quality, compared to our prompt-based solution.

### Length Forcing
<p align="center">
  <img width="250" src="/assets/for_projects/LyricTrans/images/fig_biased1.png">
  <img width="250" src="/assets/for_projects/LyricTrans/images/fig_biased2.png">
</p>
("Prompt" refers to results from our prompt-based control)

If the desired length is shorter than unconstrained output, the beam search might
end too soon, so the sentence will be incomplete
(left figure). If the desired length is unexpectly long (right figure), there tends to be repetition
in the outputs. Both cases significantly damage the
translation quality, although the outputs may even have higher BLEU scores.

### Biased Decoding for Rhyme Control
<p align="center">
  <img width="250" src="/assets/for_projects/LyricTrans/images/fig_biased3.png">
  <img width="250" src="/assets/for_projects/LyricTrans/images/fig_biased4.png">
</p>
("Biased" refers to biased decoding; "Prompt" refers to results from our prompt-based control)

A type of error frequently
happens that the end-words in the outputs
are biased toward words that satisfy the rhyme constraints
but are irrelevant to the source sentences
and are incompatible with other parts of the output
sentences. Such problems
are much rarer in translations obtained by prompt based
methods.

### Citation
<pre style="background-color: #f0f0f0; font-family: Courier, Consolas, monospace;">
@inproceedings{ou-etal-2023-songs,
    title = "Songs Across Borders: Singable and Controllable Neural Lyric Translation",
    author = "Ou, Longshen  and
      Ma, Xichu  and
      Kan, Min-Yen  and
      Wang, Ye",
    booktitle = "Proceedings of the 61st Annual Meeting of the Association for Computational Linguistics (Volume 1: Long Papers)",
    month = jul,
    year = "2023",
    address = "Toronto, Canada",
    publisher = "Association for Computational Linguistics",
    url = "https://aclanthology.org/2023.acl-long.27",
    pages = "447--467",
    abstract = "The development of general-domain neural machine translation (NMT) methods has advanced significantly in recent years, but the lack of naturalness and musical constraints in the outputs makes them unable to produce singable lyric translations. This paper bridges the singability quality gap by formalizing lyric translation into a constrained translation problem, converting theoretical guidance and practical techniques from translatology literature to prompt-driven NMT approaches, exploring better adaptation methods, and instantiating them to an English-Chinese lyric translation system. Our model achieves 99.85{\%}, 99.00{\%}, and 95.52{\%} on length accuracy, rhyme accuracy, and word boundary recall. In our subjective evaluation, our model shows a 75{\%} relative enhancement on overall quality, compared against naive fine-tuning (Code available at https://github.com/Sonata165/ControllableLyricTranslation).",
}
</pre>