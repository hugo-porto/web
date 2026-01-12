---
title: "MET Art Display Predictor"
nav_label: "ML Art Curator"
date: 2025-12-28
draft: false
description: "ML-powered prediction of artwork exhibition likelihood - using data from the Metropolitan Museum of Art"
tags: ["Gradient Boosting", "MLOps", "Data Analysis"]
github: "https://github.com/gtrevnenski/art-display-predictor"
---

Analysis of public data from the Metropolitan Museum of Art and a gradient boosting algorithm predicting which art piece is on view  

This project uses data made available by The Metropolitan Museum of Art under the Open Access program.  

MET Open Access Dataset: https://github.com/metmuseum/openaccess  

{{< dashboard >}}
<h2 style="display: none;">Dataset Analysis</h2>

<div class="data-analysis">
<div class="stats-summary" id="statsSummary">
<div class="stat-item">
<div class="stat-value" id="totalItems">Loading...</div>
<div class="stat-label">Total Artworks</div>
</div>
<div class="stat-item">
<div class="stat-value" id="onViewCount">Loading...</div>
<div class="stat-label">On Display</div>
</div>
<div class="stat-item">
<div class="stat-value" id="notOnViewCount">Loading...</div>
<div class="stat-label">In Storage</div>
</div>
</div>

<div class="class-distribution">
<h3 style="text-align: center; margin-bottom: 1rem; color: #1f2937; font-size: 1.1rem;">Class Distribution</h3>
<div class="distribution-bar">
<div class="bar-segment on-view" id="onViewBar">
<span class="bar-label" id="onViewLabel">10.8%</span>
</div>
<div class="bar-segment not-on-view" id="notOnViewBar">
<span class="bar-label" id="notOnViewLabel">89.2%</span>
</div>
</div>
<div class="legend">
<div class="legend-item">
<div class="legend-color on-view-color"></div>
<span>On View</span>
</div>
<div class="legend-item">
<div class="legend-color not-on-view-color"></div>
<span>Not On View</span>
</div>
</div>
</div>
<div class="updated-since-retrain">
<div class="updated-value" id="updatedSinceRetrain">Loading...</div>
<div class="updated-label" id="updatedSinceRetrainPct">Updated since last retrain</div>
</div>
<div class="update-info" id="analysisUpdateInfo">Last updated: Loading...</div>
</div>
{{< /dashboard >}}

{{< dashboard >}}
<h2 style="display: none;">Model Performance Dashboard</h2>

<div class="model-dashboard">
<div class="metrics-grid" id="metricsGrid"></div>
<div class="update-info" id="updateInfo">Loading...</div>
</div>
{{< /dashboard >}}

<h2 style="display: none;">Try the Model</h2>

<div class="prediction-form-container">
<form id="predictionForm">
<div class="form-group">
<label for="textInput">Artwork Description *</label>
<textarea id="textInput" name="text" rows="3" placeholder="e.g., Oil painting depicting a pastoral landscape with figures" required></textarea>
</div>

<div class="form-row">
<div class="form-group">
<label for="departmentInput">Department *</label>
<div class="custom-select">
<input type="text" id="departmentInput" name="department" placeholder="Search departments..." autocomplete="off" required>
<div class="dropdown-list" id="departmentList"></div>
</div>
</div>

<div class="form-group">
<label for="classificationInput">Classification *</label>
<div class="custom-select">
<input type="text" id="classificationInput" name="classification" placeholder="Search classifications..." autocomplete="off" required>
<div class="dropdown-list" id="classificationList"></div>
</div>
</div>
</div>

<div class="form-row">
<div class="form-group">
<label for="cultureInput">Culture *</label>
<div class="custom-select">
<input type="text" id="cultureInput" name="culture" placeholder="Search cultures..." autocomplete="off" required>
<div class="dropdown-list" id="cultureList"></div>
</div>
</div>

<div class="form-group">
<label for="mediumInput">Medium *</label>
<div class="custom-select">
<input type="text" id="mediumInput" name="medium" placeholder="Search mediums..." autocomplete="off" required>
<div class="dropdown-list" id="mediumList"></div>
</div>
</div>
</div>

