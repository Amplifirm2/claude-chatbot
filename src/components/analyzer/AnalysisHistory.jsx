import { colors } from '../../utils/theme'
import { formatDistanceToNow } from 'date-fns'

export const AnalysisHistory = ({ history, onSelect, currentAnalysis }) => {
  return (
    <div className="rounded-xl p-4" style={{ backgroundColor: colors.card }}>
      <h3 className="text-lg font-medium text-white mb-4">Analysis History</h3>
      
      {history.length === 0 ? (
        <p className="text-gray-400 text-sm">No previous analyses</p>
      ) : (
        <div className="space-y-3">
          {history.map((item) => (
            <button
              key={item.id}
              onClick={() => onSelect(item)}
              className={`w-full p-3 rounded-lg text-left transition-all ${
                currentAnalysis?.id === item.id
                  ? 'ring-2 ring-[#ff7171]'
                  : 'hover:bg-gray-800/50'
              }`}
              style={{ backgroundColor: colors.accent }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-sm font-medium text-white">{item.fileName}</div>
                  <div className="text-xs text-gray-400">
                    {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}
                  </div>
                </div>
                <div 
                  className="text-sm font-medium"
                  style={{ color: colors.primary }}
                >
                  {item.analysis.overallScore}/10
                </div>
              </div>
              
              {/* Show score changes if available */}
              {item.analysis.changes && (
                <div className="mt-2 flex items-center gap-2">
                  <div className={`text-xs ${
                    item.analysis.changes > 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {item.analysis.changes > 0 ? '+' : ''}{item.analysis.changes}%
                  </div>
                  <div className="text-xs text-gray-400">from previous</div>
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}