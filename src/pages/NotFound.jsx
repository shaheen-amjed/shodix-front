"use client"

import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

const NotFound = () => {
  return (
    <div className="container mx-auto text-center py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
        <p className="text-xl text-muted-foreground mb-8">Oops! The page you're looking for doesn't exist.</p>
        <Link to="/">
          <Button size="lg">Go Back Home</Button>
        </Link>
      </motion.div>
    </div>
  )
}

export default NotFound

