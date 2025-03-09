"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { ShoppingCart, User, Store, LogOut, Menu, X, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "../contexts/AuthContext"
import { useCart } from "../contexts/CartContext"
import ThemeToggle from "./ThemeToggle"
import Logo from "./Logo"

const Navbar = () => {
  const { user, store, isAuthenticated, logout } = useAuth()
  const { cartCount } = useCart()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate("/")
    setIsMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex items-center justify-between h-16">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <Logo />
            <span className="text-xl font-bold">Shodix</span>
          </Link>
        </div>

        <nav className="items-center hidden gap-4 md:flex">
          <ThemeToggle />

          {user && (
            <>
              <Link to="/shop">
                <Button variant="ghost">Shop</Button>
              </Link>
              <Link to="/inbox">
                <Button variant="ghost" size="icon">
                  <MessageSquare className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/cart">
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingCart className="w-5 h-5" />
                  {cartCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute flex items-center justify-center w-5 h-5 text-xs rounded-full -top-1 -right-1 bg-primary text-primary-foreground"
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </Button>
              </Link>
              <Link to="/profile">
                <Button variant="ghost" size="icon">
                  <User className="w-5 h-5" />
                </Button>
              </Link>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="w-5 h-5" />
              </Button>
            </>
          )}

          {store && (
            <>
              <Link to="/store/inbox">
                <Button variant="ghost" size="icon">
                  <MessageSquare className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/store/profile">
                <Button variant="ghost" size="icon">
                  <Store className="w-5 h-5" />
                </Button>
              </Link>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="w-5 h-5" />
              </Button>
            </>
          )}

          {!isAuthenticated && (
            <>
              <Link to="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link to="/register">
                <Button>Sign Up</Button>
              </Link>
            </>
          )}
        </nav>

        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </Button>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="fixed inset-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden"
        >
          <div className="container h-full p-4">
            <div className="flex justify-end">
              <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(false)}>
                <X className="w-6 h-6" />
              </Button>
            </div>

            <div className="grid gap-2">
              {user && (
                <>
                  <Link to="/shop" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" className="justify-start w-full">
                      Shop
                    </Button>
                  </Link>
                  <Link to="/inbox" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" className="justify-start w-full">
                      <MessageSquare className="w-5 h-5 mr-2" /> Messages
                    </Button>
                  </Link>
                  <Link to="/cart" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" className="justify-start w-full">
                      <ShoppingCart className="w-5 h-5 mr-2" /> Cart {cartCount > 0 && `(${cartCount})`}
                    </Button>
                  </Link>
                  <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" className="justify-start w-full">
                      <User className="w-5 h-5 mr-2" /> Profile
                    </Button>
                  </Link>
                  <Button variant="ghost" className="justify-start w-full" onClick={handleLogout}>
                    <LogOut className="w-5 h-5 mr-2" /> Logout
                  </Button>
                </>
              )}

              {store && (
                <>
                  <Link to="/store/inbox" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" className="justify-start w-full">
                      <MessageSquare className="w-5 h-5 mr-2" /> Messages
                    </Button>
                  </Link>
                  <Link to="/store/profile" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" className="justify-start w-full">
                      <Store className="w-5 h-5 mr-2" /> Store Dashboard
                    </Button>
                  </Link>
                  <Link to="/store/orders" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" className="justify-start w-full">
                      Orders
                    </Button>
                  </Link>
                  <Link to="/store/add-product" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" className="justify-start w-full">
                      Add Product
                    </Button>
                  </Link>
                  <Button variant="ghost" className="justify-start w-full" onClick={handleLogout}>
                    <LogOut className="w-5 h-5 mr-2" /> Logout
                  </Button>
                </>
              )}

              {!isAuthenticated && (
                <>
                  <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" className="w-full">
                      Login
                    </Button>
                  </Link>
                  <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full">Sign Up</Button>
                  </Link>
                  <Link to="/store/login" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" className="w-full">
                      Store Login
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </header>
  )
}

export default Navbar

