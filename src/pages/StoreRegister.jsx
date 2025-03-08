"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { registerStore } from "../lib/api"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const StoreRegister = () => {
  const [formData, setFormData] = useState({
    store_name: "",
    password: "",
    full_location: "",
    bio: "",
    storeImg: null,
  })
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value, files } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await registerStore(formData)
      toast({
        title: "Store Registration Successful",
        description: "Your store has been registered. Please log in.",
      })
      navigate("/store/login")
    } catch (error) {
      console.error("Store registration error:", error)
      toast({
        title: "Registration Failed",
        description: error.response?.data?.msg || "An error occurred during registration",
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
          <h1 className="text-3xl font-bold">Register Your Store</h1>
          <p className="text-muted-foreground mt-2">Join Shodix and start selling globally</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="store_name">Store Name</Label>
            <Input
              id="store_name"
              name="store_name"
              type="text"
              required
              value={formData.store_name}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
            />
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

          <div className="space-y-2">
            <Label htmlFor="bio">Store Bio</Label>
            <Textarea id="bio" name="bio" required value={formData.bio} onChange={handleChange} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="storeImg">Store Image</Label>
            <Input id="storeImg" name="storeImg" type="file" accept="image/*" required onChange={handleChange} />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Registering Store..." : "Register Store"}
          </Button>
        </form>

        <div className="text-center space-y-2">
          <p>
            Already have a store account?{" "}
            <Link to="/store/login" className="text-primary hover:underline">
              Log in
            </Link>
          </p>
          <p>
            Are you a customer?{" "}
            <Link to="/register" className="text-primary hover:underline">
              Register as a customer
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default StoreRegister

