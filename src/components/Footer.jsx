import { Link } from "react-router-dom"
import { Facebook, Twitter, Instagram, Github } from "lucide-react"

const Footer = () => {
  return (
    <footer className="border-t py-8 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">Shodix</h3>
            <p className="text-muted-foreground">
              Your one-stop shop for all your needs. Find products from stores around the world.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/shop" className="text-muted-foreground hover:text-foreground transition-colors">
                  Shop
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-muted-foreground hover:text-foreground transition-colors">
                  Cart
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">For Stores</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/store/register" className="text-muted-foreground hover:text-foreground transition-colors">
                  Register Your Store
                </Link>
              </li>
              <li>
                <Link to="/store/login" className="text-muted-foreground hover:text-foreground transition-colors">
                  Store Login
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Connect With Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-4 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Shodix. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

