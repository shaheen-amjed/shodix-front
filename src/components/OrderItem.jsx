"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { completeOrder } from "../lib/api"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"

const OrderItem = ({ order }) => {
  const [isCompleted, setIsCompleted] = useState(false)
  const { toast } = useToast()

  const handleCompleteOrder = async () => {
    try {
      await completeOrder(order.order_id)
      setIsCompleted(true)
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

  return (
    <motion.div
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
        {!isCompleted && <Button onClick={handleCompleteOrder}>Mark as Completed</Button>}
        {isCompleted && <span className="text-green-500 font-semibold">Completed</span>}
      </div>
    </motion.div>
  )
}

export default OrderItem

