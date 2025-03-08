"use client"

import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

const HeroSection = () => {
  return (
    <section className="relative h-[80vh] overflow-hidden">
      <div className="container mx-auto h-full flex flex-col justify-center items-start px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-xl bg-background/80 backdrop-blur-sm p-8 rounded-lg"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Shop Globally, <span className="text-primary">Buy Locally</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Discover unique products from stores around the world. Shodix connects you with sellers from every corner of
            the globe.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/shop">
              <Button size="lg">Start Shopping</Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default HeroSection

