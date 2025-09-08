"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Mail, RefreshCw, ArrowLeft } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const EmailVerification: React.FC = () => {
  const { currentUser, sendEmailVerification, reloadUser } = useAuth()
  const [isSending, setIsSending] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()

  // Check verification status periodically
  useEffect(() => {
    const checkVerificationStatus = async () => {
      if (currentUser) {
        // Reload user to get latest verification status
        await reloadUser()
        
        if (currentUser.emailVerified) {
          setMessage("Email verified successfully! Redirecting to home page...")
          // Force a profile refresh to ensure the verification status is updated everywhere
          await reloadUser()
          setTimeout(() => {
            navigate("/")
          }, 2000)
        }
      }
    }

    // Check immediately
    checkVerificationStatus()

    // Check every 3 seconds
    const interval = setInterval(checkVerificationStatus, 3000)

    // Clean up interval
    return () => clearInterval(interval)
  }, [currentUser, navigate, reloadUser])

  const handleResendVerification = async () => {
    try {
      setError("")
      setMessage("")
      setIsSending(true)
      await sendEmailVerification()
      setMessage("Verification email sent! Please check your inbox.")
    } catch {
      setError("Failed to send verification email. Please try again.")
    } finally {
      setIsSending(false)
    }
  }

  const handleGoToProfile = () => {
    navigate("/profile")
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#f8f7f2] dark:bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4b774a] mx-auto mb-4"></div>
          <p className="text-[#48392e] dark:text-[#e0e0e0]">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-[#f8f7f2] dark:bg-[#1a1a1a] py-20"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto bg-white dark:bg-[#2a2a2a] rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#4b774a] dark:bg-[#6a9e69] rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-[#48392e] dark:text-[#e0e0e0] mb-2">
              Verify Your Email
            </h1>
            <p className="text-[#4b774a] dark:text-[#6a9e69]">
              We've sent a verification link to
            </p>
            <p className="font-semibold text-[#48392e] dark:text-[#e0e0e0] mt-1">
              {currentUser.email}
            </p>
          </div>

          {message && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              {message}
            </div>
          )}

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className="space-y-6">
            <div className="text-center">
              <p className="text-[#48392e] dark:text-[#e0e0e0] mb-4">
                Please check your email and click the verification link to activate your account.
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                This page will automatically redirect you once your email is verified.
              </p>
            </div>

            <div className="space-y-4">
              <button
                onClick={handleResendVerification}
                disabled={isSending}
                className="w-full flex items-center justify-center px-4 py-3 bg-[#4b774a] dark:bg-[#6a9e69] text-white rounded-md hover:bg-opacity-90 transition duration-300 disabled:opacity-50"
              >
                {isSending ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Mail className="w-4 h-4 mr-2" />
                )}
                {isSending ? "Sending..." : "Resend Verification Email"}
              </button>

              <button
                onClick={handleGoToProfile}
                className="w-full flex items-center justify-center px-4 py-3 bg-gray-500 text-white rounded-md hover:bg-opacity-90 transition duration-300"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go to Profile
              </button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Didn't receive the email? Check your spam folder or try resending.
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link
              to="/"
              className="text-[#4b774a] dark:text-[#6a9e69] hover:underline font-medium"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default EmailVerification
