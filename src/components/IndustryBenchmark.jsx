import React from 'react';
import { TrendingUp, Trophy, Info } from 'lucide-react';
import { colors } from '../utils/theme';

const IndustryBenchmark = ({ analysis, industryData }) => {
  const calculateTopPercentage = (score, industryAvg) => {
    return Math.max(1, Math.min(99, Math.round(100 - ((score - industryAvg) / industryAvg) * 100)));
  };

  return (
    <div className="relative">
      {/* Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />
      
      {/* Main Container */}
      <div className="relative rounded-xl p-8 overflow-hidden backdrop-blur-lg border border-white/10 shadow-2xl"
        style={{ 
          background: `linear-gradient(145deg, ${colors.cardBg}, rgba(23, 25, 35, 0.9))`,
        }}>
        
        {/* Glow Effect */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600/20 to-blue-600/20 blur-2xl" />
        
        {/* Content Container */}
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-medium text-white flex items-center gap-2">
                <TrendingUp className="w-6 h-6 animate-pulse" style={{ color: colors.primary }} />
                Industry Comparison
              </h3>
              <p className="text-gray-400 mt-2">
                Compared to {industryData.valueProposition.totalCompanies.toLocaleString()} companies
              </p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg px-4 py-2 text-sm text-gray-300 border border-white/5 shadow-lg">
              Updated Today
            </div>
          </div>
          
          <div className="space-y-6">
            {Object.entries(analysis.criteria).map(([key, data]) => {
              const industryAvg = industryData[key].average;
              const performance = data.score - industryAvg;
              const isTopPerformer = data.score > industryData[key].topPerformers;
              return (
                <div 
                  key={key}
                  className="p-6 rounded-xl backdrop-blur-sm border border-white/5 transition-all duration-300 hover:border-white/10"
                  style={{ backgroundColor: colors.accent }}
                >
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <div className="text-white font-medium mb-1">{key}</div>
                      <div className="text-sm text-gray-400">Industry Average: {industryAvg.toFixed(1)}/10</div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold" style={{ color: colors.primary }}>
                        {data.score.toFixed(1)}/10
                      </div>
                      <div className={`text-sm flex items-center gap-1 ${
                        performance >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {performance >= 0 ? '+' : ''}{performance.toFixed(1)} points
                      </div>
                    </div>
                  </div>
                  <div className="relative h-2">
                    <div 
                      className="absolute inset-y-0 left-0 bg-gray-700 rounded-full"
                      style={{ width: `${industryAvg * 10}%` }}
                    />
                    <div 
                      className="absolute inset-y-0 left-0 rounded-full transition-all duration-1000"
                      style={{ 
                        width: `${data.score * 10}%`,
                        background: colors.gradient
                      }}
                    />
                  </div>
                  {isTopPerformer && (
                    <div className="mt-3 flex items-center gap-2 text-yellow-400 text-sm">
                      <Trophy className="w-4 h-4" />
                      <span>Top {calculateTopPercentage(data.score, industryAvg)}% of companies</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndustryBenchmark;