import { useState } from 'react';
import { 
  Brain, 
  AlertTriangle, 
  Download, 
  ArrowLeft,
  Globe, 
  TrendingUp 
} from 'lucide-react';
import { WebsiteInput } from './components/WebsiteInput.jsx';
import { LoadingAnalysis } from './components/LoadingAnalysis.jsx';
import { AnalysisResults } from './components/AnalysisResults.jsx';
import IndustryBenchmark from './components/IndustryBenchmark.jsx';
import { colors } from './utils/theme';

const industryData = {
  valueProposition: { 
    average: 7.2,
    trend: '+0.3',
    topPerformers: 8.5,
    totalCompanies: 234
  },
  marketFit: { 
    average: 6.8,
    trend: '-0.1',
    topPerformers: 8.2,
    totalCompanies: 234
  },
  competitiveAdvantage: { 
    average: 6.5,
    trend: '+0.2',
    topPerformers: 8.0,
    totalCompanies: 234
  },
  revenueModel: { 
    average: 7.0,
    trend: '+0.4',
    topPerformers: 8.8,
    totalCompanies: 234
  },
  scalability: { 
    average: 6.9,
    trend: '+0.5',
    topPerformers: 8.4,
    totalCompanies: 234
  }
};

const BusinessAnalyzer = () => {
  const [websiteUrl, setWebsiteUrl] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);

  const handleAnalyze = async (url) => {
    setWebsiteUrl(url);
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    setError(null);

    try {
      const response = await fetch('http://localhost:3000/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url })
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      setAnalysisProgress(20);
      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        try {
          const data = JSON.parse(chunk);
          if (data.status === 'scraping') {
            setAnalysisProgress(40);
          } else if (data.status === 'analyzing') {
            setAnalysisProgress(60);
          } else if (data.status === 'completing') {
            setAnalysisProgress(80);
          } else if (data.analysis) {
            setAnalysis(data.analysis);
            setAnalysisProgress(100);
            setTimeout(() => {
              setIsAnalyzing(false);
            }, 500);
          }
        } catch (e) {
          console.log('Progress update:', chunk);
        }
      }
    } catch (err) {
      console.error('Analysis error:', err);
      setError('Error analyzing website. Please try again.');
      setIsAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setWebsiteUrl(null);
    setAnalysis(null);
    setError(null);
    setAnalysisProgress(0);
  };

  const handleExport = () => {
    const exportData = {
      timestamp: new Date().toISOString(),
      websiteUrl: websiteUrl,
      analysis: analysis
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)]);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analysis-${new URL(websiteUrl).hostname}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen pb-24 relative">
      {/* Grid Pattern Background */}
      <div 
        className="fixed inset-0 opacity-10 z-0"
        style={{
          backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
          backgroundColor: colors.background
        }}
      />

      {/* Navigation */}
      <nav 
        className="sticky top-0 z-50 backdrop-blur-md border-b border-white/10"
        style={{ backgroundColor: 'rgba(23, 25, 35, 0.8)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-4">
              <div 
                className="w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br from-purple-600/20 to-blue-600/20 backdrop-blur-xl border border-white/10"
              >
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Business Model Analyzer</h1>
                <p className="text-sm text-gray-400">Powered by Claude AI</p>
              </div>
            </div>
            {websiteUrl && !isAnalyzing && analysis && (
              <button
                onClick={resetAnalysis}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-gray-300 hover:text-white transition-all duration-300 backdrop-blur-sm bg-white/5 border border-white/10"
              >
                <ArrowLeft className="w-4 h-4" />
                Analyze New Website
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {!websiteUrl && !analysis ? (
          <WebsiteInput onAnalyze={handleAnalyze} isLoading={isAnalyzing} />
        ) : isAnalyzing ? (
          <LoadingAnalysis 
            file={{ name: new URL(websiteUrl).hostname }} 
            progress={analysisProgress} 
          />
        ) : analysis ? (
          <div className="space-y-8">
            <AnalysisResults 
              analysis={analysis} 
              file={{ name: new URL(websiteUrl).hostname }} 
            />
            <IndustryBenchmark 
              analysis={analysis} 
              industryData={industryData} 
            />

            <div className="flex justify-center gap-4 mt-12">
              <button
                onClick={handleExport}
                className="flex items-center gap-3 px-8 py-4 rounded-xl text-white transition-all duration-300 hover:scale-105 bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg shadow-purple-500/20"
              >
                <Download className="w-5 h-5" />
                Export Analysis
              </button>
            </div>
          </div>
        ) : null}

        {error && (
          <div className="mt-6 p-6 rounded-xl bg-red-500/10 border border-red-500/20 backdrop-blur-sm text-red-400 flex items-center gap-3">
            <AlertTriangle className="w-6 h-6" />
            {error}
          </div>
        )}
      </div>

      {/* Live Stats Footer */}
      {analysis && (
        <div 
          className="fixed bottom-0 left-0 right-0 py-6 backdrop-blur-xl border-t border-white/10 shadow-2xl"
          style={{ backgroundColor: 'rgba(23, 25, 35, 0.8)' }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-4 gap-8">
              {/* Overall Score */}
              <div className="bg-white/5 rounded-xl p-4 backdrop-blur-sm border border-white/10">
                <div className="text-sm text-gray-400 mb-1">Overall Score</div>
                <div 
                  className="text-3xl font-bold flex items-center gap-2"
                  style={{ color: colors.primary }}
                >
                  <TrendingUp className="w-6 h-6" />
                  {analysis.overallScore}/10
                </div>
              </div>

              {/* Market Position */}
              <div className="bg-white/5 rounded-xl p-4 backdrop-blur-sm border border-white/10">
                <div className="text-sm text-gray-400 mb-1">Market Position</div>
                <div className="text-3xl font-bold text-green-400">
                  Top {(analysis.overallScore / industryData.valueProposition.topPerformers * 100).toFixed(0)}%
                </div>
              </div>

              {/* Growth Potential */}
              <div className="bg-white/5 rounded-xl p-4 backdrop-blur-sm border border-white/10">
                <div className="text-sm text-gray-400 mb-1">Growth Potential</div>
                <div className="text-3xl font-bold text-white">
                  {analysis.overallScore >= 8 ? 'High' : analysis.overallScore >= 6 ? 'Medium' : 'Low'}
                </div>
              </div>

              {/* Risk Assessment */}
              <div className="bg-white/5 rounded-xl p-4 backdrop-blur-sm border border-white/10">
                <div className="text-sm text-gray-400 mb-1">Risk Level</div>
                <div className="text-3xl font-bold text-yellow-400">
                  {analysis.overallScore >= 8 ? 'Low' : analysis.overallScore >= 6 ? 'Medium' : 'High'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessAnalyzer;