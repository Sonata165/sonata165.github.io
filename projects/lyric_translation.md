---
layout: page
# title: Lyric Translation
permalink: /lyric_translation
---

# Songs Across Boarders: Singable and Controllable Neural Lyric Translation
<!-- Introduction -->

<p align="center">
<b>Table of Contents</b>: [ <a href="#model-output-demo">Output Demo</a> 
| <a href="#subjective-evaluation">Subjective Evaluation</a> 
| <a href="#different-rhyming-difficulties">Rhyme Ranking</a>
| <a href="#typical-issues-of-modifying-beam-search">Modify Beam Search</a>] 
</p>

## Model Output Demo
![image tooltip here](/assets/images/fig_letitgo.png)
<!-- TODO: add two audios -->

The outputs are perfect in the number of syllables
and rhyme constraints. With the guidance of word
boundary constraints, the output achieves significantly higher
music-lyric compatibility than the baseline’s output.
Firstly, in "ours" output, there is no need to merge or 
split any musical notes to match the lyrics. Secondly, all the sentences
end with the same rhyme category [o, e, uo], creating .
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
We select the same five songs as GagaST (Guo
et al., 2022) for our subjective testing. When doing
this experiments, we ensure these songs are not in
the training set.

### List of Songs

| Song No.  | #Paragraphs | Component |
| --------  | -------- | -------- |
| Song 1    | 2 | *A World without Danger* (Code Lyoko Theme Song)   |
| Song 2    | 3 | *As The Deer*, by Marty Nystrom   |
| Song 3    | 2 | *Autumn in New York*, by Vernon Duke |
| Song 4    | 4 | *Best Mistake*, by Ariana Grande |
| Song 5    | 3 | *Better Together*, Luke Combs |

### List of Models

| Model No. | Component |
| -------- | -------- |
| Model 1   | BART with finetuning   |
| Model 2   | GagaST   |
| Model 3   | Our final model (BT + controling length, rhyme, boundary) |
| Model 4   | Ablated model (BT + controling length, rhyme) |
| Model 5   | Ablated model (BT + controling length) |
| Model 6   | Ablated model (BT) |

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
  <img width="450" src="/assets/images/fig_rhyme_dist.png">
</p>
The figure above shows the "rhyme distribution" when translating the paragraph in the "Model Output Demo" section. This distribution is obtained from our reverse-order decoder, which is a text quality prediction when using different rhyme type as requirement.
When using the 1st best and 2nd worst rhymes as constraints, the results are as below.

<p align="center">
  <img width="400" src="/assets/images/fig_rhydif.png">
</p>

With the 1st-ranked rhyme as prompt (left paragraph), the output is perfect in length and rhyme control and has a satisfactory translation quality.
However, Various translation errors appear in the 2nd output, i.e., the output with 2nd worst rhyme (right paragraph): wrong translation (red text), violation of target language grammar (green text), repeated phrases (orange text), failed rhyme control (highlighted text). 

## Typical Issues of Modifying Beam Search
### Length Forcing
<p align="center">
  <img width="250" src="/assets/images/fig_biased1.png">
  <img width="250" src="/assets/images/fig_biased2.png">
</p>
If the desired length is shorter than unconstrained output, the beam search might
end too soon, so the sentence will be incomplete
(left figure). If the desired length is unexpectly long (right figure), there tends to be repetition
in the outputs. Both cases significantly damage the
translation quality, although the outputs may even have higher BLEU scores.

### Biased Decoding for Rhyme Control
<p align="center">
  <img width="250" src="/assets/images/fig_biased3.png">
  <img width="250" src="/assets/images/fig_biased4.png">
</p>
A type of error frequently
happens that the end-words in the outputs
are biased toward words that satisfy the rhyme constraints
but are irrelevant to the source sentences
and are incompatible with other parts of the output
sentences. Such problems
are much rarer in translations obtained by prompt based
methods.
