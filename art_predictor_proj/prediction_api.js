/**
 * API-based prediction with k-NN fallback
 * Uses Google Cloud Run hosted model for real predictions
 */

// Configuration
const API_URL = "https://your-service-url.run.app";  // Update after deployment
const API_TIMEOUT = 5000; // 5 seconds

/**
 * Make a prediction using the Cloud Run API
 * @param {Object} formData - User input from the form
 * @returns {Promise<Object>} - Prediction result
 */
export async function predictWithAPI(formData) {
  // Build text description from form fields
  const textParts = [];
  
  if (formData.medium) textParts.push(formData.medium);
  if (formData.classification) textParts.push(formData.classification);
  if (formData.culture) textParts.push(`from ${formData.culture} culture`);
  if (formData.objectBeginDate && formData.objectEndDate) {
    textParts.push(`dated ${formData.objectBeginDate}-${formData.objectEndDate}`);
  }
  if (formData.department) textParts.push(`in ${formData.department} department`);
  
  const text = textParts.join(", ");
  
  const requestBody = {
    text: text || "artwork",
    department: formData.department,
    objectBeginDate: formData.objectBeginDate ? parseInt(formData.objectBeginDate) : null,
    objectEndDate: formData.objectEndDate ? parseInt(formData.objectEndDate) : null,
    classification: formData.classification || null,
    culture: formData.culture || null,
    medium: formData.medium || null,
  };
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);
    
    const response = await fetch(`${API_URL}/predict`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const result = await response.json();
    
    return {
      probability: result.probability,
      prediction: result.prediction,
      confidence: result.confidence,
      explanation: result.explanation,
      method: "api",
      source: "Cloud Run API (Real Model)",
    };
    
  } catch (error) {
    console.error("API prediction failed:", error);
    throw error;
  }
}

/**
 * Main prediction function with fallback
 * Tries API first, falls back to k-NN if API fails
 * @param {Object} formData - User input from the form
 * @param {Array} sampleItems - Sample items for k-NN fallback (optional)
 * @returns {Promise<Object>} - Prediction result
 */
export async function predict(formData, sampleItems = null) {
  try {
    // Try API prediction first
    const result = await predictWithAPI(formData);
    return result;
    
  } catch (error) {
    console.warn("API prediction failed, falling back to k-NN...");
    
    // Fallback to k-NN if sample items are available
    if (sampleItems && sampleItems.length > 0) {
      // Import k-NN prediction function
      const { predictFromUserInput } = await import('./prediction.js');
      const knnResult = predictFromUserInput(formData, sampleItems, 5);
      
      return {
        ...knnResult,
        method: "knn",
        source: "k-Nearest Neighbors (Fallback)",
        warning: "API unavailable, using similarity-based prediction",
      };
    }
    
    // No fallback available
    throw new Error("Prediction failed and no fallback available");
  }
}

/**
 * Check API health status
 * @returns {Promise<boolean>} - True if API is healthy
 */
export async function checkAPIHealth() {
  try {
    const response = await fetch(`${API_URL}/health`, {
      method: "GET",
      signal: AbortSignal.timeout(3000),
    });
    
    return response.ok;
  } catch (error) {
    return false;
  }
}

/**
 * Batch prediction (for testing or bulk processing)
 * @param {Array<Object>} items - Array of form data objects
 * @returns {Promise<Array>} - Array of prediction results
 */
export async function predictBatch(items) {
  if (!items || items.length === 0) {
    throw new Error("No items to predict");
  }
  
  if (items.length > 100) {
    throw new Error("Maximum 100 items per batch");
  }
  
  const requests = items.map(item => {
    const textParts = [];
    if (item.medium) textParts.push(item.medium);
    if (item.classification) textParts.push(item.classification);
    
    return {
      text: textParts.join(", ") || "artwork",
      department: item.department,
      objectBeginDate: item.objectBeginDate ? parseInt(item.objectBeginDate) : null,
      objectEndDate: item.objectEndDate ? parseInt(item.objectEndDate) : null,
      classification: item.classification || null,
      culture: item.culture || null,
      medium: item.medium || null,
    };
  });
  
  try {
    const response = await fetch(`${API_URL}/predict/batch`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requests),
    });
    
    if (!response.ok) {
      throw new Error(`Batch API error: ${response.status}`);
    }
    
    const result = await response.json();
    return result.predictions;
    
  } catch (error) {
    console.error("Batch prediction failed:", error);
    throw error;
  }
}

/**
 * Configure API URL (call this in your app initialization)
 * @param {string} url - Your Cloud Run service URL
 */
export function configureAPI(url) {
  API_URL = url;
}

