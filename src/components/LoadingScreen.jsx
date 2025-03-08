"use client"

import { motion } from "framer-motion"
import Logo from "./Logo"

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
        className="flex flex-col items-center"
      >
        <Logo />
        <p className="mt-4 text-lg font-medium">Loading...</p>
      </motion.div>
    </div>
  )
}

export default LoadingScreen

