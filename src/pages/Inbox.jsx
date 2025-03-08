"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { getInbox } from "../lib/api"
import { useAuth } from "../contexts/AuthContext"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"

const Inbox = ({ storeView = false }) => {
  const { user, store } = useAuth()
  const { toast } = useToast()
  const [chats, setChats] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchInbox()
  }, [])

  const fetchInbox = async () => {
    try {
      const response = await getInbox()
      setChats(response.data)
    } catch (error) {
      console.error("Error fetching inbox:", error)
      toast({
        title: "Error",
        description: "Failed to load inbox",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading inbox...</div>
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-8">Your Inbox</h1>
      {chats.length === 0 ? (
        <p className="text-center text-muted-foreground">No messages found.</p>
      ) : (
        <div className="space-y-4">
          {chats.map((chat) => (
            <motion.div
              key={storeView ? chat.username : chat.store_name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-card p-4 rounded-lg shadow"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">{storeView ? chat.username : chat.store_name}</h2>
                <Link to={storeView ? `/store/chat/${chat.username}` : `/chat/${chat.store_name}`}>
                  <Button>View Chat</Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Inbox

