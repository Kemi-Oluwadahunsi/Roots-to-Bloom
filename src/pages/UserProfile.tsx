"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { User, Mail, Phone, Edit3, Save, X, Lock, CheckCircle, AlertCircle, RefreshCw, Settings } from "lucide-react"
import { useAuth } from "../context/AuthContext"
import { Link } from "react-router-dom"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { useToast } from "../hooks/useToast"
import { getAvailableCurrencies } from "../utils/currency"
import * as yup from "yup"

const profileSchema = yup.object().shape({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  phoneCountryCode: yup.string(),
  phoneNumber: yup.string(),
  skinType: yup.string(),
  hairType: yup.string(),
  preferredCurrency: yup.string(),
  interests: yup.array().of(yup.string().required()).default([]),
  addressLine1: yup.string(),
  addressLine2: yup.string(),
  city: yup.string(),
  state: yup.string(),
  zipCode: yup.string(),
  country: yup.string(),
})

const passwordSchema = yup.object().shape({
  currentPassword: yup.string().required("Current password is required"),
  newPassword: yup.string().min(6, "Password must be at least 6 characters").required("New password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword")], "Passwords must match")
    .required("Please confirm your password"),
})

interface ProfileFormData {
  firstName: string
  lastName: string
  phoneCountryCode?: string
  phoneNumber?: string
  skinType?: string
  hairType?: string
  preferredCurrency?: string
  interests: string[]
  addressLine1?: string
  addressLine2?: string
  city?: string
  state?: string
  zipCode?: string
  country?: string
}

interface PasswordFormData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

