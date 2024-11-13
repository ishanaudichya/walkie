'use client'

import { Button } from "@/components/ui/button"
import { logout } from "@/lib/auth"
export default function DashboardPage() {
  return (
    
      <div className="min-h-screen bg-gradient-to-r from-blue-400 to-purple-500 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-white">Dashboard</h1>
            <Button
              variant="outline"
              onClick={logout}
              className="bg-white/20 text-white hover:bg-white/30"
            >
              Logout
            </Button>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Welcome to your Goofie Walkie Talkie Dashboard!
            </h2>
            <p className="text-white/90">
              Your secure dashboard is ready. More features coming soon!
            </p>
          </div>
        </div>
      </div>
  )
} 