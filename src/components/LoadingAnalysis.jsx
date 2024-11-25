import { useState, useEffect } from 'react';
import { 
  Brain, Target, BarChart2, Shield, Zap, Search, 
  Database, Cpu, Globe 
} from 'lucide-react';
import { colors } from '../utils/theme';

const ParticleEffect = () => (
  <div className="absolute inset-0 overflow-hidden">
    {[...Array(30)].map((_, i) => (
      <div
        key={i}
        className="particle absolute rounded-full"
        style={{
          width: Math.random() * 3 + 1 + 'px',
          height: Math.random() * 3 + 1 + 'px',
          backgroundColor: 'white',
          left: Math.random() * 100 + '%',
          top: Math.random() * 100 + '%',
          opacity: Math.random() * 0.3,
          animation: `float ${Math.random() * 10 + 5}s linear infinite`,
          animationDelay: `-${Math.random() * 10}s`
        }}
      />
    ))}
  </div>
);

export const LoadingAnalysis = ({ file, progress }) => {
  const [displayProgress, setDisplayProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState(0);

  const stages = [
    { 
      icon: Search,
      label: 'Analyzing Website Content',
      sublabel: 'Scanning pages and structure'
    },
    { 
      icon: Database,
      label: 'Processing Data',
      sublabel: 'Extracting key information'
    },
    { 
      icon: Brain,
      label: 'AI Analysis',
      sublabel: 'Understanding business model'
    },
    { 
      icon: Target,
      label: 'Market Analysis',
      sublabel: 'Evaluating competitive position'
    },
    { 
      icon: BarChart2,
      label: 'Growth Score',
      sublabel: 'Calculating performance metrics'
    },
    { 
      icon: Shield,
      label: 'Final Review',
      sublabel: 'Preparing your report'
    }
  ];

  useEffect(() => {
    // Ensure minimum 5 second loading time
    const duration = 5000; // 5 seconds
    const startTime = Date.now();
    const startProgress = displayProgress;
    const endProgress = progress;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const nextProgress = Math.min(
        startProgress + ((endProgress - startProgress) * elapsed) / duration,
        endProgress
      );

      setDisplayProgress(nextProgress);

      if (elapsed < duration && nextProgress < endProgress) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }, [progress]);

  useEffect(() => {
    if (displayProgress <= 20) setCurrentStage(0);
    else if (displayProgress <= 40) setCurrentStage(1);
    else if (displayProgress <= 60) setCurrentStage(2);
    else if (displayProgress <= 75) setCurrentStage(3);
    else if (displayProgress <= 90) setCurrentStage(4);
    else setCurrentStage(5);
  }, [displayProgress]);

  return (
    <div className="relative max-w-4xl mx-auto">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-blue-600/10 to-transparent rounded-3xl blur-3xl -z-10" />
      <ParticleEffect />

      <div 
        className="rounded-3xl p-12 backdrop-blur-xl border border-white/10 relative overflow-hidden"
        style={{ 
          backgroundColor: 'rgba(23, 25, 35, 0.8)',
          boxShadow: '0 0 80px rgba(147, 51, 234, 0.1)'
        }}
      >
        <div className="max-w-3xl mx-auto">
          {/* Progress Ring */}
          <div className="relative w-40 h-40 mx-auto mb-12 group">
            <svg className="w-full h-full transform -rotate-90 group-hover:scale-105 transition-transform duration-500">
              <circle
                cx="80"
                cy="80"
                r="74"
                stroke="currentColor"
                strokeWidth="4"
                fill="transparent"
                className="text-gray-800"
              />
              <circle
                cx="80"
                cy="80"
                r="74"
                stroke="url(#progress-gradient)"
                strokeWidth="6"
                fill="transparent"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 74}
                strokeDashoffset={2 * Math.PI * 74 * (1 - displayProgress / 100)}
                className="transition-all duration-700 ease-in-out"
              />
              <defs>
                <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#9333EA" />
                  <stop offset="100%" stopColor="#3B82F6" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <div className="text-4xl font-bold text-white mb-1">
                {Math.round(displayProgress)}%
              </div>
              <div className="text-sm text-gray-400">Processing</div>
            </div>
          </div>

          {/* Website Info */}
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-white mb-3">Analyzing Your Website</h3>
            <div className="flex items-center justify-center gap-2 text-gray-400 bg-white/5 px-4 py-2 rounded-xl inline-flex">
              <Globe className="w-4 h-4" />
              <span>{file.name}</span>
            </div>
          </div>

          {/* Analysis Stages */}
          <div className="grid gap-4">
            {stages.map((stage, index) => {
              const isActive = index === currentStage;
              const isComplete = index < currentStage;
              const Icon = stage.icon;

              return (
                <div 
                  key={index}
                  className={`relative rounded-xl transition-all duration-500 hover:scale-[1.02] ${
                    isActive ? 'bg-white/5 shadow-lg' : ''
                  }`}
                >
                  <div 
                    className="relative flex items-center gap-4 p-4"
                    style={{
                      background: isActive ? 'linear-gradient(90deg, rgba(147, 51, 234, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)' : ''
                    }}
                  >
                    <div 
                      className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 ${
                        isComplete 
                          ? 'bg-green-500/20' 
                          : isActive 
                            ? 'bg-purple-600/20' 
                            : 'bg-gray-800/50'
                      }`}
                    >
                      <Icon 
                        className={`w-6 h-6 transition-colors duration-500 ${
                          isComplete 
                            ? 'text-green-500' 
                            : isActive 
                              ? 'text-purple-400' 
                              : 'text-gray-500'
                        } ${isActive ? 'animate-pulse' : ''}`}
                      />
                    </div>
                    
                    <div className="flex-1">
                      <div className={`font-medium transition-colors duration-500 ${
                        isComplete 
                          ? 'text-green-500' 
                          : isActive 
                            ? 'text-white' 
                            : 'text-gray-500'
                      }`}>
                        {stage.label}
                      </div>
                      <div className="text-sm text-gray-500">
                        {stage.sublabel}
                      </div>
                    </div>

                    {isComplete && (
                      <div className="flex items-center gap-2 text-green-500">
                        <Zap className="w-5 h-5" />
                        <span className="text-sm">Complete</span>
                      </div>
                    )}

                    {isActive && (
                      <div className="flex items-center gap-2 text-purple-400">
                        <Cpu className="w-5 h-5 animate-pulse" />
                        <span className="text-sm">Processing</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};