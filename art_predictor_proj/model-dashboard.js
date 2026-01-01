/**
 * Minimal model metrics dashboard
 * Load and display model performance metrics from JSON
 */

export async function loadModelMetrics() {
  const response = await fetch('/data/model_metadata.json');
  return await response.json();
}

export async function renderMetricsDashboard(containerId) {
  const data = await loadModelMetrics();
  const container = document.getElementById(containerId);
  
  const metrics = [
    { label: 'Accuracy', value: (data.metrics.accuracy * 100).toFixed(2) + '%' },
    { label: 'Precision', value: (data.metrics.precision * 100).toFixed(2) + '%' },
    { label: 'Recall', value: (data.metrics.recall * 100).toFixed(2) + '%' },
    { label: 'F1 Score', value: (data.metrics.f1_score * 100).toFixed(2) + '%' },
    { label: 'AUC', value: data.metrics.auc.toFixed(3) }
  ];
  
  container.innerHTML = `
    <div class="metrics-grid">
      ${metrics.map(m => `
        <div class="metric-card">
          <div class="metric-label">${m.label}</div>
          <div class="metric-value">${m.value}</div>
        </div>
      `).join('')}
    </div>
    <div class="update-info">
      Updated ${new Date(data.last_updated).toLocaleDateString()}
    </div>
  `;
}

