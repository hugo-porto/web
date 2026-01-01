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

### 🛣️ Project Overview

As part of a research project at **TU Delft**, I collaborated on developing a **robust lane detection system** leveraging **Transformer-based architectures**. The objective was to address challenges such as **environmental variability, occlusions, and dynamic road conditions** by exploiting **spatiotemporal relationships** in sequential video frames.

---

### 🔑 Key Aspects of the Project

#### 🧠 Innovative Pipeline
Designed a model architecture combining a **Masked Autoencoder (MAE)** for feature extraction with a **Transformer decoder** to process sequential frames, improving overall lane detection accuracy.

#### 🧪 Data Processing
Implemented preprocessing and augmentation techniques—including **random flips, rotations, and resizing**—to optimize the **CULane dataset** for effective model training.

#### 📊 Performance Evaluation
Explored loss functions such as **IoU** and **Cross-Entropy**, achieving promising results despite hardware constraints. Visual validation confirmed the model's ability to detect **straight lanes** and **adapt to curved road segments**.
