"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { updateStore, getStoreProducts, getStoreOrders } from "../lib/api"
import { useAuth } from "../contexts/AuthContext"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import ProductCard from "../components/ProductCard"
import OrderItem from "../components/OrderItem"

const API_BASE_URL = "https://shodix-api-node-production.up.railway.app"

const StoreProfile = () => {
  const { store, login } = useAuth()
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    store_name: "",
    password: "",
    full_location: "",
    bio: "",
    storeImg: null,
  })
  const [loading, setLoading] = useState(false)
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])

  useEffect(() => {
    if (store) {
      setFormData({
        store_name: store.store_name,
        password: "",
        full_location: store.full_location,
        bio: store.bio || "",
        storeImg: null,
      })
      fetchStoreProducts()
      fetchStoreOrders()
    }
  }, [store])

  const fetchStoreProducts = async () => {
    try {
      const response = await getStoreProducts(store.store_id)
      setProducts(response.data)
    } catch (error) {
      console.error("Error fetching store products:", error)
    }
  }

  const fetchStoreOrders = async () => {
    try {
      const response = await getStoreOrders()
      setOrders(response.data)
    } catch (error) {
      console.error("Error fetching store orders:", error)
    }
  }

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
      const response = await updateStore(formData)
      login(response.data.token, true)
      toast({
        title: "Profile Updated",
        description: "Your store profile has been successfully updated.",
      })
    } catch (error) {
      console.error("Store profile update error:", error)
      toast({
        title: "Profile Updated",
        description: "Your store profile has been successfully updated.",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        <div className="text-center">
          <h1 className="text-3xl font-bold">Store Dashboard</h1>
          <p className="text-muted-foreground mt-2">Manage your store profile, products, and orders</p>
        </div>

        {store && (
          <div className="flex items-center flex-col justify-center mb-8">
            <h3>{store.store_name}</h3>
            <br />
            <h4><a href={`/store/${store.store_name}`} target="_blank">click to see your store public profile</a></h4>
          </div>
        )}


        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
          </TabsList>
          <TabsContent value="profile">
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
                <Label htmlFor="password">New Password (leave blank to keep current)</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
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
                <Textarea id="bio" name="bio" value={formData.bio} onChange={handleChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="storeImg">Store Image</Label>
                <Input id="storeImg" name="storeImg" type="file" accept="image/*" onChange={handleChange} />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Updating..." : "Update Store Profile"}
              </Button>
            </form>
          </TabsContent>
          <TabsContent value="products">
            <div>
              <Link to="/store/add-product">
                <Button className="mb-4">Add New Product</Button>
              </Link>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map((product) => (
                  <ProductCard key={product.product_id} product={product} isStoreView={true} />
                ))}
              </div>
            </div>
          </TabsContent>
          <TabsContent value="orders">
            <div className="space-y-4">
              {orders.map((order) => (
                <OrderItem key={order.order_id} order={order} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}

export default StoreProfile
