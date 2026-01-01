---
title: "Lindel"
nav_label: "Lindel"
date: 2023-04-15
draft: false
description: "Reproducing, Evaluating and Interpreting the Lindel Model for CRISPR-Cas9 Repair Outcome Prediction"
tags: ["Bioinformatics", "Machine Learning", "Model Interpretation"]
github: "https://github.com/gtrevnenski/L1-Lindel"
---

### 🧬 Project Overview

In a collaborative academic project, our team **reproduced and validated key findings** from **Chen et al.’s** seminal work on predicting **CRISPR-Cas9 DNA repair outcomes**. We successfully replicated the core functionality of their machine learning model, **Lindel**, confirming both its **superiority over a baseline model** and the **high reproducibility of mutational outcomes** across experiments.

---

### 🔍 Individual Research Focus

My individual contribution centered on **interpreting the model’s internal logic** to critically evaluate the authors’ claims regarding **sequence context importance**.

---

### 🎯 Objective

**Assess whether the logistic regression model used to predict the insertion–deletion (indel) ratio learns the same sequence context importance as reported in the original paper.**

---

### 🛠️ Methods

To interpret and validate the model’s behavior, I applied a **complementary set of interpretability techniques**:

- **Learned weights analysis** of the neural network  
- **SHAP (SHapley Additive exPlanations)** for feature importance  
- **Multiple Correspondence Analysis (MCA)** to examine relationships in categorical sequence data  

---

### ✅ Key Findings

- **Confirmed** the strong influence of a single nucleotide (**‘T’**) at the cut site (position 17),  
  though its impact on model predictions differed from the paper’s biochemical interpretation.
- **Questioned** the reported importance of specific dinucleotides (e.g., *TG*, *CG*, *GA*),  
  as their effects were not consistently supported across interpretability analyses.
- **Concluded** that the model relies more heavily on **single-nucleotide features** than originally proposed,  
  offering a more nuanced and critical understanding of the model’s decision-making process.


