"""
Generate all JSON data files needed for the website.
Run this script to export predictions, analysis, and metadata.
"""

import json
import numpy as np
import pandas as pd
from pathlib import Path
from typing import Dict, List, Any
from catboost import CatBoostClassifier
from datetime import datetime


# Configuration
CONFIG = {
    "model_path": "notebooks\models\catboost_model_optimized_parameters_PRAUC_1000iter_e5large.cbm",
    "splits_dir": "data\splits_e5large",
    "metadata_file": "data\meta_for_model_e5large.parquet",
    "full_metadata_file": "data\df_train_clean.parquet",
    "output_dir": "./output",
    "cols_to_remove": ["isTimelineWork", "isPublicDomain", "accessionYear"],
    "threshold": 0.748,
    "underrated_count": 10,  # Number of underrated items
}


def load_model() -> CatBoostClassifier:
    """Load the trained model."""
    model = CatBoostClassifier()
    model.load_model(CONFIG["model_path"])
    print(f"✓ Model loaded from {CONFIG['model_path']}")
    return model


def load_data() -> tuple:
    """Load all data splits and metadata."""
    splits_dir = Path(CONFIG["splits_dir"])
    
    # Load ALL splits (for finding underrated items across entire dataset)
    train = np.load(splits_dir / "train.npz", allow_pickle=True)
    val = np.load(splits_dir / "val.npz", allow_pickle=True)
    test = np.load(splits_dir / "test.npz", allow_pickle=True)
    
    X_train = train["X"].astype(np.float32)
    y_train = train["y"].astype(int)
    X_val = val["X"].astype(np.float32)
    y_val = val["y"].astype(int)
    X_test = test["X"].astype(np.float32)
    y_test = test["y"].astype(int)
    
    # Combine all data
    X_all = np.vstack([X_train, X_val, X_test])
    y_all = np.concatenate([y_train, y_val, y_test])
    
    # Load feature columns
    feature_columns = np.load(
        splits_dir / "feature_columns.npy",
        allow_pickle=True
    ).tolist()
    
    # Load metadata
    metadata_df = pd.read_parquet(CONFIG["metadata_file"])
    
    # Load full metadata
    try:
        full_metadata_df = pd.read_parquet(CONFIG["full_metadata_file"])
    except:
        full_metadata_df = None
    
    print(f"✓ Data loaded: {X_all.shape[0]} total samples (train+val+test)")
    return X_all, y_all, X_test, y_test, feature_columns, metadata_df, full_metadata_df


def apply_feature_drop(X: np.ndarray, feature_columns: List[str]) -> tuple:
    """Drop features that were removed during training."""
    X_processed = X.copy()
    feature_columns_processed = feature_columns.copy()
    
    cols_to_drop = [col for col in CONFIG["cols_to_remove"] if col in feature_columns_processed]
    
    if cols_to_drop:
        drop_indices = [feature_columns_processed.index(col) for col in cols_to_drop]
        drop_indices_sorted = sorted(drop_indices, reverse=True)
        
        for idx in drop_indices_sorted:
            X_processed = np.delete(X_processed, idx, axis=1)
            feature_columns_processed.pop(idx)
    
    return X_processed, feature_columns_processed




def generate_all_predictions(
    model: CatBoostClassifier,
    X_all: np.ndarray,
    y_all: np.ndarray,
    X_test: np.ndarray,
    y_test: np.ndarray,
    metadata_df: pd.DataFrame,
    full_metadata_df: pd.DataFrame
) -> tuple:
    """
    Generate predictions on ALL data (for underrated items) and test data (for metrics).
    
    Returns:
        tuple: (all_metadata, test_metadata) - DataFrames with predictions
    """
    print("\n1. Generating predictions...")
    
    # Predictions on ALL data (for underrated items)
    y_proba_all = model.predict_proba(X_all)[:, 1]
    y_pred_all = (y_proba_all >= CONFIG["threshold"]).astype(int)
    
    all_metadata = metadata_df.copy().reset_index(drop=True)
    
    # Merge with full metadata
    if full_metadata_df is not None:
        all_metadata = all_metadata.merge(
            full_metadata_df[["objectID", "department", "title", "objectName", 
                             "culture", "medium", "classification"]],
            on="objectID",
            how="left"
        )
    
    # Add predictions
    all_metadata["predicted_probability"] = y_proba_all
    all_metadata["predicted_class"] = y_pred_all
    all_metadata["actual_label"] = y_all
    
    print(f"   ✓ Generated predictions for {len(all_metadata)} items (entire dataset)")
    
    # Also get test predictions separately (for metrics calculation)
    num_test = len(X_test)
    test_metadata = all_metadata.tail(num_test).reset_index(drop=True)
    
    return all_metadata, test_metadata


