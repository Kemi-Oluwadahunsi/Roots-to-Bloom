"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { Upload, CheckCircle, AlertCircle, RefreshCw, Cloud, Database, ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"
import { 
  migrateImagesToCloudinary, 
  checkImageMigrationStatus 
} from "../../utils/migrateImagesToCloudinary"

interface MigrationStatus {
  total: number;
  cloudinary: number;
  local: number;
  progress: number;
}

const ImageMigration: React.FC = () => {
  const [isMigrating, setIsMigrating] = useState(false)
  const [isChecking, setIsChecking] = useState(false)
  const [migrationStatus, setMigrationStatus] = useState<MigrationStatus | null>(null)
  const [migrationLog, setMigrationLog] = useState<string[]>([])
  const [error, setError] = useState("")

  const addLog = (message: string) => {
    setMigrationLog(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const handleCheckStatus = async () => {
    setIsChecking(true)
    setError("")
    addLog("Checking migration status...")
    
    try {
      // Capture console.log output
      const originalLog = console.log
      const logs: string[] = []
      
      console.log = (...args) => {
        logs.push(args.join(' '))
        originalLog(...args)
      }
      
      await checkImageMigrationStatus()
      
      // Parse the status from logs
      const statusLog = logs.find(log => log.includes('Migration Status:'))
      if (statusLog) {
        const totalMatch = logs.find(log => log.includes('Total products:'))?.match(/(\d+)/)
        const cloudinaryMatch = logs.find(log => log.includes('Using Cloudinary:'))?.match(/(\d+)/)
        const localMatch = logs.find(log => log.includes('Using local images:'))?.match(/(\d+)/)
        const progressMatch = logs.find(log => log.includes('Migration progress:'))?.match(/(\d+\.?\d*)%/)
        
        if (totalMatch && cloudinaryMatch && localMatch && progressMatch) {
          setMigrationStatus({
            total: parseInt(totalMatch[1]),
            cloudinary: parseInt(cloudinaryMatch[1]),
            local: parseInt(localMatch[1]),
            progress: parseFloat(progressMatch[1])
          })
        }
      }
      
      console.log = originalLog
      addLog("Status check completed")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to check status")
      addLog(`Error: ${err instanceof Error ? err.message : "Unknown error"}`)
    } finally {
      setIsChecking(false)
    }
  }

  const handleStartMigration = async () => {
    if (!window.confirm("This will upload all product images to Cloudinary and update Firebase. This may take several minutes. Continue?")) {
      return
    }

    setIsMigrating(true)
    setError("")
    setMigrationLog([])
    addLog("Starting image migration to Cloudinary...")
    
    try {
      // Capture console.log output
      const originalLog = console.log
      
      console.log = (...args) => {
        const message = args.join(' ')
        addLog(message)
        originalLog(...args)
      }
      
      await migrateImagesToCloudinary()
      
      console.log = originalLog
      addLog("Migration completed successfully!")
      
      // Refresh status after migration
      setTimeout(() => {
        handleCheckStatus()
      }, 2000)
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "Migration failed")
      addLog(`Migration failed: ${err instanceof Error ? err.message : "Unknown error"}`)
    } finally {
      setIsMigrating(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[#f8f7f2] dark:bg-[#1a1a1a] py-20"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-[#48392e] dark:text-[#e0e0e0] mb-2 flex items-center">
                <Cloud className="w-8 h-8 mr-3 text-blue-500" />
                Image Migration to Cloudinary
              </h1>
              <p className="text-[#4b774a] dark:text-[#6a9e69]">
                Migrate existing product images from local storage to Cloudinary cloud storage
              </p>
            </div>
            <Link
              to="/admin"
              className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-opacity-90 transition duration-300"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Admin
            </Link>
          </div>

          {/* Status Card */}
          <div className="bg-white dark:bg-[#2a2a2a] rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-[#48392e] dark:text-[#e0e0e0] mb-4 flex items-center">
              <Database className="w-5 h-5 mr-2" />
              Migration Status
            </h2>
            
            {migrationStatus ? (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {migrationStatus.total}
                  </div>
                  <div className="text-sm text-blue-700 dark:text-blue-300">Total Products</div>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {migrationStatus.cloudinary}
                  </div>
                  <div className="text-sm text-green-700 dark:text-green-300">Using Cloudinary</div>
                </div>
                <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                    {migrationStatus.local}
                  </div>
                  <div className="text-sm text-amber-700 dark:text-amber-300">Using Local Images</div>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {migrationStatus.progress.toFixed(1)}%
                  </div>
                  <div className="text-sm text-purple-700 dark:text-purple-300">Progress</div>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Click "Check Status" to see current migration progress
              </p>
            )}

            <div className="flex space-x-4">
              <button
                onClick={handleCheckStatus}
                disabled={isChecking}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-opacity-90 transition duration-300 disabled:opacity-50"
              >
                {isChecking ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4 mr-2" />
                )}
                Check Status
              </button>
            </div>
          </div>

          {/* Migration Actions */}
          <div className="bg-white dark:bg-[#2a2a2a] rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-[#48392e] dark:text-[#e0e0e0] mb-4 flex items-center">
              <Upload className="w-5 h-5 mr-2" />
              Migration Actions
            </h2>
            
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                  Start Image Migration
                </h3>
                <p className="text-sm text-blue-700 dark:text-blue-300 mb-4">
                  This will upload all existing product images to Cloudinary and update Firebase records with new URLs.
                  The process may take several minutes depending on the number of images.
                </p>
                <button
                  onClick={handleStartMigration}
                  disabled={isMigrating}
                  className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-opacity-90 transition duration-300 disabled:opacity-50"
                >
                  {isMigrating ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4 mr-2" />
                  )}
                  {isMigrating ? "Migrating..." : "Start Migration"}
                </button>
              </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 mr-2" />
                {error}
              </div>
            </div>
          )}

          {/* Migration Log */}
          {migrationLog.length > 0 && (
            <div className="bg-white dark:bg-[#2a2a2a] rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-[#48392e] dark:text-[#e0e0e0] mb-4 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                Migration Log
              </h2>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 max-h-96 overflow-y-auto">
                {migrationLog.map((log, index) => (
                  <div key={index} className="text-sm font-mono text-gray-700 dark:text-gray-300 mb-1">
                    {log}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Info Section */}
          <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">
              Migration Information
            </h3>
            <div className="text-blue-700 dark:text-blue-300 text-sm space-y-1">
              <p>• Images will be uploaded to Cloudinary's "products" folder</p>
              <p>• Original image quality and format will be preserved</p>
              <p>• Firebase product records will be updated with new Cloudinary URLs</p>
              <p>• Local image files will remain unchanged (backup)</p>
              <p>• Migration can be run multiple times safely</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default ImageMigration
