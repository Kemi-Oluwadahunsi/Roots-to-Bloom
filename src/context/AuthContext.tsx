"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import {
  type User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  reload,
} from "firebase/auth"
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore"
import { auth, db } from "../firebase/config"

interface UserProfile {
  uid: string
  email: string
  firstName: string
  lastName: string
  phone?: {
    countryCode: string
    number: string
  }
  dateOfBirth?: string
  skinType?: string
  hairType?: string
  interests: string[]
  preferredCurrency?: string // User's preferred currency (default: MYR)
  address?: {
    line1: string
    line2?: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  emailVerified: boolean
  createdAt: Date
  updatedAt: Date
}

interface AuthContextType {
  currentUser: User | null
  userProfile: UserProfile | null
  loading: boolean
  signup: (email: string, password: string, firstName: string, lastName: string, phone?: { countryCode: string; number: string }, address?: { line1: string; line2?: string; city: string; state: string; zipCode: string; country: string }) => Promise<void>
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  sendEmailVerification: () => Promise<void>
  reloadUser: () => Promise<void>
  updateUserProfile: (profileData: Partial<UserProfile>) => Promise<void>
  updateUserPassword: (currentPassword: string, newPassword: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  const signup = async (email: string, password: string, firstName: string, lastName: string, phone?: { countryCode: string; number: string }, address?: { line1: string; line2?: string; city: string; state: string; zipCode: string; country: string }) => {
    try {
      // Check if Firebase is properly configured
      if (!import.meta.env.VITE_FIREBASE_PROJECT_ID) {
        throw new Error("Firebase is not properly configured. Please check your environment variables.")
      }

      const { user } = await createUserWithEmailAndPassword(auth, email, password)

      // Update the user's display name
      await updateProfile(user, {
        displayName: `${firstName} ${lastName}`,
      })

      // Send email verification
      await sendEmailVerification(user)

      // Create user profile in Firestore
      const userProfile = {
        uid: user.uid,
        email: user.email!,
        firstName,
        lastName,
        phone,
        address,
        interests: [],
        preferredCurrency: 'MYR', // Default currency
        emailVerified: user.emailVerified,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }

      await setDoc(doc(db, "users", user.uid), userProfile)
      // Convert serverTimestamp to Date for local state
      const localProfile: UserProfile = {
        ...userProfile,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      setUserProfile(localProfile)
    } catch (error: unknown) {
      console.error("Signup error:", error)
      
      // Provide more specific error messages
      if (error && typeof error === 'object' && 'code' in error) {
        const firebaseError = error as { code: string; message?: string }
        if (firebaseError.code === 'auth/email-already-in-use') {
          throw new Error("This email is already registered. Please use a different email or try logging in.")
        } else if (firebaseError.code === 'auth/weak-password') {
          throw new Error("Password is too weak. Please choose a stronger password.")
        } else if (firebaseError.code === 'auth/invalid-email') {
          throw new Error("Please enter a valid email address.")
        }
      }
      
      if (error && typeof error === 'object' && 'message' in error) {
        const errorWithMessage = error as { message: string }
        if (errorWithMessage.message?.includes("Firebase is not properly configured")) {
          throw new Error("Authentication service is not available. Please try again later.")
        }
      }
      
      throw new Error("Failed to create account. Please check your information and try again.")
    }
  }

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password)
  }

  const logout = async () => {
    setUserProfile(null)
    return signOut(auth)
  }

  const resetPassword = async (email: string) => {
    return sendPasswordResetEmail(auth, email)
  }

  const sendEmailVerificationToUser = async () => {
    if (!currentUser) throw new Error("No user logged in")
    return sendEmailVerification(currentUser)
  }

  const updateUserProfile = async (profileData: Partial<UserProfile>) => {
    if (!currentUser || !userProfile) return

    try {
      const updatedProfile = {
        ...profileData,
        updatedAt: serverTimestamp(),
      }

      await updateDoc(doc(db, "users", currentUser.uid), updatedProfile)
    } catch (error) {
      console.error("Error updating user profile:", error)
      throw error
    }

    // Update display name if firstName or lastName changed
    if (profileData.firstName || profileData.lastName) {
      await updateProfile(currentUser, {
        displayName: `${profileData.firstName || userProfile.firstName} ${profileData.lastName || userProfile.lastName}`,
      })
    }

    // Update local state with the new profile data
    const newUserProfile = {
      ...userProfile,
      ...profileData,
      updatedAt: new Date(), // Use regular Date for local state
    }
    setUserProfile(newUserProfile)
  }

  const updateUserPassword = async (currentPassword: string, newPassword: string) => {
    if (!currentUser || !currentUser.email) return

    const credential = EmailAuthProvider.credential(currentUser.email, currentPassword)
    await reauthenticateWithCredential(currentUser, credential)
    await updatePassword(currentUser, newPassword)
  }

  const fetchUserProfile = async (user: User) => {
    try {
      const docRef = doc(db, "users", user.uid)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        const profileData = docSnap.data() as UserProfile
        // Update email verification status from Firebase Auth
        const updatedProfile = {
          ...profileData,
          emailVerified: user.emailVerified,
        }
        setUserProfile(updatedProfile)
      } else {
        // If profile doesn't exist, create a basic one
        const basicProfile = {
          uid: user.uid,
          email: user.email!,
          firstName: user.displayName?.split(' ')[0] || 'User',
          lastName: user.displayName?.split(' ')[1] || '',
          interests: [],
          preferredCurrency: 'MYR', // Default currency
          emailVerified: user.emailVerified,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        }
        await setDoc(docRef, basicProfile)
        // Convert serverTimestamp to Date for local state
        const localProfile: UserProfile = {
          ...basicProfile,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        setUserProfile(localProfile)
      }
    } catch (error) {
      console.error("Error fetching user profile:", error)
      // Set a fallback profile to prevent blank page
      const fallbackProfile: UserProfile = {
        uid: user.uid,
        email: user.email!,
        firstName: user.displayName?.split(' ')[0] || 'User',
        lastName: user.displayName?.split(' ')[1] || '',
        interests: [],
        preferredCurrency: 'MYR', // Default currency
        emailVerified: user.emailVerified,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      setUserProfile(fallbackProfile)
    }
  }

  const reloadUser = async () => {
    if (currentUser) {
      await reload(currentUser)
      // Manually refresh the user profile to ensure email verification status is updated
      await fetchUserProfile(currentUser)
    }
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setCurrentUser(user)
      if (user) {
        await fetchUserProfile(user)
      } else {
        setUserProfile(null)
      }
      setLoading(false)
    })

    return unsubscribe
  }, [])

  // Listen for changes in email verification status and update profile
  useEffect(() => {
    if (currentUser && userProfile && currentUser.emailVerified !== userProfile.emailVerified) {
      // Update the user profile with the latest email verification status
      setUserProfile(prev => prev ? { ...prev, emailVerified: currentUser.emailVerified } : null)
    }
  }, [currentUser?.emailVerified, userProfile, currentUser])

  const value = {
    currentUser,
    userProfile,
    loading,
    signup,
    login,
    logout,
    resetPassword,
    sendEmailVerification: sendEmailVerificationToUser,
    reloadUser,
    updateUserProfile,
    updateUserPassword,
  }

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>
}