def generate_underrated_items(
    test_metadata: pd.DataFrame,
    output_dir: Path
) -> None:
    """
    Generate the "underrated items" list for the website.
    
    Finds artworks that the model predicts SHOULD be on display (high confidence)
    but are actually NOT on display (false positives). These are potentially
    interesting pieces that deserve more attention.
    """
    print("\n2. Generating underrated items...")
    
    # Filter false positives
    false_positives = test_metadata[
        (test_metadata["predicted_class"] == 1) & 
        (test_metadata["actual_label"] == 0)
    ].copy()
    
    # Sort by prediction probability
    false_positives = false_positives.sort_values("predicted_probability", ascending=False)
    
    # Take top N
    top_underrated = false_positives.head(CONFIG["underrated_count"])
    
    # Format for website
    underrated_items = []
    for _, row in top_underrated.iterrows():
        item = {
            "objectID": int(row["objectID"]),
            "predicted_probability": float(row["predicted_probability"]),
            "met_url": f"https://www.metmuseum.org/art/collection/search/{int(row['objectID'])}",
        }
        
        # Add available metadata
        for col in ["title", "department", "culture", "medium", "classification",
                    "objectBeginDate", "objectEndDate", "objectName"]:
            if col in row and pd.notna(row[col]):
                item[col] = str(row[col]) if isinstance(row[col], (str, np.str_)) else float(row[col])
        
        underrated_items.append(item)
    
    # Save
    data = {
        "last_updated": datetime.now().isoformat(),
        "count": len(underrated_items),
        "items": underrated_items
    }
    
    output_file = output_dir / "underrated_items.json"
    with open(output_file, "w") as f:
        json.dump(data, f, indent=2)
    
    print(f"   ✓ Saved {len(underrated_items)} underrated items to {output_file}")


