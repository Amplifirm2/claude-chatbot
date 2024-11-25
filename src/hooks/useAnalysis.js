import { useState } from 'react'

export const useAnalysis = () => {
  const [file, setFile] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState(null)
  const [error, setError] = useState(null)
  const [analysisProgress, setAnalysisProgress] = useState(0)

  const analyzeDocument = async (document) => {
    setIsAnalyzing(true)
    setAnalysis(null)
    setAnalysisProgress(0)

    try {
      const formData = new FormData()
      formData.append('document', document)

      // Simulate progress
      const progressInterval = setInterval(() => {
        setAnalysisProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + Math.random() * 20
        })
      }, 500)

      const response = await fetch('http://localhost:3000/analyze', {
        method: 'POST',
        body: formData
      })

      clearInterval(progressInterval)
      setAnalysisProgress(100)

      const result = await response.json()
      
      setTimeout(() => {
        setAnalysis(result.analysis)
        setIsAnalyzing(false)
      }, 500)

    } catch (err) {
      setError('Error analyzing document. Please try again.')
      setIsAnalyzing(false)
    }
  }

  const resetAnalysis = () => {
    setFile(null)
    setAnalysis(null)
    setError(null)
    setAnalysisProgress(0)
  }

  return {
    file,
    setFile,
    isAnalyzing,
    analysis,
    error,
    analysisProgress,
    analyzeDocument,
    resetAnalysis
  }
}