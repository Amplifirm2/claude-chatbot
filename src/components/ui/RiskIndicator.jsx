export const RiskIndicator = ({ level }) => {
    const colors = {
      low: 'bg-green-500',
      medium: 'bg-yellow-500',
      high: 'bg-red-500'
    }
  
    return (
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${colors[level]}`} />
        <span className="capitalize text-sm">{level}</span>
      </div>
    )
  }