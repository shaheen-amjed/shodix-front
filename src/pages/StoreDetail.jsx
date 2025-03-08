"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { motion } from "framer-motion"
import { getStore, getStoreProducts, followStore, getFollowersCount, checkIsFollowing } from "../lib/api"
import { useAuth } from "../contexts/AuthContext"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import ProductCard from "../components/ProductCard"
import LoadingScreen from "../components/LoadingScreen"

const StoreDetail = () => {
  const { storeName } = useParams()
  const [store, setStore] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [followersCount, setFollowersCount] = useState(0)
  const [isFollowing, setIsFollowing] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        const storeResponse = await getStore(storeName)
        setStore(storeResponse.data)

        const productsResponse = await getStoreProducts(storeResponse.data.store_id)
        setProducts(productsResponse.data)

        const followersResponse = await getFollowersCount(storeResponse.data.store_id)
        setFollowersCount(followersResponse.data.followers_count)

        if (user) {
          const followingResponse = await checkIsFollowing(storeResponse.data.store_id)
          setIsFollowing(followingResponse.data.msg === "followed")
        }
      } catch (error) {
        console.error("Error fetching store data:", error)
        toast({
          title: "Error",
          description: "Failed to load store details",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchStoreData()
  }, [storeName, user, toast])

  const handleFollow = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to follow stores",
        variant: "destructive",
      })
      return
    }

    try {
      await followStore(store.store_id, store.store_name)
      setIsFollowing(true)
      setFollowersCount((prevCount) => prevCount + 1)
      toast({
        title: "Success",
        description: `You are now following ${store.store_name}`,
      })
    } catch (error) {
      console.error("Error following store:", error)
      toast({
        title: "Error",
        description: "Failed to follow store",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return <LoadingScreen />
  }

  if (!store) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold">Store not found</h2>
        <p className="text-muted-foreground mt-2">The store you're looking for doesn't exist or has been removed.</p>
        <Link to="/shop">
          <Button className="mt-4">Back to Shop</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          <img
            src={`https://shodix-api-node-production.up.railway.app${store.img}`}
            alt={store.store_name}
            className="w-48 h-48 rounded-full object-cover"
            onError={(e) => {
              e.target.src = "/placeholder.svg?height=200&width=200"
            }}
          />
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{store.store_name}</h1>
            <p className="text-muted-foreground mt-2">{store.full_location}</p>
            <p className="mt-4">{store.bio}</p>
            <div className="flex items-center gap-4 mt-4">
              <span className="text-sm font-medium">{followersCount} followers</span>
              {user && !isFollowing && <Button onClick={handleFollow}>Follow Store</Button>}
              {user && isFollowing && (
                <Button variant="outline" disabled>
                  Following
                </Button>
              )}
              {user && (
                <Link to={`/chat/${store.store_name}`}>
                  <Button variant="outline">Contact Store</Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      <h2 className="text-2xl font-bold mb-4">Store Products</h2>
      {products.length === 0 ? (
        <p className="text-muted-foreground">This store has no products yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <motion.div
              key={product.product_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

export default StoreDetail

