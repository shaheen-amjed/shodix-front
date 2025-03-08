"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { getCart, updateCart, deleteCartItem, addOrder } from "../lib/api"
import { useAuth } from "../contexts/AuthContext"
import { useCart } from "../contexts/CartContext"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash2, Plus, Minus } from "lucide-react"

const Cart = () => {
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const { refreshCart } = useCart()
  const { toast } = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    fetchCart()
  }, [])

  const fetchCart = async () => {
    try {
      const response = await getCart()
      setCartItems(response.data)
    } catch (error) {
      console.error("Error fetching cart:", error)
      // Instead of showing an error toast, we'll just set an empty cart
      setCartItems([])
    } finally {
      setLoading(false)
    }
  }

  const handleQuantityChange = async (cartId, currentQuantity, change) => {
    const newQuantity = currentQuantity + change
    if (newQuantity < 1) return

    try {
      await updateCart({ cart_id: cartId, quantity: newQuantity })
      setCartItems((prevItems) =>
        prevItems.map((item) => (item.cart_id === cartId ? { ...item, quantity: newQuantity } : item)),
      )
      refreshCart()
    } catch (error) {
      console.error("Error updating cart:", error)
      toast({
        title: "Error",
        description: "Failed to update cart",
        variant: "destructive",
      })
    }
  }

  const handleRemoveItem = async (cartId) => {
    try {
      await deleteCartItem(cartId)
      setCartItems((prevItems) => prevItems.filter((item) => item.cart_id !== cartId))
      refreshCart()
      toast({
        title: "Item Removed",
        description: "The item has been removed from your cart",
      })
    } catch (error) {
      console.error("Error removing item from cart:", error)
      toast({
        title: "Error",
        description: "Failed to remove item from cart",
        variant: "destructive",
      })
    }
  }

  const handleCheckout = async () => {
    try {
      for (const item of cartItems) {
        await addOrder({
          quantity: item.quantity,
          country: item.country,
          full_location: item.full_location,
          store_name: item.store_name,
          product_id: item.product_id,
          store_id: item.store_id,
          cart_id: item.cart_id,
        })
      }
      setCartItems([])
      refreshCart()
      toast({
        title: "Order Placed",
        description: "Your order has been successfully placed",
      })
      navigate("/cart")
    } catch (error) {
      console.error("Error during checkout:", error)
      toast({
        title: "Checkout Failed",
        description: "There was an error processing your order",
        variant: "destructive",
      })
    }
  }

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)
  }

  if (loading) {
    return <div className="text-center py-12">Loading cart...</div>
  }

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <p className="text-muted-foreground mb-4">No items found in your cart.</p>
        <Link to="/shop">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <motion.div
              key={item.cart_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-4 p-4 border rounded-lg"
            >
              <img
                src={`https://shodix-api-node.vercel.app${item.img}`}
                alt={item.name}
                className="w-24 h-24 object-cover rounded"
                onError={(e) => {
                  e.target.src = "/placeholder.svg?height=100&width=100"
                }}
              />
              <div className="flex-1">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-sm text-muted-foreground">{item.store_name}</p>
                <p className="font-medium">${item.price.toFixed(2)}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(item.cart_id, item.quantity, -1)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  type="number"
                  value={item.quantity}
                  onChange={(e) =>
                    handleQuantityChange(item.cart_id, Number.parseInt(e.target.value) - item.quantity, 0)
                  }
                  className="w-16 text-center"
                  min="1"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(item.cart_id, item.quantity, 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(item.cart_id)}>
                <Trash2 className="h-5 w-5" />
              </Button>
            </motion.div>
          ))}
        </div>
        <div className="md:col-span-1">
          <div className="bg-card p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-2">
              {cartItems.map((item) => (
                <div key={item.cart_id} className="flex justify-between">
                  <span>
                    {item.name} (x{item.quantity})
                  </span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t mt-4 pt-4">
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>${calculateTotal()}</span>
              </div>
            </div>
            <Button className="w-full mt-6" onClick={handleCheckout}>
              Proceed to Checkout
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart

