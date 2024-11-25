import { useState, useEffect } from 'react';
import { 
  Globe, 
  ArrowRight, 
  AlertTriangle, 
  Sparkles, 
  Search, 
  Brain, 
  BarChart2, 
  Target,
  Zap,
  FileText,
  PenTool,
  Users,
  Rocket,
  DollarSign 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MINIMUM_CHARS = 100;

export const WebsiteInput = ({ onAnalyze, isLoading }) => {
  const [inputMethod, setInputMethod] = useState('website');
  const [url, setUrl] = useState('');
  const [businessInfo, setBusinessInfo] = useState({
    description: '',
    model: '',
    revenue: '',
    target: '',
    strategy: ''
  });
  const [error, setError] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [activeSections, setActiveSections] = useState([]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputMethod === 'website') {
      try {
        const urlObject = new URL(url);
        if (urlObject.protocol !== 'http:' && urlObject.protocol !== 'https:') {
          throw new Error('Invalid protocol');
        }
        setError(null);
        onAnalyze({ type: 'website', data: url });
      } catch (err) {
        setError('Please enter a valid website URL (e.g., https://example.com)');
      }
    } else {
      const invalidFields = Object.entries(businessInfo)
        .filter(([_, value]) => value.length < MINIMUM_CHARS)
        .map(([key, _]) => key);

      if (invalidFields.length > 0) {
        setError(`Please provide at least ${MINIMUM_CHARS} characters for each field`);
        return;
      }
      setError(null);
      onAnalyze({ type: 'manual', data: businessInfo });
    }
  };

  const getProgressColor = (length) => {
    const progress = Math.min(length / MINIMUM_CHARS, 1);
    if (progress < 0.5) return '#ff4b4b';
    if (progress < 0.8) return '#ffa500';
    return '#00ff00';
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const renderProgressBar = (value, isActive) => {
    const progress = Math.min((value.length / MINIMUM_CHARS) * 100, 100);
    const color = getProgressColor(value.length);
    
    return (
      <motion.div 
        className="relative h-1.5 w-full bg-black/30 rounded-full overflow-hidden mt-2"
        animate={{ opacity: isActive ? 1 : 0.7 }}
      >
        <motion.div
          className="absolute top-0 left-0 h-full rounded-full"
          style={{ 
            background: `linear-gradient(90deg, ${color}, ${color}CC)`,
            boxShadow: isActive ? `0 0 20px ${color}66` : 'none'
          }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>
    );
  };

  const renderInputSection = () => {
    if (inputMethod === 'website') {
      return (
        <motion.div 
          className="relative group"
          whileHover={{ scale: 1.02 }}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
        >
          <motion.div
            className="absolute -inset-0.5 bg-gradient-to-r from-[#ff7171] to-[#ff4b4b] rounded-2xl blur-xl opacity-50"
            animate={{
              opacity: isHovered ? 0.7 : 0.5,
              scale: isHovered ? 1.02 : 1,
            }}
            transition={{ duration: 0.3 }}
          />
          
          <div className="relative flex items-center bg-black/50 backdrop-blur-xl rounded-2xl">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter any company website..."
              className="w-full px-6 py-5 rounded-2xl text-lg text-white bg-transparent border-0 focus:outline-none focus:ring-0 placeholder-gray-500"
            />
            <Search className="absolute right-6 w-5 h-5 text-gray-400" />
          </div>
        </motion.div>
      );
    }
    return (
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {[
          { key: 'description', label: 'Business Description', placeholder: 'Describe your business and its main offerings...', icon: PenTool, color: '#ff7171' },
          { key: 'model', label: 'Business Model', placeholder: 'How does your business make money?', icon: Brain, color: '#7c3aed' },
          { key: 'revenue', label: 'Revenue Streams', placeholder: 'What are your main revenue sources?', icon: DollarSign, color: '#059669' },
          { key: 'target', label: 'Target Market', placeholder: 'Who are your target customers?', icon: Users, color: '#2563eb' },
          { key: 'strategy', label: 'Growth Strategy', placeholder: 'What is your strategy for growth?', icon: Rocket, color: '#9333ea' }
        ].map(({ key, label, placeholder, icon: Icon, color }) => (
          <motion.div
            key={key}
            className="relative group"
            whileHover={{ scale: 1.01 }}
            onHoverStart={() => setFocusedField(key)}
            onHoverEnd={() => setFocusedField(null)}
          >
            <motion.div
              className="absolute -inset-0.5 bg-gradient-to-r from-[#ff7171] to-[#ff4b4b] rounded-xl blur-xl opacity-30 group-hover:opacity-50"
              animate={{
                scale: focusedField === key ? 1.02 : 1,
              }}
              transition={{ duration: 0.3 }}
            />
            <div className="relative bg-black/50 backdrop-blur-xl rounded-xl p-4">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center"
                  >
                    <Icon className="w-4 h-4" style={{ color }} />
                  </motion.div>
                  <label className="block text-sm font-medium text-gray-400">{label}</label>
                </div>
                <motion.span 
                  className={`text-xs ${
                    businessInfo[key].length >= MINIMUM_CHARS ? 'text-green-400' : 'text-gray-500'
                  }`}
                >
                  {businessInfo[key].length}/{MINIMUM_CHARS}
                </motion.span>
              </div>
              <textarea
                value={businessInfo[key]}
                onChange={(e) => setBusinessInfo(prev => ({
                  ...prev,
                  [key]: e.target.value
                }))}
                placeholder={placeholder}
                rows={4}
                className="w-full px-4 py-3 rounded-lg text-white bg-black/30 border border-white/10 focus:border-[#ff7171]/50 focus:outline-none focus:ring-0 placeholder-gray-500 resize-none"
              />
              {renderProgressBar(businessInfo[key], focusedField === key)}
            </div>
          </motion.div>
        ))}
      </motion.div>
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen w-full bg-[#1a1225] relative overflow-hidden"
    >
      {/* Full-page grid background */}
      <div 
        className="fixed inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      >
        {/* Enhanced animated gradient overlay */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(255,113,113,0.15), transparent 70%)',
            animation: 'pulse 4s ease-in-out infinite'
          }}
        />
      </div>

      {/* Enhanced Gradient Orbs with Reactive Movement */}
      <motion.div 
        animate={{
          x: (mousePosition.x - window.innerWidth/2) * 0.02,
          y: (mousePosition.y - window.innerHeight/2) * 0.02,
        }}
        transition={{ type: "spring", damping: 15 }}
        className="fixed left-1/4 top-1/4 w-[600px] h-[600px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255,113,113,0.15) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />
      <motion.div 
        animate={{
          x: (mousePosition.x - window.innerWidth/2) * -0.02,
          y: (mousePosition.y - window.innerHeight/2) * -0.02,
        }}
        transition={{ type: "spring", damping: 15 }}
        className="fixed right-1/4 bottom-1/4 w-[600px] h-[600px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(75,0,130,0.15) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

      {/* Content Container */}
      <motion.div 
        className="relative max-w-6xl mx-auto px-4 pt-20 pb-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className="text-center mt-8 mb-12 relative"
          variants={itemVariants}
        >
          <div className="relative mb-4">
            <motion.div
              className="absolute -inset-4 rounded-lg opacity-50 blur-3xl bg-gradient-to-r from-[#ff7171]/20 via-purple-500/20 to-[#ff4b4b]/20"
              animate={{
                opacity: [0.2, 0.4, 0.2],
                scale: [1, 1.05, 1],
              }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            <h1 className="text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70 relative z-10">
              Decode Any Business
            </h1>
          </div>

          <div className="relative mb-6">
            <motion.div
              className="absolute -inset-4 rounded-lg opacity-50 blur-3xl bg-gradient-to-r from-[#ff7171]/30 to-purple-500/30"
              animate={{
                opacity: [0.3, 0.5, 0.3],
                scale: [1, 1.1, 1],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <h1 className="text-7xl font-bold text-[#ff7171] relative z-10">
              In Seconds
            </h1>
          </div>

          <motion.p 
            className="text-xl text-gray-400 max-w-2xl mx-auto mb-8"
            variants={itemVariants}
          >
            AI-powered analysis of any company's business model, revenue streams, and market strategy
          </motion.p>

          {/* Input Method Toggle */}
          <div className="flex justify-center gap-4 mb-8">
            <motion.button
              onClick={() => setInputMethod('website')}
              className={`px-6 py-3 rounded-full flex items-center gap-2 transition-all duration-300 ${
                inputMethod === 'website' ? 'bg-[#ff7171] text-white' : 'bg-black/30 text-gray-400'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Globe className="w-4 h-4" />
              Website Analysis
            </motion.button>
            <motion.button
              onClick={() => setInputMethod('manual')}
              className={`px-6 py-3 rounded-full flex items-center gap-2 transition-all duration-300 ${
                inputMethod === 'manual' ? 'bg-[#ff7171] text-white' : 'bg-black/30 text-gray-400'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FileText className="w-4 h-4" />
              Manual Input
            </motion.button>
          </div>

          {/* Enhanced Input Form */}
          <motion.form 
            onSubmit={handleSubmit}
            className="max-w-3xl mx-auto space-y-6"
            variants={itemVariants}
          >
            {renderInputSection()}

            {/* Submit Button */}
            <div className="flex gap-4 mt-8">
              <motion.button
                type="submit"
                disabled={isLoading || (!url.trim() && inputMethod === 'website') || 
                  (inputMethod === 'manual' && Object.values(businessInfo).some(v => v.length < MINIMUM_CHARS))}
                className="flex-1 relative group overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-[#ff7171] via-purple-500 to-[#ff4b4b] rounded-xl opacity-0 group-hover:opacity-70 blur-xl transition-opacity duration-300" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#ff7171] to-[#ff4b4b] opacity-90 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                
                <div className="relative px-8 py-4 flex items-center justify-center gap-2 text-white font-medium">
                  {isLoading ? (
                    <motion.div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Analyzing...
                    </motion.div>
                  ) : (
                    <motion.div className="flex items-center gap-2">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                      >
                        <Brain className="w-5 h-5" />
                      </motion.div>
                      <span>Analyze Business Model</span>
                      <motion.div
                        animate={{ x: [0, 4, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <ArrowRight className="w-5 h-5" />
                      </motion.div>
                    </motion.div>
                  )}
                </div>
              </motion.button>
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-4 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 text-sm flex items-center gap-2"
                >
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.form>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};