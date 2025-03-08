"use client"

import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "../contexts/AuthContext"
import { useToast } from "@/components/ui/use-toast"
import { addToCart } from "../lib/api"

const API_BASE_URL = "http://localhost:3001"

const ProductCard = ({ product, isStoreView = false }) => {
  const { user } = useAuth()
  const { toast } = useToast()

  const handleAddToCart = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to add items to your cart",
        variant: "destructive",
      })
      return
    }

    try {
      const cartData = {
        store_id: product.store_id,
        store_name: product.store_name,
        product_id: product.product_id,
        quantity: 1,
        country: product.country,
        full_location: user.full_location,
        name: product.name,
        price: product.price,
        img: product.img,
      }

      await addToCart(cartData)

      toast({
        title: "Added to Cart",
        description: `${product.name} has been added to your cart`,
      })
    } catch (error) {
      console.error("Error adding to cart:", error)
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      })
    }
  }

  return (
    <Link to={isStoreView ? `/store/edit-product/${product.product_id}` : `/product/${product.product_id}`}>
      <motion.div
        className="group rounded-lg border overflow-hidden bg-card"
        whileHover={{ y: -5 }}
        transition={{ duration: 0.2 }}
      >
        <div className="aspect-square relative overflow-hidden">
          <img
            src={`${API_BASE_URL}${product.img}`}
            alt={product.name}
            className="object-cover w-full h-full transition-transform group-hover:scale-110"
            onError={(e) => {
              e.target.src = "/placeholder.svg?height=300&width=300"
            }}
          />
        </div>

        <div className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
              <p className="text-sm text-muted-foreground line-clamp-1">{product.store_name}</p>
            </div>
            <p className="font-bold">${product.price.toFixed(2)}</p>
          </div>

          <div className="mt-4 flex justify-between items-center">
            <span className="text-sm bg-secondary px-2 py-1 rounded-full">{product.country}</span>

            {!isStoreView && (
              <Button
                size="sm"
                variant="secondary"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  )
}

export default ProductCard

