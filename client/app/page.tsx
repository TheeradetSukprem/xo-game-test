'use client'

import { useUser } from '@auth0/nextjs-auth0/client'
import { useEffect, useState } from 'react'
import Login from './components/Login'
import Game from './components/Game'
import ScoreBoard from './components/ScoreBoard'
import AdminPanel from './components/AdminPanel'

interface UserProfile {
  id: string
  name: string
  email: string
  score: number
  winStreak: number
  totalWins: number
  totalLosses: number
}

export default function Home() {
  const { user, isLoading } = useUser()
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [showAdmin, setShowAdmin] = useState(false)

  useEffect(() => {
    if (user) {
      initializeUser()
    }
  }, [user])

  const initializeUser = async () => {
    try {
      const response = await fetch('/api/user/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user?.email,
          name: user?.name || user?.email,
        }),
      })

      const data = await response.json()
      if (data.success) {
        setUserProfile(data.user)
      }
    } catch (error) {
      console.error('Error initializing user:', error)
    }
  }

  const updateUserProfile = async () => {
    try {
      const response = await fetch('/api/user/score')
      const data = await response.json()

      if (data.success) {
        setUserProfile((prev) => prev ? ({
          ...prev,
          ...data.score,
        }) : null)
      }
    } catch (error) {
      console.error('Error updating profile:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-white gap-4">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    )
  }

  if (!user) {
    return <Login />
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white/10 backdrop-blur-lg px-8 py-6 flex justify-between items-center shadow-lg">
        <h1 className="text-white text-3xl font-bold">XO Game - Tic-Tac-Toe</h1>
        <div className="flex gap-4 items-center">
          <button
            className="bg-white text-primary px-6 py-3 rounded-lg font-semibold transition-all hover:-translate-y-0.5 hover:shadow-xl"
            onClick={() => setShowAdmin(!showAdmin)}
          >
            {showAdmin ? 'Play Game' : 'View All Scores'}
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center p-8 gap-8">
        {userProfile && <ScoreBoard userProfile={userProfile} />}

        {showAdmin ? (
          <AdminPanel />
        ) : (
          <Game onGameEnd={updateUserProfile} />
        )}
      </main>
    </div>
  )
}
