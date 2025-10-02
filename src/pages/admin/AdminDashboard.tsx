"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { Package, Users, MessageSquare, BarChart3, Settings, Upload, AlertTriangle, Database, ShoppingBag } from "lucide-react"
import { migrateProductsToFirebase } from "../../utils/migrateProducts"

const AdminDashboard: React.FC = () => {
  const [migrating, setMigrating] = useState(false)
  const [migrationResult, setMigrationResult] = useState<string | null>(null)

  const handleMigration = async () => {
    try {
      setMigrating(true)
      setMigrationResult(null)
      await migrateProductsToFirebase()
      setMigrationResult("✅ Migration completed! Check console for details.")
    } catch (error) {
      setMigrationResult("❌ Migration failed. Check console for errors.")
      console.error(error)
    } finally {
      setMigrating(false)
    }
  }
  const adminMenuItems = [
    {
      title: "Product Management",
      description: "Manage your product catalog, add new products, and update existing ones",
      icon: Package,
      link: "/admin/products",
      color: "bg-[#4b774a] dark:bg-[#6a9e69]",
    },
    {
      title: "Order Management",
      description: "View and manage customer orders, update shipping status",
      icon: ShoppingBag,
      link: "/admin/orders",
      color: "bg-indigo-600 dark:bg-indigo-700",
    },
    {
      title: "Image Migration",
      description: "Migrate existing product images from local storage to Cloudinary",
      icon: Upload,
      link: "/admin/migration",
      color: "bg-purple-600 dark:bg-purple-700",
    },
    {
      title: "Product Cleanup",
      description: "Remove duplicate products and clean up your product database",
      icon: AlertTriangle,
      link: "/admin/product-cleanup",
      color: "bg-orange-600 dark:bg-orange-700",
    },
    {
      title: "User Management",
      description: "View and manage user accounts and profiles",
      icon: Users,
      link: "/admin/users",
      color: "bg-blue-600 dark:bg-blue-700",
      comingSoon: true,
    },
    {
      title: "Reviews & Feedback",
      description: "Monitor product reviews and customer feedback",
      icon: MessageSquare,
      link: "/admin/reviews",
      color: "bg-purple-600 dark:bg-purple-700",
      comingSoon: true,
    },
    {
      title: "Analytics",
      description: "View sales analytics and performance metrics",
      icon: BarChart3,
      link: "/admin/analytics",
      color: "bg-orange-600 dark:bg-orange-700",
      comingSoon: true,
    },
    {
      title: "Settings",
      description: "Configure system settings and preferences",
      icon: Settings,
      link: "/admin/settings",
      color: "bg-gray-600 dark:bg-gray-700",
      comingSoon: true,
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[#f8f7f2] dark:bg-[#1a1a1a] py-20"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-[#48392e] dark:text-[#e0e0e0] mb-4">
              Admin Dashboard
            </h1>
            <p className="text-[#4b774a] dark:text-[#6a9e69] text-lg">
              Manage your Roots to Bloom store
            </p>
          </div>

          {/* Migration Result */}
          {migrationResult && (
            <div className="mb-6 p-4 bg-white dark:bg-[#2a2a2a] rounded-lg shadow-lg">
              <p className="text-center">{migrationResult}</p>
            </div>
          )}

          {/* Admin Menu Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Product Migration Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0 }}
              className="relative bg-white dark:bg-[#2a2a2a] rounded-lg shadow-lg p-6 hover:shadow-xl transition duration-300"
            >
              <div className="w-12 h-12 bg-green-600 dark:bg-green-700 rounded-lg flex items-center justify-center mb-4">
                <Database className="w-6 h-6 text-white" />
              </div>

              <h3 className="text-xl font-semibold text-[#48392e] dark:text-[#e0e0e0] mb-2">
                Sync Products to Firebase
              </h3>

              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Migrate new products from static data to Firebase database
              </p>

              <button
                onClick={handleMigration}
                disabled={migrating}
                className="w-full py-2 px-4 bg-green-600 dark:bg-green-700 text-white rounded-md hover:bg-green-700 dark:hover:bg-green-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {migrating ? "Migrating..." : "Run Migration"}
              </button>
            </motion.div>

            {adminMenuItems.map((item, index) => {
              const IconComponent = item.icon
              const isComingSoon = item.comingSoon

              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative bg-white dark:bg-[#2a2a2a] rounded-lg shadow-lg p-6 hover:shadow-xl transition duration-300 ${
                    isComingSoon ? "opacity-75" : "hover:scale-105"
                  }`}
                >
                  {isComingSoon && (
                    <div className="absolute top-4 right-4">
                      <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-1 rounded-full">
                        Coming Soon
                      </span>
                    </div>
                  )}

                  <div className={`w-12 h-12 ${item.color} rounded-lg flex items-center justify-center mb-4`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>

                  <h3 className="text-xl font-semibold text-[#48392e] dark:text-[#e0e0e0] mb-2">
                    {item.title}
                  </h3>

                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {item.description}
                  </p>

                  {isComingSoon ? (
                    <button
                      disabled
                      className="w-full px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 rounded-md cursor-not-allowed"
                    >
                      Coming Soon
                    </button>
                  ) : (
                    <Link
                      to={item.link}
                      className="block w-full px-4 py-2 bg-[#4b774a] dark:bg-[#6a9e69] text-white text-center rounded-md hover:bg-opacity-90 transition duration-300"
                    >
                      Access
                    </Link>
                  )}
                </motion.div>
              )
            })}
          </div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-12 bg-white dark:bg-[#2a2a2a] rounded-lg shadow-lg p-6"
          >
            <h2 className="text-2xl font-bold text-[#48392e] dark:text-[#e0e0e0] mb-6">
              Quick Stats
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#4b774a] dark:text-[#6a9e69] mb-2">
                  -
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  Total Products
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#4b774a] dark:text-[#6a9e69] mb-2">
                  -
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  Total Users
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#4b774a] dark:text-[#6a9e69] mb-2">
                  -
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  Total Reviews
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

export default AdminDashboard
