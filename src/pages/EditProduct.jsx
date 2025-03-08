"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { getProduct, updateProduct, deleteProduct } from "../lib/api"
import { useAuth } from "../contexts/AuthContext"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const EditProduct = () => {
  const { id } = useParams()
  const { store } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: "",
    desc: "",
    price: "",
    stock: "",
    country: "",
    productImg: null,
  })
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getProduct(id)
        const product = response.data
        setFormData({
          name: product.name,
          desc: product.desc,
          price: product.price.toString(),
          stock: product.stock.toString(),
          country: product.country,
          productImg: null,
        })
      } catch (error) {
        console.error("Error fetching product:", error)
        toast({
          title: "Error",
          description: "Failed to load product details",
          variant: "destructive",
        })
        navigate("/store/profile")
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id, toast, navigate])

  const handleChange = (e) => {
    const { name, value, files } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setUpdating(true)

    try {
      await updateProduct({
        product_id: id,
        ...formData,
        price: Number.parseFloat(formData.price),
        stock: Number.parseInt(formData.stock),
      })
      toast({
        title: "Product Updated",
        description: "Your product has been successfully updated.",
      })
      navigate("/store/profile")
    } catch (error) {
      console.error("Update product error:", error)
      toast({
        title: "Error",
        description: error.response?.data?.msg || "An error occurred while updating the product",
        variant: "destructive",
      })
    } finally {
      setUpdating(false)
    }
  }

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(id)
        toast({
          title: "Product Deleted",
          description: "Your product has been successfully deleted.",
        })
        navigate("/store/profile")
      } catch (error) {
        console.error("Delete product error:", error)
        toast({
          title: "Error",
          description: error.response?.data?.msg || "An error occurred while deleting the product",
          variant: "destructive",
        })
      }
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading product details...</div>
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
          <h1 className="text-3xl font-bold">Edit Product</h1>
          <p className="text-muted-foreground mt-2">Update your product details</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Product Name</Label>
            <Input id="name" name="name" type="text" required value={formData.name} onChange={handleChange} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="desc">Description</Label>
            <Textarea id="desc" name="desc" required value={formData.desc} onChange={handleChange} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              name="price"
              type="number"
              step="0.01"
              required
              value={formData.price}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="stock">Stock</Label>
            <Input id="stock" name="stock" type="number" required value={formData.stock} onChange={handleChange} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Input id="country" name="country" type="text" required value={formData.country} onChange={handleChange} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="productImg">Product Image (leave blank to keep current)</Label>
            <Input id="productImg" name="productImg" type="file" accept="image/*" onChange={handleChange} />
          </div>

          <div className="flex justify-between">
            <Button type="submit" disabled={updating}>
              {updating ? "Updating Product..." : "Update Product"}
            </Button>
            <Button type="button" variant="destructive" onClick={handleDelete}>
              Delete Product
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default EditProduct

