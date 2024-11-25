import { useState } from 'react'
import { FileUp, AlertTriangle, ChevronRight } from 'lucide-react'
import { colors } from '../utils/theme'

export const FileUpload = ({ onFileSelect, isLoading }) => {
  const [isDragging, setIsDragging] = useState(false)
  const [dragError, setDragError] = useState(null)

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) onFileSelect(file)
  }

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDragEnter={() => setIsDragging(true)}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={`rounded-2xl border-2 border-dashed transition-all duration-300 p-16 text-center backdrop-blur-sm ${
        isDragging 
          ? 'border-[#ff7171] bg-[#ff7171]/5 scale-[1.02]' 
          : 'border-gray-600/40 hover:border-gray-500/60'
      }`}
      style={{ 
        backgroundColor: colors.cardBg,
        boxShadow: isDragging ? colors.glowPrimary : 'none'
      }}
    >
      <input
        type="file"
        id="file-upload"
        className="hidden"
        onChange={(e) => onFileSelect(e.target.files[0])}
        accept=".pdf,.doc,.docx"
      />
      
      <label 
        htmlFor="file-upload" 
        className="flex flex-col items-center cursor-pointer group"
      >
        <div 
          className={`w-24 h-24 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 ${
            isDragging ? 'bg-[#ff7171]/10' : 'bg-gray-800/50 group-hover:bg-gray-800/70'
          }`}
        >
          <FileUp 
            className={`w-12 h-12 transition-all duration-300 ${
              isDragging ? 'text-[#ff7171] scale-110' : 'text-gray-400 group-hover:text-gray-300'
            }`} 
          />
        </div>
        <div className="text-2xl font-medium text-white mb-3">
          {isDragging ? 'Drop your document here' : 'Upload Business Document'}
        </div>
        <p className="text-gray-400 text-sm mb-6 max-w-sm">
          Upload your business plan or model document (PDF or Word) for AI-powered analysis
        </p>
        <div 
          className="px-6 py-3 rounded-xl text-white text-sm transition-all duration-300 flex items-center gap-2 group-hover:gap-3"
          style={{ background: colors.gradient }}
        >
          Select Document
          <ChevronRight className="w-4 h-4" />
        </div>
      </label>

      {dragError && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 text-red-400 text-sm bg-red-500/10 px-4 py-2 rounded-lg">
          <AlertTriangle className="w-4 h-4" />
          {dragError}
        </div>
      )}
    </div>
  )
}