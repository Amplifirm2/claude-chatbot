export const ScoreGauge = ({ score }) => {
    const circumference = 2 * Math.PI * 40
    const progress = (score / 10) * circumference
  
    return (
      <div className="relative w-32 h-32">
        <svg className="transform -rotate-90 w-32 h-32">
          <circle
            cx="64"
            cy="64"
            r="40"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-gray-700"
          />
          <circle
            cx="64"
            cy="64"
            r="40"
            stroke="url(#gradient)"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            className="transition-all duration-1000"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ff7171" />
              <stop offset="100%" stopColor="#ff4b4b" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
          <div className="text-2xl font-bold text-white">{score.toFixed(1)}</div>
          <div className="text-xs text-gray-400">out of 10</div>
        </div>
      </div>
    )
  }