<div class="form-row">
<div class="form-group">
<label for="beginDateInput">Object Begin Date *</label>
<input type="number" id="beginDateInput" name="objectBeginDate" placeholder="e.g., 1850" required>
<small>Range: -400000 to 5000</small>
</div>

<div class="form-group">
<label for="endDateInput">Object End Date *</label>
<input type="number" id="endDateInput" name="objectEndDate" placeholder="e.g., 1860" required>
<small>Range: -240000 to 2870</small>
</div>
</div>

<button type="submit" class="submit-btn">Predict Display Likelihood</button>
</form>

<div id="predictionResult" class="prediction-result" style="display: none;"></div>
</div>

<style>
  .data-analysis {
    background: #ffffff;
    border: 2px solid #e5e7eb;
    border-radius: 12px;
    padding: 2rem;
    margin: 2rem 0;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  }
  
  .data-analysis::before {
    content: "Dataset Analysis";
    display: block;
    font-size: 1.5rem;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 1.5rem;
    text-align: center;
    font-family: 'Poppins', sans-serif;
  }
  
  .stats-summary {
    display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
  }
  
  .stat-item {
    text-align: center;
    padding: 1rem;
    background: #f9fafb;
    border-radius: 8px;
  }
  
  .stat-value {
    font-size: 1.75rem;
    font-weight: 700;
    color: #1f2937;
    margin-bottom: 0.5rem;
    font-family: 'Poppins', sans-serif;
  }
  
  .stat-label {
    font-size: 0.875rem;
    color: #6b7280;
    font-weight: 500;
  }
  
  .class-distribution {
    margin: 2rem 0;
  }
  
  .distribution-bar {
    display: flex;
    height: 60px;
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 1rem;
  }
  
  .bar-segment {
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s;
    position: relative;
  }
  
  .bar-segment:hover {
    opacity: 0.85;
    transform: scale(1.02);
  }
  
  .bar-segment.on-view {
    background: linear-gradient(135deg, #3b82f6, #2563eb);
  }
  
  .bar-segment.not-on-view {
    background: linear-gradient(135deg, #6b7280, #4b5563);
  }
  
  .bar-label {
    color: white;
    font-weight: 600;
    font-size: 1.1rem;
  }
  
  .legend {
    display: flex;
    justify-content: center;
    gap: 2rem;
    margin-top: 1rem;
  }
  
  .legend-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .legend-color {
    width: 20px;
    height: 20px;
    border-radius: 4px;
  }
  
  .on-view-color {
    background: linear-gradient(135deg, #3b82f6, #2563eb);
  }
  
  .not-on-view-color {
    background: linear-gradient(135deg, #6b7280, #4b5563);
  }

.updated-since-retrain {
  margin-top: 1.5rem;
  padding: 1rem;
  text-align: center;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}

.updated-value {
  font-size: 1.4rem;
  font-weight: 700;
  color: #1f2937;
}

.updated-label {
  font-size: 0.9rem;
  color: #6b7280;
  margin-top: 0.35rem;
}
  
  .prediction-form-container {
    background: #ffffff;
    border: 2px solid #e5e7eb;
    border-radius: 12px;
    padding: 2rem;
    margin: 2rem 0;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  }
  
  .prediction-form-container::before {
    content: "Try the Model";
    display: block;
    font-size: 1.5rem;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 1.5rem;
    text-align: center;
    font-family: 'Poppins', sans-serif;
  }
  
  .form-group {
    margin-bottom: 1.5rem;
  }
  
  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
  }
  
  .form-group label {
    display: block;
    font-weight: 600;
    color: #374151;
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
  }
  
  .form-group input[type="text"],
  .form-group input[type="number"],
  .form-group textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 0.95rem;
    transition: all 0.2s;
  }
  
  .form-group input:focus,
  .form-group textarea:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
  
  .form-group small {
    display: block;
    color: #6b7280;
    font-size: 0.8rem;
    margin-top: 0.25rem;
  }
  
  .custom-select {
    position: relative;
  }
  
  .dropdown-list {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    max-height: 200px;
    overflow-y: auto;
    background: white;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    z-index: 100;
    display: none;
    margin-top: 0.25rem;
  }
  
  .dropdown-list.active {
    display: block;
  }
  
  .dropdown-item {
    padding: 0.75rem;
    cursor: pointer;
    transition: background 0.2s;
    font-size: 0.9rem;
  }
  
  .dropdown-item:hover {
    background: #f3f4f6;
  }
  
  .dropdown-item.selected {
    background: #eff6ff;
    color: #3b82f6;
  }
  
  .submit-btn {
    width: 100%;
    padding: 1rem;
    background: linear-gradient(135deg, #3b82f6, #2563eb);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
    font-family: 'Poppins', sans-serif;
  }
  
  .submit-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  }
  
  .submit-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
  
  .prediction-result {
    margin-top: 2rem;
    padding: 1.5rem;
    border-radius: 8px;
    background: #f9fafb;
    border: 1px solid #e5e7eb;
  }
  
  .prediction-result.success {
    background: #ecfdf5;
    border-color: #10b981;
  }
  
  .prediction-result.error {
    background: #fef2f2;
    border-color: #ef4444;
  }
  
  .result-title {
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: #1f2937;
  }
  
  .result-item {
    display: flex;
    justify-content: space-between;
    padding: 0.5rem 0;
    border-bottom: 1px solid #e5e7eb;
  }
  
  .result-item:last-child {
    border-bottom: none;
  }
  
  .result-label {
    font-weight: 500;
    color: #6b7280;
  }
  
  .result-value {
    font-weight: 600;
    color: #1f2937;
  }
  
  .result-explanation {
    margin-top: 1rem;
    padding: 1rem;
    background: white;
    border-radius: 6px;
    font-size: 0.9rem;
    color: #374151;
  }
  
  .model-dashboard {
    background: #ffffff;
    border: 2px solid #e5e7eb;
    border-radius: 12px;
    padding: 2rem;
    margin: 2rem 0;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  }
  
  .model-dashboard::before {
    content: "Model Performance Dashboard";
    display: block;
    font-size: 1.5rem;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 1.5rem;
    text-align: center;
    font-family: 'Poppins', sans-serif;
  }
  
  .metrics-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.25rem;
    margin-bottom: 1rem;
  }
  
  .metric-card {
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 1.5rem;
    text-align: center;
    transition: all 0.2s;
  }
  
  .metric-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    border-color: #d1d5db;
  }
  
  .metric-value {
    font-size: 2rem;
    font-weight: 700;
    color: #1f2937;
    margin: 0.5rem 0;
    font-family: 'Poppins', sans-serif;
  }
  
  .metric-label {
    font-size: 0.75rem;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-weight: 600;
  }
  
  .update-info {
    text-align: center;
    color: #9ca3af;
    font-size: 0.875rem;
    margin-top: 1.5rem;
    padding-top: 1rem;
    border-top: 1px solid #e5e7eb;
  }
  
  @media (max-width: 768px) {
    .stats-summary {
      grid-template-columns: 1fr;
    }
    
    .metrics-grid {
      grid-template-columns: 1fr;
    }
    
    .bar-label {
      font-size: 0.9rem;
    }
    
    .form-row {
      grid-template-columns: 1fr;
    }
  }
