import React from 'react'
import { RefreshCw } from 'lucide-react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
  className?: string
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  text = '加载中...', 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <RefreshCw className={`${sizeClasses[size]} animate-spin text-blue-600 mr-2`} />
      <span className={`text-gray-600 ${textSizeClasses[size]}`}>{text}</span>
    </div>
  )
}

export default LoadingSpinner