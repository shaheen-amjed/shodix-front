"use client"

import { motion } from "framer-motion"
import { ShoppingBag } from "lucide-react"

const Logo = () => {
  return (
    <motion.div
      className="relative w-8 h-8 flex items-center justify-center bg-primary rounded-full"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <ShoppingBag className="h-5 w-5 text-primary-foreground" />
    </motion.div>
  )
}

export default Logo