</style>

<script>
  // Base-aware asset URLs for GitHub Pages subpath deployments (no Hugo templating to avoid literal braces)
  const SITE_BASE = (() => {
    const url = new URL(window.location.href);
    const path = url.pathname;
    const idx = path.indexOf('/projects/');
    const basePath = idx >= 0 ? path.slice(0, idx + 1) : path;
    return `${url.origin}${basePath || '/'}`;
  })();
  const ANALYSIS_URL = new URL("analysis_stats.json", SITE_BASE).toString();
  const METRICS_URL = new URL("model_metadata.json", SITE_BASE).toString();
  const FEATURES_URL = new URL("feature_ranges.json", SITE_BASE).toString();

  // Load dataset analysis
  async function loadDataAnalysis() {
    try {
      const response = await fetch(ANALYSIS_URL);
      const data = await response.json();
      
      // Update summary stats
      document.getElementById('totalItems').textContent = data.total_items.toLocaleString();
      document.getElementById('onViewCount').textContent = data.distribution.on_view.toLocaleString();
      document.getElementById('notOnViewCount').textContent = data.distribution.not_on_view.toLocaleString();
      
      // Update distribution bar
      const onViewPct = data.distribution.on_view_percentage;
      const notOnViewPct = data.distribution.not_on_view_percentage;
      
      document.getElementById('onViewBar').style.width = onViewPct + '%';
      document.getElementById('notOnViewBar').style.width = notOnViewPct + '%';
      document.getElementById('onViewLabel').textContent = onViewPct.toFixed(1) + '%';
      document.getElementById('notOnViewLabel').textContent = notOnViewPct.toFixed(1) + '%';
      
      // Updated since last retrain
      const updatedCount = data.updated_since_retrain?.count ?? 0;
      const updatedPct = data.updated_since_retrain?.percentage ?? 0;
      const retrainDate = data.updated_since_retrain?.last_retrain_date || '2025-10-19';
      document.getElementById('updatedSinceRetrain').textContent = updatedCount.toLocaleString();
      document.getElementById('updatedSinceRetrainPct').textContent =
        `${updatedPct.toFixed(2)}% since retrain (${retrainDate})`;
      
      const analysisUpdated = new Date(data.last_updated || '2025-10-19');
      document.getElementById('analysisUpdateInfo').textContent =
        `Last updated: ${analysisUpdated.toLocaleDateString()}`;
      
    } catch (error) {
      console.error('Failed to load data analysis:', error);
    }
  }
  
  loadDataAnalysis();
  
  // Load model metrics
  async function loadMetrics() {
    try {
      const response = await fetch(METRICS_URL);
      const data = await response.json();
      
      const metrics = [
        { label: 'Accuracy', value: (data.metrics.accuracy * 100).toFixed(2) + '%' },
        { label: 'Precision', value: (data.metrics.precision * 100).toFixed(2) + '%' },
        { label: 'Recall', value: (data.metrics.recall * 100).toFixed(2) + '%' },
        { label: 'F1 Score', value: (data.metrics.f1_score * 100).toFixed(2) + '%' },
        { label: 'AUC-ROC', value: data.metrics.auc_roc.toFixed(3) },
        { label: 'AUC-PR', value: data.metrics.auc_pr.toFixed(3) }
      ];
      
      const grid = document.getElementById('metricsGrid');
      grid.innerHTML = metrics.map(m => `
        <div class="metric-card">
          <div class="metric-label">${m.label}</div>
          <div class="metric-value">${m.value}</div>
        </div>
      `).join('');
      
      const date = new Date(data.last_updated);
      document.getElementById('updateInfo').textContent = 
        `Last updated: ${date.toLocaleDateString()}`;
        
    } catch (error) {
      document.getElementById('metricsGrid').innerHTML = 
        '<p style="color: #ef4444;">Failed to load metrics</p>';
    }
  }
  
  loadMetrics();
  
  // Prediction Form
  let featureRanges = null;
  
  async function loadFeatureRanges() {
    try {
      const response = await fetch(FEATURES_URL);
      featureRanges = await response.json();
      setupDropdowns();
    } catch (error) {
      console.error('Failed to load feature ranges:', error);
    }
  }
  
  function setupDropdowns() {
    createDropdown('departmentInput', 'departmentList', featureRanges.department);
    createDropdown('classificationInput', 'classificationList', featureRanges.classification);
    createDropdown('cultureInput', 'cultureList', featureRanges.culture);
    createDropdown('mediumInput', 'mediumList', featureRanges.medium);
  }
  
  function createDropdown(inputId, listId, options) {
    const input = document.getElementById(inputId);
    const list = document.getElementById(listId);
    
    if (!input || !list) return;
    
    let selectedValue = '';
    
    input.addEventListener('focus', () => {
      filterOptions(input.value);
      list.classList.add('active');
    });
    
    input.addEventListener('input', (e) => {
      filterOptions(e.target.value);
      selectedValue = '';
    });
    
    input.addEventListener('blur', (e) => {
      setTimeout(() => {
        list.classList.remove('active');
        if (!selectedValue && input.value) {
          const filtered = options.filter(opt => 
            opt && opt.toLowerCase().includes(input.value.toLowerCase())
          );
          if (filtered.length === 1) {
            input.value = filtered[0];
            selectedValue = filtered[0];
          }
        }
      }, 200);
    });
    
    function filterOptions(search) {
      const filtered = options.filter(opt => 
        opt && opt.toLowerCase().includes(search.toLowerCase())
      );
      
      list.innerHTML = filtered.slice(0, 50).map(opt => 
        `<div class="dropdown-item" data-value="${opt}">${opt || '(Empty)'}</div>`
      ).join('');
      
      list.querySelectorAll('.dropdown-item').forEach(item => {
        item.addEventListener('click', () => {
          const value = item.dataset.value;
          input.value = value;
          selectedValue = value;
          list.classList.remove('active');
        });
      });
    }
    
    filterOptions('');
  }
  
  document.getElementById('predictionForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = e.target.querySelector('.submit-btn');
    const resultDiv = document.getElementById('predictionResult');
    
    submitBtn.disabled = true;
    submitBtn.textContent = 'Predicting...';
    
    const formData = {
      text: document.getElementById('textInput').value,
      department: document.getElementById('departmentInput').value,
      classification: document.getElementById('classificationInput').value,
      culture: document.getElementById('cultureInput').value,
      medium: document.getElementById('mediumInput').value,
      objectBeginDate: parseInt(document.getElementById('beginDateInput').value),
      objectEndDate: parseInt(document.getElementById('endDateInput').value)
    };
    
    // Validate dates
    if (formData.objectBeginDate < -400000 || formData.objectBeginDate > 5000) {
      alert('Object Begin Date must be between -400000 and 5000');
      submitBtn.disabled = false;
      submitBtn.textContent = 'Predict Display Likelihood';
      return;
    }
    
    if (formData.objectEndDate < -240000 || formData.objectEndDate > 2870) {
      alert('Object End Date must be between -240000 and 2870');
      submitBtn.disabled = false;
      submitBtn.textContent = 'Predict Display Likelihood';
      return;
    }
    
    try {
      const response = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        const result = await response.json();
        displayResult(result, true);
      } else {
        const error = await response.text();
        displayResult({ error: error || 'Failed to get prediction' }, false);
      }
    } catch (error) {
      displayResult({ error: 'Failed to connect to API. Make sure the server is running on localhost:8000.' }, false);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Predict Display Likelihood';
    }
  });
  
  function displayResult(result, success) {
    const resultDiv = document.getElementById('predictionResult');
    resultDiv.style.display = 'block';
    resultDiv.className = 'prediction-result ' + (success ? 'success' : 'error');
    
    if (success) {
      resultDiv.innerHTML = `
        <div class="result-title">Prediction Result</div>
        <div class="result-item">
          <span class="result-label">Prediction:</span>
          <span class="result-value">${result.prediction === 'on_view' ? '✓ Likely On Display' : '✗ Likely In Storage'}</span>
        </div>
        <div class="result-item">
          <span class="result-label">Probability:</span>
          <span class="result-value">${(result.probability * 100).toFixed(2)}%</span>
        </div>
        <div class="result-item">
          <span class="result-label">Confidence:</span>
          <span class="result-value">${result.confidence}</span>
        </div>
        ${result.explanation ? `<div class="result-explanation">${result.explanation}</div>` : ''}
      `;
    } else {
      resultDiv.innerHTML = `
        <div class="result-title">Error</div>
        <div class="result-explanation">${result.error}</div>
      `;
    }
    
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
  
  loadFeatureRanges();
</script>
