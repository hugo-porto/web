/**
 * Prediction utilities for the website
 * Implements similarity-based prediction matching
 */

/**
 * Calculate similarity between user input and an existing item
 * @param {Object} userInput - User's form input
 * @param {Object} item - Existing item from predictions sample
 * @returns {number} - Similarity score (0-1)
 */
export function calculateSimilarity(userInput, item) {
  let score = 0;
  
  // Department match (30% weight)
  if (userInput.department && userInput.department === item.department) {
    score += 0.3;
  }
  
  // Date proximity (20% weight)
  if (userInput.objectBeginDate && item.objectBeginDate) {
    const dateDiff = Math.abs(userInput.objectBeginDate - item.objectBeginDate);
    // Closer dates = higher score, max 2000 years difference for full points
    score += Math.max(0, 0.2 * (1 - dateDiff / 2000));
  }
  
  // Classification match (15% weight)
  if (userInput.classification && userInput.classification === item.classification) {
    score += 0.15;
  }
  
  // Medium match (15% weight)
  if (userInput.medium && userInput.medium === item.medium) {
    score += 0.15;
  }
  
  // Culture match (10% weight)
  if (userInput.culture && userInput.culture === item.culture) {
    score += 0.1;
  }
  
  // Object name similarity (10% weight)
  if (userInput.objectName && item.objectName) {
    const nameSimilarity = stringSimilarity(
      userInput.objectName.toLowerCase(),
      item.objectName.toLowerCase()
    );
    score += 0.1 * nameSimilarity;
  }
  
  return score;
}

/**
 * Calculate string similarity (simple Jaccard similarity)
 * @param {string} str1
 * @param {string} str2
 * @returns {number} - Similarity (0-1)
 */
function stringSimilarity(str1, str2) {
  const words1 = new Set(str1.split(/\s+/));
  const words2 = new Set(str2.split(/\s+/));
  
  const intersection = new Set([...words1].filter(x => words2.has(x)));
  const union = new Set([...words1, ...words2]);
  
  return intersection.size / union.size;
}

/**
 * Predict based on user input using similarity matching
 * @param {Object} userInput - User's form input
 * @param {Array} sampleItems - Array of sample items with predictions
 * @param {number} topK - Number of similar items to use (default: 5)
 * @returns {Object} - Prediction results
 */
export function predictFromUserInput(userInput, sampleItems, topK = 5) {
  // Calculate similarity scores for all items
  const similarities = sampleItems.map(item => ({
    item: item,
    similarity: calculateSimilarity(userInput, item)
  }));
  
  // Sort by similarity and take top K
  const topMatches = similarities
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, topK);
  
  // Check if we have good matches
  const avgSimilarity = topMatches.reduce((sum, m) => sum + m.similarity, 0) / topMatches.length;
  
  if (avgSimilarity < 0.1) {
    // Very poor matches, return uncertain prediction
    return {
      probability: 0.5,
      prediction: "uncertain",
      confidence: "low",
      message: "Not enough similar items found. Prediction may be unreliable.",
      similarItems: []
    };
  }
  
  // Calculate weighted average of predictions
  const totalWeight = topMatches.reduce((sum, m) => sum + m.similarity, 0);
  const weightedProb = topMatches.reduce(
    (sum, m) => sum + m.item.predicted_probability * m.similarity,
    0
  ) / totalWeight;
  
  // Determine confidence level
  let confidence;
  if (avgSimilarity > 0.5) confidence = "high";
  else if (avgSimilarity > 0.3) confidence = "medium";
  else confidence = "low";
  
  return {
    probability: weightedProb,
    prediction: weightedProb > 0.5 ? "on-view" : "not-on-view",
    confidence: confidence,
    message: `Prediction based on ${topK} similar items (avg similarity: ${(avgSimilarity * 100).toFixed(1)}%)`,
    similarItems: topMatches.map(m => ({
      title: m.item.title || "Unknown",
      department: m.item.department || "Unknown",
      similarity: (m.similarity * 100).toFixed(1) + "%",
      probability: (m.item.predicted_probability * 100).toFixed(1) + "%"
    }))
  };
}

/**
 * Load predictions sample from JSON file
 * @param {string} url - URL to predictions_sample.json
 * @returns {Promise<Array>} - Array of sample items
 */
export async function loadPredictionsSample(url = "/data/predictions_sample.json") {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to load predictions sample: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error loading predictions sample:", error);
    throw error;
  }
}

/**
 * Validate user input before prediction
 * @param {Object} userInput - User's form input
 * @param {Object} featureRanges - Feature ranges from feature_ranges.json
 * @returns {Object} - Validation result
 */
export function validateUserInput(userInput, featureRanges) {
  const errors = [];
  
  // Check required fields
  if (!userInput.department) {
    errors.push("Department is required");
  }
  
  // Validate date ranges
  if (userInput.objectBeginDate) {
    const date = parseInt(userInput.objectBeginDate);
    if (isNaN(date)) {
      errors.push("Object Begin Date must be a number");
    } else if (featureRanges.objectBeginDate) {
      const { min, max } = featureRanges.objectBeginDate;
      if (date < min || date > max) {
        errors.push(`Object Begin Date must be between ${min} and ${max}`);
      }
    }
  }
  
  if (userInput.objectEndDate) {
    const date = parseInt(userInput.objectEndDate);
    if (isNaN(date)) {
      errors.push("Object End Date must be a number");
    } else if (featureRanges.objectEndDate) {
      const { min, max } = featureRanges.objectEndDate;
      if (date < min || date > max) {
        errors.push(`Object End Date must be between ${min} and ${max}`);
      }
    }
  }
  
  // Check if end date is after begin date
  if (userInput.objectBeginDate && userInput.objectEndDate) {
    if (parseInt(userInput.objectEndDate) < parseInt(userInput.objectBeginDate)) {
      errors.push("Object End Date must be after Begin Date");
    }
  }
  
  return {
    valid: errors.length === 0,
    errors: errors
  };
}

