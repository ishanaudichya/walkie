'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowRight, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"
import { isAuthenticated } from '@/lib/auth'

export default function SignupPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [nickname, setNickname] = useState('')

  useEffect(() => {
    // If already authenticated, redirect to dashboard
    if (isAuthenticated()) {
      router.replace('/dashboard')
    }
  }, [router])

  const steps = [
    {
      title: "Welcome to your own Goofie Walkie Talkie app!",
      content: (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold mb-4 text-white">Hello there!</h1>
          <p className="text-xl text-white">Ready to join the goofiest communication revolution?</p>
        </motion.div>
      )
    },
    {
      title: "Let's start with your email",
      content: (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.5 }}
        >
          <Label htmlFor="email" className="text-white">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2"
          />
        </motion.div>
      )
    },
    {
      title: "Choose a fun nickname!",
      content: (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.5 }}
        >
          <Label htmlFor="nickname" className="text-white">Nickname</Label>
          <Input
            id="nickname"
            type="text"
            placeholder="What should we call you?"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="mt-2"
          />
        </motion.div>
      )
    },
    {
      title: "Now, create a secret password",
      content: (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.5 }}
        >
          <Label htmlFor="password" className="text-white">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Shh... it's a secret!"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2"
          />
        </motion.div>
      )
    },
    {
      title: "Confirm your secret password",
      content: (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.5 }}
        >
          <Label htmlFor="confirmPassword" className="text-white">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Type it once more!"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mt-2"
          />
        </motion.div>
      )
    }
  ]

  const nextStep = () => setStep((prev) => Math.min(prev + 1, steps.length - 1))
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 0))

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    try {
      setIsLoading(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, nickname }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed')
      }

      // Store token in localStorage
      localStorage.setItem('token', data.token)
      
      toast.success('Registration successful!')
      router.push('/dashboard') // Redirect to dashboard
    } catch (error: any) {
      toast.error(error.message || 'Failed to register')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center overflow-hidden relative">
      <Toaster />
      <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 animate-gradient-x"></div>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white bg-opacity-20 backdrop-blur-lg p-8 rounded-lg shadow-2xl w-full max-w-md relative z-10"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold mb-4 text-center text-white">{steps[step].title}</h2>
            {steps[step].content}
          </motion.div>
        </AnimatePresence>

        <div className="mt-8 flex justify-between">
          <Button
            onClick={prevStep}
            disabled={step === 0}
            variant="outline"
            className="bg-white bg-opacity-50 text-primary hover:bg-white hover:bg-opacity-70"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <Button
            onClick={step === steps.length - 1 ? handleSignup : nextStep}
            disabled={isLoading}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {step === steps.length - 1 ? 'Sign Up' : 'Next'} <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </motion.div>
    </div>
  )
}