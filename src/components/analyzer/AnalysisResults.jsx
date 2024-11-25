import { TrendingUp, ChevronRight, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { colors } from '../utils/theme';

const ScoreCard = ({ title, data, index }) => {
  const points = data.points || [];

  return (
    <motion.div 
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ 
        duration: 0.5,
        delay: index * 0.1 // Stagger effect
      }}
      className="p-6 rounded-xl backdrop-blur-sm transition-all duration-500 transform hover:scale-[1.02] border border-white/5 relative overflow-hidden group"
      style={{ 
        backgroundColor: 'rgba(23, 25, 35, 0.7)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
      }}
    >
      {/* Gradient Orb Background */}
      <div 
        className="absolute top-0 right-0 w-32 h-32 opacity-0 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(255, 113, 113, 0.2), transparent 70%)',
          transform: 'translate(30%, -30%)'
        }}
      />

      <div className="flex justify-between items-start mb-4">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: index * 0.1 + 0.2, duration: 0.5 }}
        >
          <h4 className="text-lg font-medium text-white relative inline-block">
            {title}
            <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#ff7171] to-transparent 
                          group-hover:w-full transition-all duration-300" />
          </h4>
        </motion.div>
        <motion.div 
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: index * 0.1 + 0.2, duration: 0.5 }}
          className="text-3xl font-bold relative"
          style={{ color: colors.primary }}
        >
          {typeof data.score === 'number' ? data.score.toFixed(1) : '0.0'}
          <span className="text-lg text-gray-500">/10</span>
        </motion.div>
      </div>

      {/* Progress Bar */}
      <div className="relative h-2 bg-gray-800 rounded-full overflow-hidden mb-4">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${(typeof data.score === 'number' ? data.score : 0) * 10}%` }}
          transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
          className="absolute h-full rounded-full"
          style={{ background: colors.gradient }}
        >
          {/* Shimmer Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent 
                        animate-shimmer" />
        </motion.div>
      </div>
      
      {/* Key Points */}
      <div className="space-y-2 mt-4">
        {points.length > 0 ? (
          points.map((point, pIndex) => (
            <motion.div 
              key={pIndex}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ 
                duration: 0.5,
                delay: index * 0.1 + 0.4 + (pIndex * 0.1)
              }}
              className="flex items-start gap-2 text-sm group/point"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ 
                  duration: 0.3,
                  delay: index * 0.1 + 0.4 + (pIndex * 0.1)
                }}
              >
                <CheckCircle2 
                  className="w-4 h-4 mt-0.5 shrink-0 transition-transform duration-300 group-hover/point:scale-110" 
                  style={{ color: colors.primary }} 
                />
              </motion.div>
              <span className="text-gray-300 group-hover/point:text-white transition-colors duration-300">
                {point}
              </span>
            </motion.div>
          ))
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.1 + 0.4 }}
            className="text-gray-500 text-sm italic"
          >
            No analysis points available
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export const AnalysisResults = ({ analysis, file }) => {
  if (!analysis || !analysis.criteria) {
    return (
      <div className="text-center text-gray-400 py-12">
        No analysis data available
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Header */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="rounded-xl p-8 relative overflow-hidden"
        style={{
          backgroundColor: 'rgba(23, 25, 35, 0.7)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        }}
      >
        {/* Gradient Orb Background Effect */}
        <div 
          className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 0% 0%, rgba(255, 113, 113, 0.1), transparent 40%)',
          }}
        />

        <div className="relative flex items-center justify-between mb-6">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold relative">
              <span className="bg-gradient-to-r from-white via-white to-gray-400 bg-clip-text text-transparent 
                            animate-gradient-x">
                Analysis Results
              </span>
              <div className="absolute -bottom-1 left-0 w-1/3 h-0.5 bg-gradient-to-r from-[#ff7171] to-transparent" />
            </h2>
            
            <motion.div 
              className="flex items-center gap-2 text-gray-400 mt-3"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <ChevronRight className="w-4 h-4" />
              <span className="text-sm font-medium">{file.name}</span>
              <span className="text-gray-600">•</span>
              <span className="text-sm text-gray-500">{new Date().toLocaleString()}</span>
            </motion.div>
          </motion.div>

          <motion.div 
            className="relative group"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-[#ff7171] to-[#ff4b4b] rounded-2xl blur-sm 
                          group-hover:blur-md transition-all duration-300" />
            <div className="relative px-6 py-4 rounded-2xl bg-[rgba(23,25,35,0.9)] backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, 0]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                >
                  <TrendingUp className="w-6 h-6 text-[#ff7171]" />
                </motion.div>
                <div>
                  <div className="text-sm text-gray-400">Overall Score</div>
                  <motion.div 
                    className="text-3xl font-bold text-white"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                  >
                    {typeof analysis.overallScore === 'number' ? 
                      analysis.overallScore.toFixed(1) : '0.0'}
                    <span className="text-lg text-gray-500">/10</span>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Score Cards Grid */}
      <div className="grid grid-cols-2 gap-6">
        {Object.entries(analysis.criteria).map(([key, data], index) => (
          <ScoreCard 
            key={key}
            title={key}
            data={data}
            index={index}
          />
        ))}
      </div>
    </motion.div>
  );
};