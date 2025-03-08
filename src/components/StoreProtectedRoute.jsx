import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import LoadingScreen from "./LoadingScreen"

const StoreProtectedRoute = () => {
  const { store, loading } = useAuth()

  if (loading) {
    return <LoadingScreen />
  }

  if (!store) {
    return <Navigate to="/store/login" replace />
  }

  return <Outlet />
}

export default StoreProtectedRoute

