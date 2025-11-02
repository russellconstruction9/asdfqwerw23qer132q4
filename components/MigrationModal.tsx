import React, { useState, useEffect } from 'react'
import { DataMigrationService } from '../lib/dataMigration'
import { CheckCircleIcon, ExclamationTriangleIcon, ArrowPathIcon } from './icons'

interface MigrationModalProps {
  isOpen: boolean
  userId: string
  onComplete: () => void
  onSkip: () => void
}

const MigrationModal: React.FC<MigrationModalProps> = ({ isOpen, userId, onComplete, onSkip }) => {
  const [migrationStatus, setMigrationStatus] = useState<'checking' | 'ready' | 'migrating' | 'complete' | 'error'>('checking')
  const [hasLocalData, setHasLocalData] = useState(false)
  const [localDataSummary, setLocalDataSummary] = useState<{
    reports: number
    documents: number
    templates: number
    hasProfile: boolean
  }>({ reports: 0, documents: 0, templates: 0, hasProfile: false })
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      checkForLocalData()
    }
  }, [isOpen])

  const checkForLocalData = () => {
    setMigrationStatus('checking')
    
    const hasData = DataMigrationService.hasLocalData()
    setHasLocalData(hasData)
    
    if (hasData) {
      const localData = DataMigrationService.getLocalStorageData()
      setLocalDataSummary({
        reports: localData.reports.length,
        documents: localData.documents.length,
        templates: localData.incidentTemplates.length,
        hasProfile: localData.userProfile !== null
      })
      setMigrationStatus('ready')
    } else {
      setMigrationStatus('complete')
    }
  }

  const startMigration = async () => {
    setMigrationStatus('migrating')
    setError(null)
    
    try {
      const result = await DataMigrationService.migrateToSupabase(userId)
      
      if (result.success) {
        // Clear localStorage after successful migration
        DataMigrationService.clearLocalStorage()
        setMigrationStatus('complete')
        
        // Give user a moment to see success, then complete
        setTimeout(() => {
          onComplete()
        }, 2000)
      } else {
        setMigrationStatus('error')
        setError(result.error || 'Migration failed')
      }
    } catch (err) {
      setMigrationStatus('error')
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
    }
  }

  const handleSkip = () => {
    // Clear localStorage if user chooses to skip migration
    DataMigrationService.clearLocalStorage()
    onSkip()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          {migrationStatus === 'checking' && (
            <>
              <div className="flex items-center gap-3 mb-4">
                <ArrowPathIcon className="w-6 h-6 text-blue-600 animate-spin" />
                <h2 className="text-xl font-semibold text-gray-900">Checking for existing data...</h2>
              </div>
              <p className="text-gray-600">We're looking for any data you may have stored locally.</p>
            </>
          )}

          {migrationStatus === 'ready' && hasLocalData && (
            <>
              <div className="flex items-center gap-3 mb-4">
                <ExclamationTriangleIcon className="w-6 h-6 text-amber-600" />
                <h2 className="text-xl font-semibold text-gray-900">Local Data Found</h2>
              </div>
              <p className="text-gray-600 mb-4">
                We found existing data on your device. Would you like to migrate it to your cloud account?
              </p>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Data Summary:</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• {localDataSummary.reports} incident reports</li>
                  <li>• {localDataSummary.documents} documents</li>
                  <li>• {localDataSummary.templates} templates</li>
                  {localDataSummary.hasProfile && <li>• User profile</li>}
                </ul>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={startMigration}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium"
                >
                  Migrate Data
                </button>
                <button
                  onClick={handleSkip}
                  className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 font-medium"
                >
                  Start Fresh
                </button>
              </div>
              
              <p className="text-xs text-gray-500 mt-3">
                Note: Choosing "Start Fresh" will permanently delete your local data.
              </p>
            </>
          )}

          {migrationStatus === 'migrating' && (
            <>
              <div className="flex items-center gap-3 mb-4">
                <ArrowPathIcon className="w-6 h-6 text-blue-600 animate-spin" />
                <h2 className="text-xl font-semibold text-gray-900">Migrating your data...</h2>
              </div>
              <p className="text-gray-600">Please wait while we transfer your data to the cloud. This may take a moment.</p>
              <div className="mt-4 bg-blue-50 rounded-lg p-4">
                <div className="h-2 bg-blue-200 rounded-full">
                  <div className="h-2 bg-blue-600 rounded-full w-3/4 animate-pulse"></div>
                </div>
              </div>
            </>
          )}

          {migrationStatus === 'complete' && (
            <>
              <div className="flex items-center gap-3 mb-4">
                <CheckCircleIcon className="w-6 h-6 text-green-600" />
                <h2 className="text-xl font-semibold text-gray-900">
                  {hasLocalData ? 'Migration Complete!' : 'Welcome to CustodyX.AI'}
                </h2>
              </div>
              <p className="text-gray-600">
                {hasLocalData 
                  ? 'Your data has been successfully transferred to your cloud account. You can now access it from any device.'
                  : 'You\'re all set to start using CustodyX.AI with cloud storage.'
                }
              </p>
              {hasLocalData && (
                <div className="mt-4 bg-green-50 rounded-lg p-4">
                  <p className="text-sm text-green-800">
                    Your local data has been cleared to prevent duplication.
                  </p>
                </div>
              )}
            </>
          )}

          {migrationStatus === 'error' && (
            <>
              <div className="flex items-center gap-3 mb-4">
                <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
                <h2 className="text-xl font-semibold text-gray-900">Migration Failed</h2>
              </div>
              <p className="text-gray-600 mb-4">
                We encountered an error while migrating your data:
              </p>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-red-800">{error}</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={startMigration}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium"
                >
                  Try Again
                </button>
                <button
                  onClick={handleSkip}
                  className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 font-medium"
                >
                  Skip Migration
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default MigrationModal