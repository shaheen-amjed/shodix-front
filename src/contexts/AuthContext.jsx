"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { jwtDecode } from "jwt-decode"
import Cookies from "js-cookie"

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [store, setStore] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = Cookies.get("token")
    if (token) {
      try {
        const decoded = jwtDecode(token)

        // Check if token is expired
        const currentTime = Date.now() / 1000
        if (decoded.exp < currentTime) {
          Cookies.remove("token")
          setUser(null)
          setStore(null)
        } else {
          // Check if it's a user or store token
          if (decoded.user_id) {
            setUser(decoded)
          } else if (decoded.store_id) {
            setStore(decoded)
          }
        }
      } catch (error) {
        console.error("Invalid token:", error)
        Cookies.remove("token")
      }
    }
    setLoading(false)
  }, [])

  const login = (token, isStore = false) => {
    Cookies.set("token", token, { expires: 7 }) // Set cookie to expire in 7 days
    const decoded = jwtDecode(token)
    if (isStore) {
      setStore(decoded)
      setUser(null)
    } else {
      setUser(decoded)
      setStore(null)
    }
  }

  const logout = () => {
    Cookies.remove("token")
    setUser(null)
    setStore(null)
  }

  const value = {
    user,
    store,
    isAuthenticated: !!user || !!store,
    isUser: !!user,
    isStore: !!store,
    login,
    logout,
    loading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

