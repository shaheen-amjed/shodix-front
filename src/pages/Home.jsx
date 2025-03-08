"use client";

import { useState, useEffect, Suspense } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { getAllProducts } from "../lib/api";
import { Button } from "@/components/ui/button";
import ProductCard from "../components/ProductCard";
import HeroSection from "../components/HeroSection";
import LoadingScreen from "../components/LoadingScreen";
import Footer from "../components/Footer";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getAllProducts();
        // Get the last 3 products for the homepage
        setProducts(response.data.slice(-3));
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <div className="space-y-12">
        <Suspense fallback={<LoadingScreen />}>
          <HeroSection />
        </Suspense>

        <section className="py-8">
          <div className="container mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold">Latest Products</h2>
              <Link to="/shop">
                <Button variant="outline">View All</Button>
              </Link>
            </div>

            {/* Update grid layout to show only 3 products */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {products.map((product) => (
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
          </div>
        </section>

        <section className="py-12 bg-muted">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Become a Seller</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join our marketplace and start selling your products to customers worldwide. Register your store today and
              grow your business with Shodix.
            </p>
            <Link to="/store/register">
              <Button size="lg">Register Your Store</Button>
            </Link>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default Home;