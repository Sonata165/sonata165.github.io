---
layout: page
title: "Unifying Symbolic Music Arrangement: Track-Aware Reconstruction and Structured Tokenization"
permalink: /automatic_arrangement
---

Being updated ...

Abstract: We present a unified framework for automatic multitrack music arrangement that enables a single pre-trained symbolic music model to handle diverse arrangement scenarios, including reinterpretation, simplification, and additive generation. At its core is a segment-level reconstruction objective operating on token-level disentangled content and style, allowing for flexible any-to-any instrumentation transformations at inference time. To support track-wise modeling, we introduce REMI-z, a structured tokenization scheme for multitrack symbolic music. By preserving track-wise continuity while reducing sequence length and complexity, it enhances modeling efficiency and effectiveness for both arrangement tasks and unconditional generation. Our method outperforms task-specific state-of-the-art models on representative tasks in different arrangement scenarios—band arrangement, piano reduction, and drum arrangement, in both objective metrics and perceptual evaluations. Taken together, our framework demonstrates strong generality and suggests broader applicability in symbolic music-to-music transformation.