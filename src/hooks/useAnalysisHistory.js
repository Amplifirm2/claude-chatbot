import { useState } from 'react';

export const useAnalysisHistory = () => {
  const [history, setHistory] = useState([]);
  
  const addToHistory = (analysis) => {
    setHistory(prev => [{
      id: Date.now(),
      timestamp: new Date().toISOString(),
      analysis
    }, ...prev]);
  };
  
  const compareWithPrevious = (currentAnalysis) => {
    if (history.length === 0) return null;
    const previous = history[0].analysis;
    
    return Object.entries(currentAnalysis.criteria).reduce((acc, [key, data]) => {
      acc[key] = {
        change: data.score - previous.criteria[key].score,
        previousScore: previous.criteria[key].score
      };
      return acc;
    }, {});
  };
  
  return { history, addToHistory, compareWithPrevious };
};