# Dynamic Chart Visualizations

Automatically updating charts that refresh monthly with new data from MET's API.

## 🎯 How It Works

```
Monthly Update (GitHub Actions)
    ↓
generate_website_data.py runs
    ↓
Creates/updates analysis_stats.json
    ↓
Website loads JSON
    ↓
Charts render with latest data
    ↓
Auto-updates next month!
```

## 📊 Available Charts

1. **Distribution Pie Chart** - On View vs Not On View
2. **Department Bar Chart** - Top departments by collection size
3. **Error Analysis Doughnut** - Model prediction accuracy
4. **Timeline Chart** - Collection distribution by century

## 🚀 Quick Start

### 1. Generate Initial Data

```bash
cd website-integration
python generate_website_data.py
```

This creates `output/analysis_stats.json` with chart data.

### 2. View Example (Local)

```bash
# Serve the example HTML
python -m http.server 8000

# Open: http://localhost:8000/charts-example.html
```

### 3. Integrate Into Your Website

**Option A: Vanilla JavaScript**

```html
<!-- Add Chart.js -->
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

<!-- Your chart containers -->
<canvas id="distributionChart"></canvas>
<canvas id="departmentChart"></canvas>

<!-- Load and render -->
<script type="module">
  import { initializeAllCharts } from './charts.js';
  
  // Initialize when page loads
  initializeAllCharts();
</script>
```

**Option B: React/Vue**

```javascript
// Install Chart.js
npm install chart.js

// In your component
import { useEffect, useState } from 'react';
import { initializeAllCharts } from './charts.js';

function AnalyticsDashboard() {
  useEffect(() => {
    initializeAllCharts();
  }, []);
  
  return (
    <div>
      <canvas id="distributionChart"></canvas>
      <canvas id="departmentChart"></canvas>
      {/* ... more charts */}
    </div>
  );
}
```

## 📁 File Structure

```
website/
├── public/
│   └── data/
│       └── analysis_stats.json    # Updated monthly
├── src/
│   ├── components/
│   │   └── Analytics.jsx          # Your analytics page
│   └── utils/
│       └── charts.js               # Chart creation functions
```

## 🔄 Monthly Auto-Updates

### GitHub Actions Setup

```yaml
# .github/workflows/monthly_update.yml
name: Monthly Data Update

on:
  schedule:
    - cron: '0 0 1 * *'  # 1st of every month
  workflow_dispatch:

jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Generate new data
        run: python website-integration/generate_website_data.py
      
      - name: Copy to website
        run: cp website-integration/output/*.json public/data/
      
      - name: Commit
        run: |
          git config user.name "GitHub Actions"
          git config user.email "actions@github.com"
          git add public/data/
          git commit -m "Update data: $(date +'%Y-%m-%d')"
          git push
```

When this runs monthly:
1. ✅ Generates new JSON with latest data
2. ✅ Commits to repo
3. ✅ Website rebuilds (GitHub Pages auto-deploys)
4. ✅ Charts show updated data

## 🎨 Customization

### Change Colors

```javascript
// In charts.js
backgroundColor: [
  '#YOUR_COLOR_1',  // On view color
  '#YOUR_COLOR_2'   // Not on view color
]
```

### Add More Charts

```javascript
export function createYourCustomChart(canvasId, data) {
  const ctx = document.getElementById(canvasId).getContext('2d');
  
  return new Chart(ctx, {
    type: 'bar',  // or 'line', 'radar', 'scatter'
    data: {
      labels: [...],
      datasets: [...]
    },
    options: {...}
  });
}
```

### Modify Data Export

Edit `generate_website_data.py`:

```python
# Add your custom aggregation
stats["your_custom_metric"] = {
    "value": calculated_value,
    "data": custom_data_array
}
```

## 📱 Responsive Design

Charts automatically resize! Add these CSS rules:

```css
.chart-container {
  position: relative;
  height: 400px;
  width: 100%;
}

@media (max-width: 768px) {
  .chart-container {
    height: 300px;
  }
}
```

## 🐛 Troubleshooting

**Charts not showing?**
```bash
# Check JSON file exists
ls output/analysis_stats.json

# Check JSON is valid
python -m json.tool output/analysis_stats.json
```

**Data not updating?**
```bash
# Regenerate data
python generate_website_data.py

# Check last_updated timestamp
cat output/analysis_stats.json | grep last_updated
```

**Console errors?**
- Check Chart.js is loaded
- Verify canvas IDs match
- Check data path in fetch()

## 📊 Data Format

`analysis_stats.json` structure:

```json
{
  "last_updated": "2024-12-28T10:30:00",
  "total_items": 72808,
  "accuracy": 0.948,
  "distribution": {
    "on_view": 7000,
    "not_on_view": 65808,
    "on_view_percentage": 9.6,
    "not_on_view_percentage": 90.4
  },
  "by_department": [
    {
      "department": "Asian Art",
      "count": 5573,
      "on_view_rate": 0.12
    }
  ],
  "by_century": [...],
  "errors": {
    "correct": 69311,
    "false_positives": 2875,
    "false_negatives": 622
  }
}
```

## 🎓 For Your Portfolio

**Highlight these features:**
- ✅ Dynamic data visualization
- ✅ Automated monthly updates
- ✅ Responsive design
- ✅ Clean, modern UI
- ✅ Real-time data loading
- ✅ CI/CD integration

**Tell recruiters:**
> "Built a dynamic analytics dashboard with Chart.js that automatically updates monthly via GitHub Actions. The system fetches new data from the MET Museum API, regenerates predictions, and updates all visualizations without manual intervention."

## 🔗 Resources

- [Chart.js Docs](https://www.chartjs.org/docs/latest/)
- [Chart.js Examples](https://www.chartjs.org/docs/latest/samples/information.html)
- [Color Palette Ideas](https://coolors.co/)

## 💡 Next Steps

1. Add more chart types (radar, scatter, bubble)
2. Add filtering/interactive controls
3. Add download options (CSV, PNG export)
4. Add comparison views (month-over-month)
5. Add animations/transitions
6. Add dark mode toggle

Enjoy your dynamic, auto-updating dashboard! 📈