def generate_analysis_stats(
    test_metadata: pd.DataFrame,
    output_dir: Path
) -> None:
    """
    Generate statistics for data visualizations/dashboards.
    
    What this does:
    Creates aggregated data for charts showing:
    - Distribution by department (which departments have more items on view)
    - Distribution by century (time period analysis)
    - Error analysis (false positives, false negatives, accuracy)
    
    Saves to analysis_stats.json for charts/graphs on the website.
    """
    print("\n2. Generating analysis statistics...")
    
    # Overall distribution
    on_view_count = int((test_metadata["actual_label"] == 1).sum())
    not_on_view_count = int((test_metadata["actual_label"] == 0).sum())
    
    stats = {
        "last_updated": datetime.now().isoformat(),
        "total_items": len(test_metadata),
        "accuracy": float((test_metadata["predicted_class"] == test_metadata["actual_label"]).mean()),
        "distribution": {
            "on_view": on_view_count,
            "not_on_view": not_on_view_count,
            "on_view_percentage": float(on_view_count / len(test_metadata) * 100),
            "not_on_view_percentage": float(not_on_view_count / len(test_metadata) * 100)
        }
    }
    
    # Department distribution
    if "department" in test_metadata.columns:
        dept_stats = test_metadata.groupby("department").agg({
            "actual_label": ["count", "mean"],
            "predicted_probability": "mean"
        }).reset_index()
        
        dept_stats.columns = ["department", "count", "on_view_rate", "avg_prediction"]
        stats["by_department"] = dept_stats.to_dict("records")
    
    # Date range distribution
    if "objectBeginDate" in test_metadata.columns:
        # Create century bins
        test_metadata["century"] = (test_metadata["objectBeginDate"] // 100) * 100
        century_stats = test_metadata.groupby("century").agg({
            "actual_label": ["count", "mean"]
        }).reset_index()
        century_stats.columns = ["century", "count", "on_view_rate"]
        stats["by_century"] = century_stats.to_dict("records")
    
    # Error analysis
    correct = (test_metadata["predicted_class"] == test_metadata["actual_label"]).sum()
    false_positives = ((test_metadata["predicted_class"] == 1) & (test_metadata["actual_label"] == 0)).sum()
    false_negatives = ((test_metadata["predicted_class"] == 0) & (test_metadata["actual_label"] == 1)).sum()
    
    stats["errors"] = {
        "correct": int(correct),
        "false_positives": int(false_positives),
        "false_negatives": int(false_negatives),
        "error_rate": float(1 - correct / len(test_metadata))
    }
    
    # Save
    output_file = output_dir / "analysis_stats.json"
    with open(output_file, "w") as f:
        json.dump(stats, f, indent=2)
    
    print(f"   ✓ Saved analysis statistics to {output_file}")


def generate_feature_ranges(
    metadata_df: pd.DataFrame,
    full_metadata_df: pd.DataFrame,
    output_dir: Path
) -> None:
    """
    Generate valid ranges for the prediction form.
    
    What this does:
    Extracts min/max values for numeric fields (dates, years) and
    lists of valid options for dropdowns (departments, cultures, mediums).
    
    Used for form validation on the website - ensures users enter valid data.
    Saves to feature_ranges.json.
    """
    print("\n3. Generating feature ranges...")
    
    ranges = {}
    
    # Numeric features
    for col in ["objectBeginDate", "objectEndDate", "accessionYear"]:
        if col in metadata_df.columns:
            ranges[col] = {
                "min": float(metadata_df[col].min()),
                "max": float(metadata_df[col].max()),
                "median": float(metadata_df[col].median())
            }
    
    # Categorical features
    if full_metadata_df is not None:
        for col in ["department", "classification", "culture", "medium"]:
            if col in full_metadata_df.columns:
                values = full_metadata_df[col].dropna().unique().tolist()
                ranges[col] = sorted([str(v) for v in values[:100]])  # Limit to top 100
    
    # Save
    output_file = output_dir / "feature_ranges.json"
    with open(output_file, "w") as f:
        json.dump(ranges, f, indent=2)
    
    print(f"   ✓ Saved feature ranges to {output_file}")


def generate_model_metadata(
    model: CatBoostClassifier,
    feature_columns: List[str],
    test_metadata: pd.DataFrame,
    output_dir: Path
) -> None:
    """
    Generate information about the model itself.
    
    What this does:
    Exports model info for display on the website:
    - Model version and type (CatBoost)
    - Accuracy on test data
    - Top 30 most important features (what the model relies on most)
    - Last update timestamp
    
    Saves to model_metadata.json for the "About" section.
    """
    print("\n4. Generating model metadata...")
    
    from sklearn.metrics import precision_score, recall_score, f1_score, roc_auc_score
    
    # Calculate metrics
    y_true = test_metadata["actual_label"]
    y_pred = test_metadata["predicted_class"]
    y_proba = test_metadata["predicted_probability"]
    
    # Feature importance
    feature_importance = model.get_feature_importance()
    top_features = sorted(
        zip(feature_columns, feature_importance),
        key=lambda x: x[1],
        reverse=True
    )[:30]
    
    metadata = {
        "version": "1.0",
        "last_updated": datetime.now().isoformat(),
        "model_type": "CatBoost Classifier",
        "num_features": len(feature_columns),
        "metrics": {
            "accuracy": float((y_true == y_pred).mean()),
            "precision": float(precision_score(y_true, y_pred, zero_division=0)),
            "recall": float(recall_score(y_true, y_pred, zero_division=0)),
            "f1_score": float(f1_score(y_true, y_pred, zero_division=0)),
            "auc": float(roc_auc_score(y_true, y_proba) if len(set(y_true)) > 1 else 0.0)
        },
        "top_features": [
            {"name": name, "importance": float(imp)}
            for name, imp in top_features
        ]
    }
    
    # Save
    output_file = output_dir / "model_metadata.json"
    with open(output_file, "w") as f:
        json.dump(metadata, f, indent=2)
    
    print(f"   ✓ Saved model metadata to {output_file}")


def main() -> None:
    """Main execution."""
    print("=" * 70)
    print("GENERATING WEBSITE DATA")
    print("=" * 70)
    
    # Create output directory
    output_dir = Path(CONFIG["output_dir"])
    output_dir.mkdir(parents=True, exist_ok=True)
    
    # Load model and data (uses existing splits, no new splitting)
    model = load_model()
    X_all, y_all, X_test, y_test, feature_columns, metadata_df, full_metadata_df = load_data()
    
    # Process features
    X_all_processed, feature_columns_processed = apply_feature_drop(X_all, feature_columns)
    X_test_processed, _ = apply_feature_drop(X_test, feature_columns)
    
    # Generate predictions on all data and test data
    all_metadata, test_metadata = generate_all_predictions(
        model, X_all_processed, y_all, X_test_processed, y_test, 
        metadata_df, full_metadata_df
    )
    
    # Generate data files for website
    generate_underrated_items(all_metadata, output_dir)  # Check ALL data
    generate_analysis_stats(test_metadata, output_dir)    # Metrics from test set only
    generate_feature_ranges(metadata_df, full_metadata_df, output_dir)
    generate_model_metadata(model, feature_columns_processed, test_metadata, output_dir)
    
    print("\n" + "=" * 70)
    print("✓ ALL DATA GENERATED SUCCESSFULLY")
    print(f"✓ Output directory: {output_dir.absolute()}")
    print("=" * 70)
    print("\nGenerated files:")
    for file in output_dir.glob("*.json"):
        size = file.stat().st_size / 1024  # KB
        print(f"  - {file.name} ({size:.1f} KB)")


if __name__ == "__main__":
    main()

