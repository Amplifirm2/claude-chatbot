import { useState, useCallback } from 'react'
import { FileUp, AlertCircle } from 'lucide-react'
import { validateFile } from '../../utils/fileValidation'
import { colors } from '../../utils/theme'

export const FileUploadZone = ({ onFileSelect, isLoading }) => {
  const [isDragging, setIsDragging] = useState(false)
  const [dragError, setDragError] = useState(null)
  
  const handleDrag = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDragIn = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragOut = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    setDragError(null)

    const files = e.dataTransfer.files
    if (files && files.length === 1) {
      const file = files[0]
      if (validateFile(file)) {
        onFileSelect(file)
      } else {
        setDragError('Please upload a PDF or Word document')
      }
    } else {
      setDragError('Please upload only one file')
    }
  }, [onFileSelect])

  return (
    <div
      onDragOver={handleDrag}
      onDragEnter={handleDragIn}
      onDragLeave={handleDragOut}
      onDrop={handleDrop}
      className={`relative rounded-xl border-2 border-dashed transition-all p-12 text-center ${
        isDragging 
          ? 'border-[#ff7171] bg-[#ff7171]/10' 
          : 'border-gray-600 hover:border-gray-500'
      }`}
      style={{ backgroundColor: isDragging ? 'rgba(255,113,113,0.05)' : colors.card }}
    >
      <input
        type="file"
        id="file-upload"
        className="hidden"
        accept=".pdf,.doc,.docx"
        onChange={(e) => {
          const file = e.target.files[0]
          if (file && validateFile(file)) {
            onFileSelect(file)
          }
        }}
      />
      
      <label
        htmlFor="file-upload"
        className="flex flex-col items-center cursor-pointer"
      >
        <FileUp 
          className={`w-16 h-16 mb-4 ${
            isDragging ? 'text-[#ff7171]' : 'text-gray-400'
          }`}
        />
        <div className="text-xl font-medium text-white mb-2">
          {isDragging ? 'Drop your document here' : 'Drop your document or click to upload'}
        </div>
        <p className="text-gray-400 text-sm mb-4">
          Support for PDF and Word documents
        </p>
        {!isDragging && (
          <button
            className="px-4 py-2 rounded-lg text-sm text-white transition-all"
            style={{ background: colors.gradient }}
          >
            Select File
          </button>
        )}
      </label>

      {dragError && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 text-red-400 text-sm">
          <AlertCircle className="w-4 h-4" />
          {dragError}
        </div>
      )}
    </div>
  )
}