/**
 * Ensures a value is a string suitable for ReactMarkdown.
 * Handles arrays, objects, and null/undefined gracefully.
 */
export const ensureString = (value) => {
  if (typeof value === 'string') {
    return value;
  }
  
  if (value === null || value === undefined) {
    return '';
  }

  if (Array.isArray(value)) {
    return value
      .map(item => (typeof item === 'object' ? JSON.stringify(item) : String(item)))
      .join('\n');
  }

  if (typeof value === 'object') {
    try {
      return JSON.stringify(value, null, 2);
    } catch (e) {
      return String(value);
    }
  }

  return String(value);
};

/**
 * Normalizes common AI artifacts in strings before rendering.
 */
export const cleanMarkdown = (text) => {
  if (!text) return '';
  let cleaned = ensureString(text);
  
  // Remove redundant punctuation artifacts
  cleaned = cleaned.replace(/\.{4,}/g, '...');
  cleaned = cleaned.replace(/[,\.]{2,}/g, '.');
  
  return cleaned;
};
