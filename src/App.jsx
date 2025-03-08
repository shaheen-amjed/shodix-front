import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "./contexts/AuthContext"
import { CartProvider } from "./contexts/CartContext"
import Layout from "./components/Layout"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import StoreRegister from "./pages/StoreRegister"
import StoreLogin from "./pages/StoreLogin"
import ProductDetail from "./pages/ProductDetail"
import StoreDetail from "./pages/StoreDetail"
import Cart from "./pages/Cart"
import Profile from "./pages/Profile"
import StoreProfile from "./pages/StoreProfile"
import AddProduct from "./pages/AddProduct"
import EditProduct from "./pages/EditProduct"
import Orders from "./pages/Orders"
import Shop from "./pages/Shop"
import Inbox from "./pages/Inbox"
import Chat from "./pages/Chat"
import NotFound from "./pages/NotFound"
import ProtectedRoute from "./components/ProtectedRoute"
import StoreProtectedRoute from "./components/StoreProtectedRoute"

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="store/register" element={<StoreRegister />} />
              <Route path="store/login" element={<StoreLogin />} />
              <Route path="product/:id" element={<ProductDetail />} />
              <Route path="store/:storeName" element={<StoreDetail />} />
              <Route path="shop" element={<Shop />} />

              {/* Protected User Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="cart" element={<Cart />} />
                <Route path="profile" element={<Profile />} />
                <Route path="inbox" element={<Inbox />} />
                <Route path="chat/:storeName" element={<Chat />} />
              </Route>

              {/* Protected Store Routes */}
              <Route element={<StoreProtectedRoute />}>
                <Route path="store/profile" element={<StoreProfile />} />
                <Route path="store/add-product" element={<AddProduct />} />
                <Route path="store/edit-product/:id" element={<EditProduct />} />
                <Route path="store/orders" element={<Orders />} />
                <Route path="store/inbox" element={<Inbox storeView={true} />} />
                <Route path="store/chat/:username" element={<Chat storeView={true} />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
          <Toaster />
        </Router>
      </CartProvider>
    </AuthProvider>
  )
}

export default App

