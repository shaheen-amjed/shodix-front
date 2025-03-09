"use client"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { useCart } from "../contexts/CartContext"
import {
  LogInIcon as Logo,
  ToggleRightIcon as ThemeToggle,
  MessageSquare,
  ShoppingCart,
  User,
  LogOut,
  Menu,
  X,
  Store,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

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
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <Logo />
            <span className="font-bold text-xl">Shodix</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-4">
          <ThemeToggle />

          {user && (
            <>
              <Link to="/shop">
                <Button variant="ghost">Shop</Button>
              </Link>
              <Link to="/inbox">
                <Button variant="ghost" size="icon">
                  <MessageSquare className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/cart">
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  {cartCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center"
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </Button>
              </Link>
              <Link to="/profile">
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="h-5 w-5" />
              </Button>
            </>
          )}

          {store && (
            <>
              <Link to="/store/inbox">
                <Button variant="ghost" size="icon">
                  <MessageSquare className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/store/profile">
                <Button variant="ghost" size="icon">
                  <Store className="h-5 w-5" />
                </Button>
              </Link>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="h-5 w-5" />
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
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden p-4 border-t"
        >
          <div className="grid gap-2">
            {user && (
              <>
                <Link to="/shop" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">
                    Shop
                  </Button>
                </Link>
                <Link to="/inbox" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">
                    <MessageSquare className="h-5 w-5 mr-2" /> Messages
                  </Button>
                </Link>
                <Link to="/cart" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">
                    <ShoppingCart className="h-5 w-5 mr-2" /> Cart {cartCount > 0 && `(${cartCount})`}
                  </Button>
                </Link>
                <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">
                    <User className="h-5 w-5 mr-2" /> Profile
                  </Button>
                </Link>
                <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
                  <LogOut className="h-5 w-5 mr-2" /> Logout
                </Button>
              </>
            )}

            {store && (
              <>
                <Link to="/store/inbox" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">
                    <MessageSquare className="h-5 w-5 mr-2" /> Messages
                  </Button>
                </Link>
                <Link to="/store/profile" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">
                    <Store className="h-5 w-5 mr-2" /> Store Dashboard
                  </Button>
                </Link>
                <Link to="/store/orders" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">
                    Orders
                  </Button>
                </Link>
                <Link to="/store/add-product" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">
                    Add Product
                  </Button>
                </Link>
                <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
                  <LogOut className="h-5 w-5 mr-2" /> Logout
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
        </motion.div>
      )}
    </header>
  )
}

export default Navbar