const UserProfile: React.FC = () => {
  const { currentUser, userProfile, updateUserProfile, updateUserPassword, sendEmailVerification } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [isSendingVerification, setIsSendingVerification] = useState(false)
  const { showSuccess, showError } = useToast()

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
    reset: resetProfile,
  } = useForm<ProfileFormData>({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      firstName: userProfile?.firstName || "",
      lastName: userProfile?.lastName || "",
      phoneCountryCode: userProfile?.phone?.countryCode || "",
      phoneNumber: userProfile?.phone?.number || "",
      skinType: userProfile?.skinType || "",
      hairType: userProfile?.hairType || "",
      preferredCurrency: userProfile?.preferredCurrency || "MYR",
      interests: userProfile?.interests || [],
      addressLine1: userProfile?.address?.line1 || "",
      addressLine2: userProfile?.address?.line2 || "",
      city: userProfile?.address?.city || "",
      state: userProfile?.address?.state || "",
      zipCode: userProfile?.address?.zipCode || "",
      country: userProfile?.address?.country || "",
    },
  })

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    reset: resetPassword,
  } = useForm<PasswordFormData>({
    resolver: yupResolver(passwordSchema),
  })

  const onProfileSubmit = async (data: ProfileFormData) => {
    try {
      const phone = data.phoneCountryCode && data.phoneNumber ? {
        countryCode: data.phoneCountryCode,
        number: data.phoneNumber
      } : undefined
      
      const address = data.addressLine1 && data.city && data.state && data.zipCode && data.country ? {
        line1: data.addressLine1,
        line2: data.addressLine2,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        country: data.country
      } : undefined
      
      const profileData = {
        firstName: data.firstName,
        lastName: data.lastName,
        phone,
        address,
        skinType: data.skinType,
        hairType: data.hairType,
        preferredCurrency: data.preferredCurrency,
        interests: data.interests,
      }
      
      await updateUserProfile(profileData)
      showSuccess("Profile updated successfully!")
      setIsEditing(false)
    } catch (err) {
      showError("Failed to update profile. Please try again:" + err)
    }
  }

  const onPasswordSubmit = async (data: PasswordFormData) => {
    try {
      await updateUserPassword(data.currentPassword, data.newPassword)
      showSuccess("Password updated successfully!")
      setIsChangingPassword(false)
      resetPassword()
    } catch (err) {
      console.error('Password update error:', err)
      showError("Failed to update password. Please check your current password.")
    }
  }

  const handleSendVerification = async () => {
    try {
      setIsSendingVerification(true)
      await sendEmailVerification()
      showSuccess("Verification email sent! Please check your inbox.")
    } catch (err) {
      showError(err +"Failed to send verification email. Please try again.")
    } finally {
      setIsSendingVerification(false)
    }
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    resetProfile({
      firstName: userProfile?.firstName || "",
      lastName: userProfile?.lastName || "",
      phoneCountryCode: userProfile?.phone?.countryCode || "",
      phoneNumber: userProfile?.phone?.number || "",
      skinType: userProfile?.skinType || "",
      hairType: userProfile?.hairType || "",
      interests: userProfile?.interests || [],
      addressLine1: userProfile?.address?.line1 || "",
      addressLine2: userProfile?.address?.line2 || "",
      city: userProfile?.address?.city || "",
      state: userProfile?.address?.state || "",
      zipCode: userProfile?.address?.zipCode || "",
      country: userProfile?.address?.country || "",
    })
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

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-[#f8f7f2] dark:bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4b774a] mx-auto mb-4"></div>
          <p className="text-[#48392e] dark:text-[#e0e0e0]">Loading profile...</p>
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
        <div className="max-w-2xl mx-auto">
          <div className="bg-white dark:bg-[#2a2a2a] rounded-lg shadow-lg p-8 mb-6">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <div className="w-16 h-16 bg-[#4b774a] dark:bg-[#6a9e69] rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {userProfile.firstName.charAt(0)}
                  {userProfile.lastName.charAt(0)}
                </div>
                <div className="ml-4">
                  <h1 className="text-2xl font-bold text-[#48392e] dark:text-[#e0e0e0]">
                    {userProfile.firstName} {userProfile.lastName}
                  </h1>
                  <p className="text-[#4b774a] dark:text-[#6a9e69]">{currentUser.email}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center px-4 py-2 bg-[#4b774a] dark:bg-[#6a9e69] text-white rounded-md hover:bg-opacity-90 transition duration-300"
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit Profile
                  </button>
                )}
                <Link
                  to="/admin"
                  className="flex items-center px-4 py-2 bg-[#d79f63] dark:bg-[#b58552] text-white rounded-md hover:bg-opacity-90 transition duration-300"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Admin Dashboard
                </Link>
              </div>
            </div>


            <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#48392e] dark:text-[#e0e0e0] mb-2">
                    First Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#4b774a] dark:text-[#6a9e69] w-5 h-5" />
                    <input
                      {...registerProfile("firstName")}
                      type="text"
                      disabled={!isEditing}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-[#48392e] dark:text-[#e0e0e0] focus:outline-none focus:ring-2 focus:ring-[#4b774a] dark:focus:ring-[#6a9e69] disabled:bg-gray-100 dark:disabled:bg-gray-700"
                    />
                  </div>
                  {profileErrors.firstName && (
                    <p className="mt-1 text-red-500 text-sm">{profileErrors.firstName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#48392e] dark:text-[#e0e0e0] mb-2">Last Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#4b774a] dark:text-[#6a9e69] w-5 h-5" />
                    <input
                      {...registerProfile("lastName")}
                      type="text"
                      disabled={!isEditing}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-[#48392e] dark:text-[#e0e0e0] focus:outline-none focus:ring-2 focus:ring-[#4b774a] dark:focus:ring-[#6a9e69] disabled:bg-gray-100 dark:disabled:bg-gray-700"
                    />
                  </div>
                  {profileErrors.lastName && (
                    <p className="mt-1 text-red-500 text-sm">{profileErrors.lastName.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#48392e] dark:text-[#e0e0e0] mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#4b774a] dark:text-[#6a9e69] w-5 h-5" />
                  <input
                    type="email"
                    value={currentUser.email || ""}
                    disabled
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-700 text-[#48392e] dark:text-[#e0e0e0]"
                  />
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center">
                    {userProfile?.emailVerified ? (
                      <div className="flex items-center text-green-600 dark:text-green-400">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        <span className="text-sm font-medium">Email Verified</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-amber-600 dark:text-amber-400">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        <span className="text-sm font-medium">Email Not Verified</span>
                      </div>
                    )}
                  </div>
                  {!userProfile?.emailVerified && (
                    <button
                      onClick={handleSendVerification}
                      disabled={isSendingVerification}
                      className="flex items-center px-3 py-1 text-xs bg-[#4b774a] dark:bg-[#6a9e69] text-white rounded-md hover:bg-opacity-90 transition duration-300 disabled:opacity-50"
                    >
                      {isSendingVerification ? (
                        <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                      ) : (
                        <Mail className="w-3 h-3 mr-1" />
                      )}
                      {isSendingVerification ? "Sending..." : "Verify Email"}
                    </button>
                  )}
                </div>
                <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#48392e] dark:text-[#e0e0e0] mb-2">
                    Country Code
                  </label>
                  <select
                    {...registerProfile("phoneCountryCode")}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-[#48392e] dark:text-[#e0e0e0] focus:outline-none focus:ring-2 focus:ring-[#4b774a] dark:focus:ring-[#6a9e69] disabled:bg-gray-100 dark:disabled:bg-gray-700"
                  >
                    <option value="">Select</option>
                    <option value="+1">+1 (US/CA)</option>
                    <option value="+44">+44 (UK)</option>
                    <option value="+61">+61 (AU)</option>
                    <option value="+65">+65 (SG)</option>
                    <option value="+60">+60 (MY)</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-[#48392e] dark:text-[#e0e0e0] mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#4b774a] dark:text-[#6a9e69] w-5 h-5" />
                    <input
                      {...registerProfile("phoneNumber")}
                      type="tel"
                      disabled={!isEditing}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-[#48392e] dark:text-[#e0e0e0] focus:outline-none focus:ring-2 focus:ring-[#4b774a] dark:focus:ring-[#6a9e69] disabled:bg-gray-100 dark:disabled:bg-gray-700"
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>
              </div>

              {/* Address Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-[#48392e] dark:text-[#e0e0e0]">Address</h3>
                
                <div>
                  <label className="block text-sm font-medium text-[#48392e] dark:text-[#e0e0e0] mb-2">
                    Address Line 1
                  </label>
                  <input
                    {...registerProfile("addressLine1")}
                    type="text"
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-[#48392e] dark:text-[#e0e0e0] focus:outline-none focus:ring-2 focus:ring-[#4b774a] dark:focus:ring-[#6a9e69] disabled:bg-gray-100 dark:disabled:bg-gray-700"
                    placeholder="Street address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#48392e] dark:text-[#e0e0e0] mb-2">
                    Address Line 2
                  </label>
                  <input
                    {...registerProfile("addressLine2")}
                    type="text"
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-[#48392e] dark:text-[#e0e0e0] focus:outline-none focus:ring-2 focus:ring-[#4b774a] dark:focus:ring-[#6a9e69] disabled:bg-gray-100 dark:disabled:bg-gray-700"
                    placeholder="Apartment, suite, etc."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[#48392e] dark:text-[#e0e0e0] mb-2">
                      City
                    </label>
                    <input
                      {...registerProfile("city")}
                      type="text"
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-[#48392e] dark:text-[#e0e0e0] focus:outline-none focus:ring-2 focus:ring-[#4b774a] dark:focus:ring-[#6a9e69] disabled:bg-gray-100 dark:disabled:bg-gray-700"
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#48392e] dark:text-[#e0e0e0] mb-2">
                      State/Province
                    </label>
                    <input
                      {...registerProfile("state")}
                      type="text"
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-[#48392e] dark:text-[#e0e0e0] focus:outline-none focus:ring-2 focus:ring-[#4b774a] dark:focus:ring-[#6a9e69] disabled:bg-gray-100 dark:disabled:bg-gray-700"
                      placeholder="State/Province"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[#48392e] dark:text-[#e0e0e0] mb-2">
                      ZIP/Postal Code
                    </label>
                    <input
                      {...registerProfile("zipCode")}
                      type="text"
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-[#48392e] dark:text-[#e0e0e0] focus:outline-none focus:ring-2 focus:ring-[#4b774a] dark:focus:ring-[#6a9e69] disabled:bg-gray-100 dark:disabled:bg-gray-700"
                      placeholder="ZIP/Postal Code"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#48392e] dark:text-[#e0e0e0] mb-2">
                      Country
                    </label>
                    <select
                      {...registerProfile("country")}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-[#48392e] dark:text-[#e0e0e0] focus:outline-none focus:ring-2 focus:ring-[#4b774a] dark:focus:ring-[#6a9e69] disabled:bg-gray-100 dark:disabled:bg-gray-700"
                    >
                      <option value="">Select Country</option>
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="GB">United Kingdom</option>
                      <option value="AU">Australia</option>
                      <option value="SG">Singapore</option>
                      <option value="MY">Malaysia</option>
                    </select>
                  </div>
                </div>
              </div>

              

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#48392e] dark:text-[#e0e0e0] mb-2">Skin Type</label>
                  <select
                    {...registerProfile("skinType")}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-[#48392e] dark:text-[#e0e0e0] focus:outline-none focus:ring-2 focus:ring-[#4b774a] dark:focus:ring-[#6a9e69] disabled:bg-gray-100 dark:disabled:bg-gray-700"
                  >
                    <option value="">Select skin type</option>
                    <option value="normal">Normal</option>
                    <option value="dry">Dry</option>
                    <option value="oily">Oily</option>
                    <option value="combination">Combination</option>
                    <option value="sensitive">Sensitive</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#48392e] dark:text-[#e0e0e0] mb-2">Hair Type</label>
                  <select
                    {...registerProfile("hairType")}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-[#48392e] dark:text-[#e0e0e0] focus:outline-none focus:ring-2 focus:ring-[#4b774a] dark:focus:ring-[#6a9e69] disabled:bg-gray-100 dark:disabled:bg-gray-700"
                  >
                    <option value="">Select hair type</option>
                    <option value="straight">Straight</option>
                    <option value="wavy">Wavy</option>
                    <option value="curly">Curly</option>
                    <option value="coily">Coily</option>
                  </select>
                </div>
              </div>

              {/* Preferred Currency */}
              <div>
                <label className="block text-sm font-medium text-[#48392e] dark:text-[#e0e0e0] mb-2">
                  Preferred Currency
                </label>
                <select
                  {...registerProfile("preferredCurrency")}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-[#48392e] dark:text-[#e0e0e0] focus:outline-none focus:ring-2 focus:ring-[#4b774a] dark:focus:ring-[#6a9e69] disabled:bg-gray-100 dark:disabled:bg-gray-700"
                >
                  {getAvailableCurrencies().map((currency) => (
                    <option key={currency.code} value={currency.code}>
                      {currency.symbol} - {currency.name} ({currency.code})
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  All prices will be displayed in your preferred currency
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#48392e] dark:text-[#e0e0e0] mb-2">Interests</label>
                <div className="space-y-2">
                  {["skincare", "haircare", "bodycare", "wellness", "natural ingredients"].map((interest) => (
                    <label key={interest} className="flex items-center">
                      <input
                        type="checkbox"
                        value={interest}
                        {...registerProfile("interests")}
                        disabled={!isEditing}
                        className="form-checkbox h-4 w-4 text-[#4b774a] dark:text-[#6a9e69] rounded focus:ring-[#4b774a] dark:focus:ring-[#6a9e69] disabled:opacity-50"
                      />
                      <span className="ml-2 text-[#48392e] dark:text-[#e0e0e0] capitalize">{interest}</span>
                    </label>
                  ))}
                </div>
              </div>

              {isEditing && (
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="flex items-center px-6 py-3 bg-[#4b774a] dark:bg-[#6a9e69] text-white rounded-md hover:bg-opacity-90 transition duration-300"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="flex items-center px-6 py-3 bg-gray-500 text-white rounded-md hover:bg-opacity-90 transition duration-300"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* Password Change Section */}
          <div className="bg-white dark:bg-[#2a2a2a] rounded-lg shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[#48392e] dark:text-[#e0e0e0]">Change Password</h2>
              {!isChangingPassword && (
                <button
                  onClick={() => setIsChangingPassword(true)}
                  className="flex items-center px-4 py-2 bg-[#d79f63] dark:bg-[#b58552] text-white rounded-md hover:bg-opacity-90 transition duration-300"
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Change Password
                </button>
              )}
            </div>

            {isChangingPassword && (
              <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-[#48392e] dark:text-[#e0e0e0] mb-2">
                    Current Password
                  </label>
                  <input
                    {...registerPassword("currentPassword")}
                    type="password"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-[#48392e] dark:text-[#e0e0e0] focus:outline-none focus:ring-2 focus:ring-[#4b774a] dark:focus:ring-[#6a9e69]"
                    placeholder="Enter current password"
                  />
                  {passwordErrors.currentPassword && (
                    <p className="mt-1 text-red-500 text-sm">{passwordErrors.currentPassword.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#48392e] dark:text-[#e0e0e0] mb-2">
                    New Password
                  </label>
                  <input
                    {...registerPassword("newPassword")}
                    type="password"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-[#48392e] dark:text-[#e0e0e0] focus:outline-none focus:ring-2 focus:ring-[#4b774a] dark:focus:ring-[#6a9e69]"
                    placeholder="Enter new password"
                  />
                  {passwordErrors.newPassword && (
                    <p className="mt-1 text-red-500 text-sm">{passwordErrors.newPassword.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#48392e] dark:text-[#e0e0e0] mb-2">
                    Confirm New Password
                  </label>
                  <input
                    {...registerPassword("confirmPassword")}
                    type="password"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-[#48392e] dark:text-[#e0e0e0] focus:outline-none focus:ring-2 focus:ring-[#4b774a] dark:focus:ring-[#6a9e69]"
                    placeholder="Confirm new password"
                  />
                  {passwordErrors.confirmPassword && (
                    <p className="mt-1 text-red-500 text-sm">{passwordErrors.confirmPassword.message}</p>
                  )}
                </div>

                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="flex items-center px-6 py-3 bg-[#4b774a] dark:bg-[#6a9e69] text-white rounded-md hover:bg-opacity-90 transition duration-300"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Update Password
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsChangingPassword(false)
                      resetPassword()
                    }}
                    className="flex items-center px-6 py-3 bg-gray-500 text-white rounded-md hover:bg-opacity-90 transition duration-300"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default UserProfile
