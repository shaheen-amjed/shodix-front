import axios from "axios"
import Cookies from 'js-cookie'

// Use environment variables for API URL to support different environments
const API_URL = "https://shodix-api-node-g4n1l.sevalla.app"

// Create axios instance with consistent configuration
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  // Ensure withCredentials is consistently false as requested
  withCredentials: false,
})

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Helper function for form data
const createFormData = (data) => {
  const formData = new FormData()
  Object.keys(data).forEach((key) => {
    if (data[key] !== undefined) {
      formData.append(key, data[key])
    }
  })
  return formData
}

export const getStoreStats = (storeId) => api.get(`/api/store/stats/${storeId}`)
export const getTopSellingProducts = (storeId) => api.get(`/api/store/top-products/${storeId}`)
export const updateProductStock = (productId, newStock) =>
  api.patch(`/api/product/update-stock/${productId}`, { stock: newStock })
// Auth APIs
export const registerUser = (userData) => api.post("/api/user/reg", userData)
export const loginUser = (credentials) => api.post("/api/user/log", credentials)
export const updateUser = (userData) => api.patch("/api/user/update", userData)

export const registerStore = (storeData) => {
  const formData = createFormData(storeData)
  return api.post("/api/store/reg", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
}

export const loginStore = (credentials) => api.post("/api/store/log", credentials)
export const updateStore = (storeData) => {
  const formData = createFormData(storeData)
  return api.patch("/api/store/update", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
}

export const checkIsStoreOwner = (storeName) => api.post("/api/is/owner", { store_see: storeName })

// Product APIs
export const getAllProducts = () => api.get("/api/product/get/it/all")
export const getProduct = (productId) => api.get(`/api/product/${productId}`)
export const getStoreProducts = (storeId) => api.get(`/api/product/store/${storeId}`)

export const addProduct = (productData) => {
  const formData = createFormData(productData)
  return api.post("/api/product/add", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
}

export const updateProduct = (productData) => {
  const formData = createFormData(productData)
  return api.patch("/api/product/update", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
}

export const deleteProduct = (productId) => api.delete("/api/product/delete", { data: { product_id: productId } })

// Store APIs
export const getStore = (storeName) => api.get(`/api/store/${storeName}`)
export const followStore = (storeId, storeName) => api.post("/api/follow", { store_id: storeId, store_name: storeName })
export const getFollowersCount = (storeId) => api.get(`/api/follow?store_id=${storeId}`)
export const checkIsFollowing = (storeId) => api.post("/is/follow", { store_id: storeId })

// Cart APIs
export const getCart = () => api.get("/api/cart")
export const addToCart = (cartData) => api.post("/api/cart/add", cartData)
export const updateCart = (cartData) => api.patch("/api/cart/update", cartData)
export const deleteCartItem = (cartId) => api.delete("/api/cart/delete", { data: { cart_id: cartId } })

// Order APIs
export const addOrder = (orderData) => api.post("/api/order/add", orderData)
export const getStoreOrders = () => api.post("/api/order/see")
export const completeOrder = (orderId) => api.post("/api/order/done", { order_id: orderId })

// Message APIs - Fixed to use the main api instance instead of direct axios calls
export const getInbox = () => api.post("/api/inbox")
export const getMessages = (chatId) => api.get(`/api/msg/get/${chatId}`)
export const sendMessage = (chatId, message) => api.post(`/api/msg/add/${chatId}`, { msg: message })

export default api

