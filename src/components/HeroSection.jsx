"use client"

import { useRef, Suspense } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, useGLTF, Environment } from "@react-three/drei"
import { Button } from "@/components/ui/button"

const Model = () => {
  const { scene } = useGLTF("/assets/3d/duck.glb")
  const modelRef = useRef()

  useFrame((state) => {
    if (modelRef.current) {
      modelRef.current.rotation.y += 0.01
    }
  })

  return <primitive ref={modelRef} object={scene} scale={2} position={[0, -1, 0]} />
}

const HeroSection = () => {
  return (
    <section className="relative h-[80vh] overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
          <pointLight position={[-10, -10, -10]} />
          <Suspense fallback={null}>
            <Model />
            <Environment preset="city" />
          </Suspense>
          <OrbitControls enableZoom={false} enablePan={false} />
        </Canvas>
      </div>

      <div className="relative z-10 container mx-auto h-full flex flex-col justify-center items-start px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-xl bg-background/80 backdrop-blur-sm p-8 rounded-lg"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Shop Globally, <span className="text-primary">Buy Locally</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Discover unique products from stores around the world. Shodix connects you with sellers from every corner of
            the globe.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/shop">
              <Button size="lg">Start Shopping</Button>
            </Link>
            <Link to="/register">
              <Button variant="outline" size="lg">
                Sign Up
              </Button>
            </Link>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">Created By: Shaheen Amjed</p>
        </motion.div>
      </div>
    </section>
  )
}

export default HeroSection

