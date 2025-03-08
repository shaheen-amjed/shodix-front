"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { loginUser } from "../lib/api"
import { useAuth } from "../contexts/AuthContext"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
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
      const response = await loginUser(formData)
      login(response.data.token)
      toast({
        title: "Login Successful",
        description: "Welcome back to Shodix!",
      })
      navigate("/")
    } catch (error) {
      console.error("Login error:", error)
      toast({
        title: "Login Failed",
        description: error.response?.data?.msg || "Invalid username or password",
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
          <h1 className="text-3xl font-bold">Welcome Back</h1>
          <p className="text-muted-foreground mt-2">Sign in to your account</p>
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
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <div className="text-center space-y-2">
          <p>
            Don't have an account?{" "}
            <Link to="/register" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
          <p>
            Are you a store owner?{" "}
            <Link to="/store/login" className="text-primary hover:underline">
              Store Login
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default Login

