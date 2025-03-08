"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { loginStore } from "../lib/api"
import { useAuth } from "../contexts/AuthContext"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const StoreLogin = () => {
  const [formData, setFormData] = useState({
    store_name: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await loginStore(formData)
      login(response.data.token, true)
      toast({
        title: "Login Successful",
        description: "Welcome back to your store dashboard!",
      })
      navigate("/store/profile")
    } catch (error) {
      console.error("Store login error:", error)
      toast({
        title: "Login Failed",
        description: error.response?.data?.msg || "Invalid store name or password",
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
          <h1 className="text-3xl font-bold">Store Login</h1>
          <p className="text-muted-foreground mt-2">Access your store dashboard</p>
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

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Logging in..." : "Log In"}
          </Button>
        </form>

        <div className="text-center space-y-2">
          <p>
            Don't have a store account?{" "}
            <Link to="/store/register" className="text-primary hover:underline">
              Register your store
            </Link>
          </p>
          <p>
            Are you a customer?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Customer Login
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default StoreLogin

