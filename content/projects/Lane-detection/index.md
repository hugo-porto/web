---
title: "Tranformer-based Lane Detection"
nav_label: "Lane Detection"
date: 2023-11-12
draft: false
description: "Transformer-based lane detection that leverages spatiotemporal information from sequential video frames to robustly dynamic road conditions"
tags: ["Computer Vision", "Deep Learning", "Transformers"]
images:
  - "model_architecture.jpg"
---

<style>
.lane-section {
  margin: 2rem 0;
}

.lane-objective {
  background: linear-gradient(135deg, #fdf4ff 0%, #fae8ff 100%);
  border-left: 4px solid #a855f7;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.lane-objective-title {
  font-weight: 700;
  font-size: 1.1rem;
  color: #7e22ce;
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.lane-objective-title::before {
  content: "🎯";
  font-size: 1.3rem;
}

.lane-objective-text {
  color: #6b21a8;
  line-height: 1.7;
}

.lane-subtitle {
  font-weight: 700;
  font-size: 1.1rem;
  color: #1f2937;
  margin-bottom: 1.25rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e5e7eb;
}

.lane-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.lane-list li {
  position: relative;
  padding-left: 2rem;
  margin-bottom: 1.25rem;
  line-height: 1.7;
  color: #374151;
}

.lane-list li::before {
  content: "▸";
  position: absolute;
  left: 0.5rem;
  color: #a855f7;
  font-weight: 700;
  font-size: 1.2rem;
}

.results-section {
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  border-left: 4px solid #10b981;
  padding: 1.5rem;
  border-radius: 8px;
  margin-top: 2rem;
}

.results-title {
  font-weight: 700;
  font-size: 1.1rem;
  color: #065f46;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.results-title::before {
  content: "✅";
  font-size: 1.3rem;
}

.results-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.results-list li {
  position: relative;
  padding-left: 2rem;
  margin-bottom: 1rem;
  line-height: 1.7;
  color: #064e3b;
}

.results-list li::before {
  content: "✓";
  position: absolute;
  left: 0.5rem;
  color: #10b981;
  font-weight: 700;
  font-size: 1.3rem;
}
</style>

<div class="lane-section">
<div class="lane-objective">
<div class="lane-objective-title">Objective</div>
<div class="lane-objective-text">
Improve robustness of lane detection through leveraging spatiotemporal context from video sequences by using Transormer-based architecture.
</div>
</div>

<div class="lane-subtitle">Personal Responsibilities & Actions</div>

<ul class="lane-list">
<li>Curated and preprocessed large-scale driving datasets (CULane: 55h / 133k frames, TuSimple), converting lane point annotations into segmentation masks.</li>
<li>Designed and applied a data augmentation pipeline (random flips, rotations ±30°, crops, and normalization) to improve robustness to camera pose changes, occlusions, and viewpoint shifts.</li>
<li>Built a transformer-based segmentation pipeline that leverages temporal information across video frames to improve lane detection consistency.</li>
<li>Evaluated and replaced a ResNet34 backbone with a self-supervised MAE-ViT, validating superior lane-specific feature extraction via custom image-reconstruction experiments.</li>
</ul>

<div class="results-section">
<div class="results-title">Key Results</div>

<ul class="results-list">
<li>Demonstrated MAE-ViT's advantage over CNN backbones for capturing long, thin, and partially occluded lane structures.</li>
<li>Showed that temporal modeling with transformers stabilizes training and improves qualitative lane predictions under challenging conditions.</li>
<li>Delivered a validated proof-of-concept under strict hardware constraints.</li>
</ul>
</div>
</div>
