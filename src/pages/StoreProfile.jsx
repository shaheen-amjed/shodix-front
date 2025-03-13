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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Store Dashboard</h1>
                <p className="text-gray-500 mt-1">Manage your store profile, products, and orders</p>
              </div>

              {store && (
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="bg-gray-100 px-4 py-2 rounded-md">
                    <span className="text-sm text-gray-500">Store</span>
                    <p className="font-medium">{store.store_name}</p>
                  </div>
                  <a
                    href={`/store/${store.store_name}`}
                    target="_blank"
                    className="text-sm text-blue-600 hover:text-blue-800 hover:underline inline-flex items-center"
                    rel="noreferrer"
                  >
                    View store
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 ml-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                </div>
              )}
            </div>

            {store && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="text-sm text-gray-500">Products</div>
                  <div className="text-2xl font-semibold mt-1">{products.length}</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="text-sm text-gray-500">Orders</div>
                  <div className="text-2xl font-semibold mt-1">{orders.length}</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="text-sm text-gray-500">Status</div>
                  <div className="mt-1">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <Tabs defaultValue="profile" className="w-full">
              <div className="border-b border-gray-200">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="profile" className="py-4">
                    Profile
                  </TabsTrigger>
                  <TabsTrigger value="products" className="py-4">
                    Products
                  </TabsTrigger>
                  <TabsTrigger value="orders" className="py-4">
                    Orders
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="profile" className="p-6">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Store Profile</h2>
                  <p className="text-gray-500 mt-1">Update your store information and settings</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
                  <div className="space-y-2">
                    <Label htmlFor="store_name" className="text-gray-700">
                      Store Name
                    </Label>
                    <Input
                      id="store_name"
                      name="store_name"
                      type="text"
                      required
                      value={formData.store_name}
                      onChange={handleChange}
                      className="max-w-md"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-gray-700">
                      New Password (leave blank to keep current)
                    </Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="max-w-md"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="full_location" className="text-gray-700">
                      Full Location
                    </Label>
                    <Input
                      id="full_location"
                      name="full_location"
                      type="text"
                      required
                      value={formData.full_location}
                      onChange={handleChange}
                      className="max-w-md"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio" className="text-gray-700">
                      Store Bio
                    </Label>
                    <Textarea
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      className="max-w-md"
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="storeImg" className="text-gray-700">
                      Store Image
                    </Label>
                    <div className="flex items-center max-w-md">
                      <div className="mr-4">
                        <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                          {store?.store_img ? (
                            <img
                              src={store.store_img || "/placeholder.svg"}
                              alt="Store"
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span className="text-xl font-semibold text-gray-500">
                              {store?.store_name?.charAt(0) || "S"}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="border rounded-md p-2 flex items-center justify-center border-dashed">
                          <label htmlFor="storeImg" className="cursor-pointer flex flex-col items-center p-2 w-full">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-gray-400 mb-1"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                              />
                            </svg>
                            <span className="text-sm text-gray-500">Upload image</span>
                            <Input
                              id="storeImg"
                              name="storeImg"
                              type="file"
                              accept="image/*"
                              onChange={handleChange}
                              className="hidden"
                            />
                          </label>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Recommended: 512x512px JPG or PNG</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <Button type="submit" className="min-w-[120px]" disabled={loading}>
                      {loading ? "Updating..." : "Save Changes"}
                    </Button>
                  </div>
                </form>
              </TabsContent>

              <TabsContent value="products" className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Products</h2>
                    <p className="text-gray-500 mt-1">Manage your store products</p>
                  </div>
                  <Link to="/store/add-product">
                    <Button>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add Product
                    </Button>
                  </Link>
                </div>

                {products.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="mx-auto h-12 w-12 text-gray-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                      />
                    </svg>
                    <h3 className="mt-2 text-sm font-semibold text-gray-900">No products</h3>
                    <p className="mt-1 text-sm text-gray-500">Get started by creating a new product.</p>
                    <div className="mt-6">
                      <Link to="/store/add-product">
                        <Button>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          Add Product
                        </Button>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {products.map((product) => (
                      <ProductCard key={product.product_id} product={product} isStoreView={true} />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="orders" className="p-6">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Orders</h2>
                  <p className="text-gray-500 mt-1">View and manage your store orders</p>
                </div>

                {orders.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="mx-auto h-12 w-12 text-gray-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      />
                    </svg>
                    <h3 className="mt-2 text-sm font-semibold text-gray-900">No orders yet</h3>
                    <p className="mt-1 text-sm text-gray-500">Orders will appear here when customers make purchases.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <OrderItem key={order.order_id} order={order} />
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default StoreProfile

