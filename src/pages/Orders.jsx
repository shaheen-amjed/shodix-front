"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { getStoreOrders, completeOrder } from "../lib/api"
import { useAuth } from "../contexts/AuthContext"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"

const Orders = () => {
  const { store } = useAuth()
  const { toast } = useToast()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await getStoreOrders()
      setOrders(response.data)
    } catch (error) {
      console.error("Error fetching orders:", error)
      toast({
        title: "Error",
        description: "Failed to load orders",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCompleteOrder = async (orderId) => {
    try {
      await completeOrder(orderId)
      setOrders(orders.filter((order) => order.order_id !== orderId))
      toast({
        title: "Order Completed",
        description: "The order has been marked as completed.",
      })
    } catch (error) {
      console.error("Error completing order:", error)
      toast({
        title: "Error",
        description: "Failed to complete the order",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading orders...</div>
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-8">Store Orders</h1>
      {orders.length === 0 ? (
        <p className="text-center text-muted-foreground">No orders found.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <motion.div
              key={order.order_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-card p-6 rounded-lg shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold">Order #{order.order_id}</h2>
                  <p className="text-muted-foreground">Customer: {order.username}</p>
                  <p className="text-muted-foreground">Location: {order.full_location}</p>
                  <p className="mt-2">Product ID: {order.product_id}</p>
                  <p>Quantity: {order.quantity}</p>
                </div>
                <Button onClick={() => handleCompleteOrder(order.order_id)}>Mark as Completed</Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Orders

