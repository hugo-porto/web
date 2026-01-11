---
title: "Master's Thesis - Modality fusion in enzyme interaction prediction"
nav_label: "MSc Thesis"
date: 2024-12-12
draft: false
description: "Modality-fusion strategies for a transformer predicting enzyme-substrate interactions"
tags: ["Bioinformatics", "Deep Learning", "Modality Fusion"]
github: "https://github.com/gtrevnenski/MuMoTEn"
images:
  - "mcc_with_histogram_mutiplicative_normalized.png"
---

<style>
.thesis-section {
  margin: 2rem 0;
}

.thesis-objective {
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border-left: 4px solid #3b82f6;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.thesis-objective-title {
  font-weight: 700;
  font-size: 1.1rem;
  color: #1e40af;
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.thesis-objective-title::before {
  content: "🎯";
  font-size: 1.3rem;
}

.thesis-objective-text {
  color: #1e3a8a;
  line-height: 1.7;
}

.thesis-subtitle {
  font-weight: 700;
  font-size: 1.1rem;
  color: #1f2937;
  margin-bottom: 1.25rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e5e7eb;
}

.thesis-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.thesis-list li {
  position: relative;
  padding-left: 2rem;
  margin-bottom: 1.25rem;
  line-height: 1.7;
  color: #374151;
}

.thesis-list li::before {
  content: "▸";
  position: absolute;
  left: 0.5rem;
  color: #3b82f6;
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

<div class="thesis-section">
<div class="thesis-objective">
<div class="thesis-objective-title">Objective</div>
<div class="thesis-objective-text">
Improved state-of-the-art prediction of protein-small molecule interactions by incorporating 3D protein structural data into a pre-trained multimodal transformer to enhance model generalizability and robustness.
</div>
</div>

<div class="thesis-subtitle">Key Responsibilities & Actions</div>

<ul class="thesis-list">
<li>Constructed a novel dataset of ~185,000 data points by mapping protein sequences to 3D structures from AlphaFold using the Graphein library.</li>
<li>Represented protein structures as graphs and generated node embeddings using the Node2Vec algorithm.</li>
<li>Designed & implemented novel modality fusion techniques (additive & multiplicative) to merge protein sequence and structural embeddings before feeding them into a pre-trained transformer, avoiding costly retraining from scratch.</li>
<li>Trained and evaluated model performance end-to-end, including a gradient boosting (XGBoost) ensemble step, across various data split scenarios (random, cold protein, cold SMILES).</li>
</ul>

<div class="results-section">
<div class="results-title">Key Results</div>

<ul class="results-list">
<li>Validated that the model maintains high performance (~97% accuracy) on standard random splits.</li>
<li>Demonstrated improved generalization, achieving a ~1% accuracy increase on challenging "cold start" splits with unseen small molecules—the primary failure mode of the original model.</li>
<li>Showcased significantly better performance (via MCC score) for rare, underrepresented substrates, highlighting the model's potential for novel discovery.</li>
</ul>
</div>
</div>
