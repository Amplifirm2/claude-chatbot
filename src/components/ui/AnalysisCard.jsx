import { RiskIndicator } from './RiskIndicator'
import { analysisCriteria } from '../../utils/constants'
import { colors } from '../../utils/theme'

export const AnalysisCard = ({ criteriaKey, data }) => {
  const criteria = analysisCriteria[criteriaKey]

  return (
    <div 
      className="rounded-lg p-6 transition-all hover:transform hover:scale-[1.02]"
      style={{ backgroundColor: colors.accent }}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{criteria.icon}</span>
            <h3 className="text-white font-medium">{criteria.label}</h3>
          </div>
          <p className="text-gray-400 text-sm mt-1">{criteria.description}</p>
        </div>
        <div className="flex items-center gap-3">
          <RiskIndicator level={data.score >= 8 ? 'low' : data.score >= 6 ? 'medium' : 'high'} />
          <div className="text-2xl font-bold" style={{ color: colors.primary }}>
            {data.score}/10
          </div>
        </div>
      </div>
      <p className="text-gray-300">{data.feedback}</p>
    </div>
  )
}