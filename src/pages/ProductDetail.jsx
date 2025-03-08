"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { motion } from "framer-motion"
import { ShoppingCart, Store, Minus, Plus, MessageSquare } from "lucide-react"
import { getProduct, addToCart } from "../lib/api"
import { useAuth } from "../contexts/AuthContext"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import LoadingScreen from "../components/LoadingScreen"

const API_BASE_URL = "http://localhost:3001"

const ProductDetail = () => {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getProduct(id)
        setProduct(response.data)
      } catch (error) {
        console.error("Error fetching product:", error)
        toast({
          title: "Error",
          description: "Failed to load product details",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id, toast])

  const handleAddToCart = async () => {
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
        quantity,
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

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1)
    }
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  if (loading) {
    return <LoadingScreen />
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold">Product not found</h2>
        <p className="text-muted-foreground mt-2">The product you're looking for doesn't exist or has been removed.</p>
        <Link to="/shop">
          <Button className="mt-4">Back to Shop</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
          <div className="rounded-lg overflow-hidden border">
            <img
              src={`${API_BASE_URL}${product.img}`}
              alt={product.name}
              className="w-full h-auto object-cover"
              onError={(e) => {
                e.target.src = "/placeholder.svg?height=600&width=600"
              }}
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <Link
              to={`/store/${product.store_name}`}
              className="flex items-center text-muted-foreground hover:text-foreground mt-2"
            >
              <Store className="h-4 w-4 mr-1" />
              {product.store_name}
            </Link>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-3xl font-bold">${product.price.toFixed(2)}</p>
            <span className="bg-secondary px-3 py-1 rounded-full text-sm">{product.country}</span>
          </div>

          <div className="border-t border-b py-4">
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-muted-foreground">{product.desc}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-2">
              Availability:{" "}
              <span className={product.stock > 0 ? "text-green-500" : "text-red-500"}>
                {product.stock > 0 ? `In Stock (${product.stock} available)` : "Out of Stock"}
              </span>
            </p>

            {product.stock > 0 && (
              <div className="flex items-center space-x-4 mb-4">
                <span className="text-sm font-medium">Quantity:</span>
                <div className="flex items-center">
                  <Button variant="outline" size="icon" onClick={decrementQuantity} disabled={quantity <= 1}>
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={incrementQuantity}
                    disabled={quantity >= product.stock}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-4">
              <Button onClick={handleAddToCart} disabled={product.stock <= 0} className="flex-1">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart
              </Button>

              {user && (
                <Link to={`/chat/${product.store_name}`}>
                  <Button variant="outline">
                    <MessageSquare className="h-5 w-5 mr-2" />
                    Contact Seller
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default ProductDetail

