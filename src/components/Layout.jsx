import { Outlet } from "react-router-dom"
import Navbar from "./Navbar"
import Footer from "./Footer"
import { useAuth } from "../contexts/AuthContext"
import LoadingScreen from "./LoadingScreen"

const Layout = () => {
  const { loading } = useAuth()

  if (loading) {
    return <LoadingScreen />
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout

