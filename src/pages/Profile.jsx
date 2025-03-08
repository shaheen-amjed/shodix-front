"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { updateUser } from "../lib/api"
import { useAuth } from "../contexts/AuthContext"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const Profile = () => {
  const { user, login } = useAuth()
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    full_location: "",
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username,
        password: "",
        full_location: user.full_location,
      })
    }
  }, [user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await updateUser(formData)
      login(response.data.token)
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      })
    } catch (error) {
      console.error("Profile update error:", error)
      toast({
        title: "Update Failed",
        description: error.response?.data?.msg || "An error occurred while updating your profile",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div className="text-center">
          <h1 className="text-3xl font-bold">Your Profile</h1>
          <p className="text-muted-foreground mt-2">Update your account information</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              name="username"
              type="text"
              required
              value={formData.username}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">New Password (leave blank to keep current)</Label>
            <Input id="password" name="password" type="password" value={formData.password} onChange={handleChange} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="full_location">Full Location</Label>
            <Input
              id="full_location"
              name="full_location"
              type="text"
              required
              value={formData.full_location}
              onChange={handleChange}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Updating..." : "Update Profile"}
          </Button>
        </form>
      </motion.div>
    </div>
  )
}

export default Profile

