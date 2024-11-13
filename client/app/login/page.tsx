'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"
import { isAuthenticated } from '@/lib/auth'
import Cookies from 'js-cookie';

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  useEffect(() => {
    // Check authentication status
    const checkAuth = () => {
      if (isAuthenticated()) {
        router.replace('/dashboard');
      }
    };
    
    checkAuth();
  }, [router]); // Only depend on router

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  const handleLogin = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Login failed')
      }

      // Store token in cookie instead of localStorage
      Cookies.set('token', data.token, { 
        expires: 7, // 7 days
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production'
      });
      
      toast.success('Login successful!')
      router.replace('/dashboard')
    } catch (error: any) {
      toast.error(error.message || 'Failed to login')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center overflow-hidden relative p-4 sm:p-6 md:p-8">
      <Toaster />
      <div className="absolute inset-0 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 animate-gradient-x"></div>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-white bg-opacity-20 backdrop-blur-lg p-4 sm:p-6 md:p-8 rounded-lg shadow-2xl w-full max-w-md relative z-10"
      >
        <motion.h1
          variants={itemVariants}
          className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center text-white"
        >
          Welcome back to Goofie Walkie Talkie!
        </motion.h1>

        <motion.div variants={itemVariants} className="space-y-2">
          <Label htmlFor="email" className="text-white text-sm sm:text-base">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 text-sm sm:text-base"
          />
        </motion.div>

        <motion.div variants={itemVariants} className="mt-3 sm:mt-4 space-y-2">
          <Label htmlFor="password" className="text-white text-sm sm:text-base">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Your secret code"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 text-sm sm:text-base"
          />
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="mt-4 sm:mt-6"
        >
          <Button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 text-sm sm:text-base py-2 sm:py-2.5"
          >
            {isLoading ? 'Logging in...' : 'Log In'} <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </motion.div>

        <motion.p
          variants={itemVariants}
          className="mt-3 sm:mt-4 text-center text-xs sm:text-sm text-white"
        >
          Don't have an account?{' '}
          <a href="/signup" className="text-blue-200 hover:underline">
            Sign up here
          </a>
        </motion.p>
      </motion.div>
    </div>
  )
}