---
title: "A Modular Zero-Shot Pipeline for Accident Detection, Localisation, and Classification in Traffic Surveillance Video"
description: A modular, zero-shot computer vision pipeline for detecting, localizing, and classifying traffic accidents in surveillance footage without task-specific training data.
venue: NASA Astrophysics Data System
pubDate: 2026-04-14
authors:
  - Amey Thakur
  - Sarvesh Talele
url: https://arxiv.org/abs/2604.09685
---

Submitted to the ACCIDENT @ CVPR 2026 challenge and indexed in the NASA Astrophysics Data System. The pipeline
decomposes accident detection into three independent, zero-shot stages — temporal detection via frame-difference
peak analysis, spatial localization via dense optical flow, and collision-type classification via CLIP embedding
similarity — using only pre-trained model weights, with no domain-specific fine-tuning. Implementation available
as a public Kaggle notebook.
