// Safe JSON wrapper around localStorage

export function saveProgress(key: string, data: any) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error("saveProgress error:", err);
  }
}

export function loadProgress(key: string) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    console.error("loadProgress error:", err);
    return null;
  }
}

// Helper: load multiple previous weeks for suggestions
export function searchHistory(exerciseName: string) {
  const results: any[] = [];

  try {
    Object.keys(localStorage).forEach((k) => {
      if (k.includes(exerciseName)) {
        const entry = localStorage.getItem(k);
        if (!entry) return;
        results.push(JSON.parse(entry));
      }
    });

    return results;
  } catch (err) {
    console.error("searchHistory error:", err);
    return [];
  }
}
