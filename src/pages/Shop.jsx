"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { getAllProducts } from "../lib/api"
import { useAuth } from "../contexts/AuthContext"
import { useToast } from "@/components/ui/use-toast"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ProductCard from "../components/ProductCard"
import LoadingScreen from "../components/LoadingScreen"
import { countries } from "../utils/countries"

const Shop = () => {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    search: "",
    country: "all",
    minPrice: "",
    maxPrice: "",
  })
  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await getAllProducts()
      setProducts(response.data)
      setFilteredProducts(response.data)
    } catch (error) {
      console.error("Error fetching products:", error)
      toast({
        title: "Error",
        description: "Failed to load products",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    applyFilters()
  }, [filters, products])

  const applyFilters = () => {
    let result = [...products]

    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(searchLower) ||
          product.desc.toLowerCase().includes(searchLower) ||
          product.store_name.toLowerCase().includes(searchLower),
      )
    }

    if (filters.country && filters.country !== "all") {
      result = result.filter((product) => product.country === filters.country)
    }

    if (filters.minPrice) {
      result = result.filter((product) => product.price >= Number.parseFloat(filters.minPrice))
    }

    if (filters.maxPrice) {
      result = result.filter((product) => product.price <= Number.parseFloat(filters.maxPrice))
    }

    setFilteredProducts(result)
  }

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }))
  }

  const clearFilters = () => {
    setFilters({
      search: "",
      country: "all",
      minPrice: "",
      maxPrice: "",
    })
  }

  if (loading) {
    return <LoadingScreen />
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Shop Products</h1>

      {/* Dedicated Search Bar */}
      <div className="mb-8">
        <Input
          placeholder="Search products by name, description, or store..."
          value={filters.search}
          onChange={(e) => handleFilterChange("search", e.target.value)}
          className="w-full max-w-lg"
        />
      </div>

      {/* Filters Section */}
      <div className="mb-8 space-y-4">
        <div className="flex gap-4">
          <Select value={filters.country} onValueChange={(value) => handleFilterChange("country", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Countries</SelectItem>
              {countries.map((country) => (
                <SelectItem key={country.code} value={country.name}>
                  {country.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            type="number"
            placeholder="Min Price"
            value={filters.minPrice}
            onChange={(e) => handleFilterChange("minPrice", e.target.value)}
          />
          <Input
            type="number"
            placeholder="Max Price"
            value={filters.maxPrice}
            onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
          />

          <Button onClick={clearFilters}>Clear Filters</Button>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
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

      {filteredProducts.length === 0 && (
        <p className="text-center text-muted-foreground mt-8">No products found matching your criteria.</p>
      )}
    </div>
  )
}

export default Shop