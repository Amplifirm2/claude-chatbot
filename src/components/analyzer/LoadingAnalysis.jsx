import { useState, useEffect } from 'react';
import { 
  Brain, Target, BarChart2, Shield, Zap, Search, 
  Database, Cpu, Globe 
} from 'lucide-react';
import { colors } from '../utils/theme';

// Add this to your CSS/styles file
const styles = `
  @keyframes float {
    from { transform: translateY(0) translateX(0); }
    to { transform: translateY(-100vh) translateX(50px); }
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }

  .loading-page {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 50;
    background-color: rgb(23, 25, 35);
  }

  .particle {
    pointer-events: none;
  }
`;

const ParticleEffect = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
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

export const LoadingAnalysis = ({ file, progress, onComplete }) => {
  const [displayProgress, setDisplayProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState(0);
  const [showLoading, setShowLoading] = useState(true);

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
    // Add styles to document
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
    return () => styleSheet.remove();
  }, []);

  useEffect(() => {
    const startTime = Date.now();
    const minDuration = 5000; // 5 seconds minimum
    let animationFrame;

    const animateProgress = () => {
      const elapsed = Date.now() - startTime;
      const progressPercent = Math.min((elapsed / minDuration) * 100, progress);
      
      if (elapsed < minDuration || progressPercent < progress) {
        setDisplayProgress(progressPercent);
        animationFrame = requestAnimationFrame(animateProgress);
      } else {
        setDisplayProgress(progress);
        if (progress >= 100) {
          setTimeout(() => {
            setShowLoading(false);
            if (onComplete) onComplete();
          }, 500);
        }
      }
    };

    animationFrame = requestAnimationFrame(animateProgress);
    return () => cancelAnimationFrame(animationFrame);
  }, [progress, onComplete]);

  useEffect(() => {
    if (displayProgress <= 20) setCurrentStage(0);
    else if (displayProgress <= 40) setCurrentStage(1);
    else if (displayProgress <= 60) setCurrentStage(2);
    else if (displayProgress <= 75) setCurrentStage(3);
    else if (displayProgress <= 90) setCurrentStage(4);
    else setCurrentStage(5);
  }, [displayProgress]);

  if (!showLoading) return null;

  return (
    <div className="loading-page">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-blue-600/5 to-transparent" />
      <ParticleEffect />
      
      <div className="relative h-full flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
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
                <svg className="w-full h-full transform -rotate-90 transition-transform duration-500">
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
                      className={`relative rounded-xl transition-all duration-500 ${
                        isActive ? 'bg-white/5 shadow-lg scale-[1.02]' : ''
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
      </div>
    </div>
  );
};