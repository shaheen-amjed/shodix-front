"use client"

import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { getCart } from "../lib/api"
import { useAuth } from "./AuthContext"
import { useToast } from "@/components/ui/use-toast"

const CartContext = createContext()

export const useCart = () => useContext(CartContext)

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(false)
  const { user, isAuthenticated } = useAuth()
  const { toast } = useToast()

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated || !user) return

    setLoading(true)
    try {
      const response = await getCart()
      setCartItems(response.data)
    } catch (error) {
      console.error("Error fetching cart:", error)
      if (error.response?.status !== 404) {
        toast({
          title: "Error",
          description: "Failed to fetch cart items",
          variant: "destructive",
        })
      }
      setCartItems([])
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated, user, toast])

  useEffect(() => {
    fetchCart()
  }, [fetchCart])

  const value = {
    cartItems,
    cartCount: cartItems.length,
    loading,
    refreshCart: fetchCart,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

