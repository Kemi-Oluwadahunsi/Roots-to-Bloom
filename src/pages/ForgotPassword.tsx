"use client"

import type React from "react"
import { useState } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Mail, ArrowLeft } from "lucide-react"
import { useAuth } from "../context/AuthContext"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { useToast } from "../hooks/useToast"
import * as yup from "yup"

const schema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
})

interface ForgotPasswordFormData {
  email: string
}

const ForgotPassword: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false)

  const { resetPassword } = useAuth()
  const { showSuccess, showError } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: yupResolver(schema),
  })

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      setIsLoading(true)
      await resetPassword(data.email)
      showSuccess("Check your inbox for further instructions")
    } catch (error: unknown) {
      showError("Failed to reset password. Please check your email address.")
    } finally {
      setIsLoading(false)
    }
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
            <h1 className="text-3xl font-bold text-[#48392e] dark:text-[#e0e0e0] mb-2">Reset Password</h1>
            <p className="text-[#4b774a] dark:text-[#6a9e69]">
              Enter your email address and we'll send you a link to reset your password
            </p>
          </div>


          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[#48392e] dark:text-[#e0e0e0] mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#4b774a] dark:text-[#6a9e69] w-5 h-5" />
                <input
                  {...register("email")}
                  type="email"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-[#48392e] dark:text-[#e0e0e0] focus:outline-none focus:ring-2 focus:ring-[#4b774a] dark:focus:ring-[#6a9e69]"
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && <p className="mt-1 text-red-500 text-sm">{errors.email.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#4b774a] dark:bg-[#6a9e69] text-white py-3 rounded-md hover:bg-opacity-90 transition duration-300 disabled:opacity-50"
            >
              {isLoading ? "Sending..." : "Reset Password"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/login" className="inline-flex items-center text-[#4b774a] dark:text-[#6a9e69] hover:underline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default ForgotPassword
