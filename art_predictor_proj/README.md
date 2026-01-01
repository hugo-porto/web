# Website Integration Files

This folder contains all the files needed to integrate the ML model with your website.

## Files

### Python Script

- **`generate_website_data.py`** - Main script to generate all JSON data files for the website

### JavaScript Utilities

- **`prediction.js`** - Client-side prediction logic using similarity matching

## Setup Instructions

### 1. Copy to Website Project

Copy this entire folder to your website project:

```bash
# From this ML project root
cp -r website-integration /path/to/your/website/project/ml-integration
```

### 2. Install Python Dependencies

In your website project, create `requirements-ml.txt`:

```txt
numpy>=1.24.0
pandas>=2.0.0
catboost>=1.2.0
scikit-learn>=1.3.0
```

Install:
```bash
pip install -r requirements-ml.txt
```

### 3. Run the Export Script

From your website project's `ml-integration/` folder:

```bash
python generate_website_data.py
```

This will generate 5 JSON files in `./output/`:
- `predictions_sample.json` (~2-5 MB) - Sample items for similarity matching
- `underrated_items.json` (~50-200 KB) - Top false positives
- `analysis_stats.json` (~100-500 KB) - Statistics for charts
- `feature_ranges.json` (~10-50 KB) - Feature ranges for validation
- `model_metadata.json` (~10 KB) - Model info and feature importance

### 4. Copy JSON Files to Website

Move the generated files to your website's public folder:

```bash
cp output/*.json ../public/data/
```

### 5. Use in Website

#### Load Data

```javascript
// In your React/Vue component or vanilla JS
import { loadPredictionsSample } from './utils/prediction.js';

const sampleItems = await loadPredictionsSample();
```

#### Make Predictions

```javascript
import { predictFromUserInput } from './utils/prediction.js';

const userInput = {
  department: "European Paintings",
  objectBeginDate: 1850,
  objectEndDate: 1900,
  classification: "Paintings",
  medium: "Oil on canvas"
};

const result = predictFromUserInput(userInput, sampleItems);

console.log(result);
// {
//   probability: 0.78,
//   prediction: "on-view",
//   confidence: "high",
//   message: "Prediction based on 5 similar items...",
//   similarItems: [...]
// }
```

#### Display Underrated Items

```javascript
fetch('/data/underrated_items.json')
  .then(res => res.json())
  .then(data => {
    data.items.forEach(item => {
      console.log(`${item.title} - ${item.predicted_probability * 100}% confidence`);
    });
  });
```

## Monthly Updates

### Option 1: GitHub Actions (Recommended)

Create `.github/workflows/monthly_update.yml` in your website project:

```yaml
name: Monthly Data Update

on:
  schedule:
    - cron: '0 2 1 * *'  # 1st of month at 2 AM
  workflow_dispatch:  # Allow manual trigger

jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.10'
      
      - name: Install dependencies
        run: pip install -r requirements-ml.txt
      
      # Download model from ML project
      - name: Download model
        run: |
          wget https://github.com/YOUR_USERNAME/art-display-predictor/releases/latest/download/catboost_model.cbm \
            -O ml-integration/models/catboost_model.cbm
      
      # Run export script
      - name: Generate website data
        run: python ml-integration/generate_website_data.py
      
      # Copy to public folder
      - name: Copy to public
        run: cp ml-integration/output/*.json public/data/
      
      # Commit changes
      - name: Commit updates
        run: |
          git config user.name "GitHub Actions"
          git config user.email "actions@github.com"
          git add public/data/
          git commit -m "Update data: $(date +'%Y-%m-%d')" || echo "No changes"
          git push
```

### Option 2: Manual Update

Run locally and commit:

```bash
cd ml-integration
python generate_website_data.py
cp output/*.json ../public/data/
git add ../public/data/
git commit -m "Update data"
git push
```

## Configuration

Edit `generate_website_data.py` to customize:

```python
CONFIG = {
    "model_path": "../models/catboost_model.cbm",  # Path to model
    "sample_size": 10000,  # Number of items for similarity search
    "underrated_count": 20,  # Number of underrated items
    # ... other settings
}
```

## File Sizes

Typical sizes:
- `predictions_sample.json`: 2-5 MB (10,000 items)
- `underrated_items.json`: 50-200 KB (20 items)
- `analysis_stats.json`: 100-500 KB
- `feature_ranges.json`: 10-50 KB
- `model_metadata.json`: 10 KB

**Total: ~3-6 MB** - Perfect for GitHub Pages!

## Troubleshooting

### "Model not found"
Make sure the model file path in CONFIG is correct. Either:
1. Copy model from ML project to `ml-integration/models/`
2. Or update `model_path` to point to correct location

### "Data files not found"
Make sure you have access to the data files from the ML project:
1. Copy `data/splits/` and `data/meta_for_model.parquet` to `ml-integration/data/`
2. Or use git submodule to link ML project

### "Out of memory"
Reduce `sample_size` in CONFIG from 10000 to 5000 or less.

## Next Steps

1. Copy these files to your website project
2. Run `generate_website_data.py` to create JSON files
3. Integrate `prediction.js` into your frontend
4. Build your UI components
5. Set up GitHub Actions for automation

Happy coding! 🚀

