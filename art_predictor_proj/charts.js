/**
 * Dynamic Chart Visualizations for MET Art Display Predictor
 * Updates automatically when analysis_stats.json changes
 * 
 * Uses Chart.js (free, popular charting library)
 * Install: npm install chart.js
 * Or CDN: <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
 */

import Chart from 'chart.js/auto';

/**
 * Load analysis data from JSON
 * @returns {Promise<Object>} Analysis statistics
 */
export async function loadAnalysisData() {
  try {
    const response = await fetch('/data/analysis_stats.json');
    if (!response.ok) {
      throw new Error(`Failed to load: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error loading analysis data:', error);
    throw error;
  }
}

/**
 * Create On View vs Not On View pie chart
 * @param {string} canvasId - ID of the canvas element
 * @param {Object} data - Analysis statistics data
 * @returns {Chart} Chart.js instance
 */
export function createDistributionPieChart(canvasId, data) {
  const ctx = document.getElementById(canvasId).getContext('2d');
  
  return new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['On View', 'Not On View'],
      datasets: [{
        data: [
          data.distribution.on_view,
          data.distribution.not_on_view
        ],
        backgroundColor: [
          '#4CAF50',  // Green for on view
          '#FF5722'   // Red for not on view
        ],
        borderWidth: 2,
        borderColor: '#ffffff'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: 'MET Collection Distribution',
          font: { size: 18, weight: 'bold' }
        },
        legend: {
          position: 'bottom',
          labels: { font: { size: 14 } }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const label = context.label || '';
              const value = context.parsed || 0;
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = ((value / total) * 100).toFixed(1);
              return `${label}: ${value.toLocaleString()} (${percentage}%)`;
            }
          }
        }
      }
    }
  });
}

/**
 * Create department distribution bar chart
 * @param {string} canvasId - ID of the canvas element
 * @param {Object} data - Analysis statistics data
 * @param {number} topN - Number of top departments to show
 * @returns {Chart} Chart.js instance
 */
export function createDepartmentChart(canvasId, data, topN = 10) {
  const ctx = document.getElementById(canvasId).getContext('2d');
  
  // Sort by count and take top N
  const deptData = data.by_department
    .sort((a, b) => b.count - a.count)
    .slice(0, topN);
  
  return new Chart(ctx, {
    type: 'bar',
    data: {
      labels: deptData.map(d => d.department),
      datasets: [{
        label: 'Number of Items',
        data: deptData.map(d => d.count),
        backgroundColor: '#2196F3',
        borderColor: '#1976D2',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: 'y',  // Horizontal bars
      plugins: {
        title: {
          display: true,
          text: `Top ${topN} Departments by Collection Size`,
          font: { size: 18, weight: 'bold' }
        },
        legend: { display: false }
      },
      scales: {
        x: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return value.toLocaleString();
            }
          }
        }
      }
    }
  });
}

/**
 * Create error analysis chart
 * @param {string} canvasId - ID of the canvas element
 * @param {Object} data - Analysis statistics data
 * @returns {Chart} Chart.js instance
 */
export function createErrorChart(canvasId, data) {
  const ctx = document.getElementById(canvasId).getContext('2d');
  
  return new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Correct', 'False Positives', 'False Negatives'],
      datasets: [{
        data: [
          data.errors.correct,
          data.errors.false_positives,
          data.errors.false_negatives
        ],
        backgroundColor: [
          '#4CAF50',  // Green
          '#FF9800',  // Orange
          '#9C27B0'   // Purple
        ],
        borderWidth: 2,
        borderColor: '#ffffff'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: 'Model Predictions Analysis',
          font: { size: 18, weight: 'bold' }
        },
        legend: {
          position: 'bottom',
          labels: { font: { size: 14 } }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const label = context.label || '';
              const value = context.parsed || 0;
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = ((value / total) * 100).toFixed(2);
              return `${label}: ${value.toLocaleString()} (${percentage}%)`;
            }
          }
        }
      }
    }
  });
}

/**
 * Create time period (century) distribution chart
 * @param {string} canvasId - ID of the canvas element
 * @param {Object} data - Analysis statistics data
 * @returns {Chart} Chart.js instance
 */
export function createCenturyChart(canvasId, data) {
  const ctx = document.getElementById(canvasId).getContext('2d');
  
  // Sort by century
  const centuryData = data.by_century
    .sort((a, b) => a.century - b.century);
  
  return new Chart(ctx, {
    type: 'line',
    data: {
      labels: centuryData.map(d => {
        const century = d.century;
        if (century < 0) {
          return `${Math.abs(century)} BCE`;
        }
        return `${century} CE`;
      }),
      datasets: [{
        label: 'Number of Items',
        data: centuryData.map(d => d.count),
        borderColor: '#9C27B0',
        backgroundColor: 'rgba(156, 39, 176, 0.1)',
        fill: true,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: 'Collection Distribution by Time Period',
          font: { size: 18, weight: 'bold' }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return value.toLocaleString();
            }
          }
        }
      }
    }
  });
}

/**
 * Initialize all charts
 * Call this when your page loads
 * @returns {Promise<Object>} Object containing all chart instances
 */
export async function initializeAllCharts() {
  try {
    // Load data
    const data = await loadAnalysisData();
    
    // Create charts
    const charts = {
      distribution: createDistributionPieChart('distributionChart', data),
      departments: createDepartmentChart('departmentChart', data, 10),
      errors: createErrorChart('errorChart', data),
      timeline: createCenturyChart('centuryChart', data)
    };
    
    // Display last updated time
    const lastUpdated = new Date(data.last_updated);
    const updateElement = document.getElementById('lastUpdated');
    if (updateElement) {
      updateElement.textContent = `Last updated: ${lastUpdated.toLocaleDateString()}`;
    }
    
    console.log('✓ All charts initialized');
    return charts;
    
  } catch (error) {
    console.error('Failed to initialize charts:', error);
    throw error;
  }
}

/**
 * Update all charts with new data
 * Call this when data is refreshed
 * @param {Object} charts - Chart instances from initializeAllCharts
 */
export async function updateAllCharts(charts) {
  try {
    const data = await loadAnalysisData();
    
    // Update distribution chart
    charts.distribution.data.datasets[0].data = [
      data.distribution.on_view,
      data.distribution.not_on_view
    ];
    charts.distribution.update();
    
    // Update other charts similarly...
    console.log('✓ Charts updated');
    
  } catch (error) {
    console.error('Failed to update charts:', error);
  }
}

