'use client'

import { useEffect, useState } from 'react'

interface Score {
  userId: string
  name: string
  email: string
  score: number
  winStreak: number
  totalWins: number
  totalLosses: number
  updatedAt: string
}

export default function AdminPanel() {
  const [scores, setScores] = useState<Score[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchScores()
  }, [])

  const fetchScores = async () => {
    try {
      const response = await fetch('/api/admin/scores')
      const data = await response.json()

      if (data.success) {
        setScores(data.scores)
      }
    } catch (error) {
      console.error('Error fetching scores:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-8 w-full max-w-6xl shadow-xl">
        <div className="flex justify-center items-center py-12">
          <div className="loading-spinner"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl p-8 w-full max-w-6xl shadow-xl">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">All Player Scores</h2>
        <button
          onClick={fetchScores}
          className="bg-gradient-main text-white px-6 py-3 rounded-lg font-semibold transition-all hover:-translate-y-0.5 hover:shadow-xl"
        >
          Refresh
        </button>
      </div>

      {scores.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No players yet</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-4 px-4 text-gray-600 font-semibold">Rank</th>
                <th className="text-left py-4 px-4 text-gray-600 font-semibold">Player</th>
                <th className="text-center py-4 px-4 text-gray-600 font-semibold">Score</th>
                <th className="text-center py-4 px-4 text-gray-600 font-semibold">Streak</th>
                <th className="text-center py-4 px-4 text-gray-600 font-semibold">Wins</th>
                <th className="text-center py-4 px-4 text-gray-600 font-semibold">Losses</th>
                <th className="text-center py-4 px-4 text-gray-600 font-semibold">W/L Ratio</th>
              </tr>
            </thead>
            <tbody>
              {scores.map((score, index) => {
                const ratio = score.totalLosses === 0
                  ? score.totalWins.toFixed(2)
                  : (score.totalWins / score.totalLosses).toFixed(2)

                const isTopThree = index < 3

                return (
                  <tr
                    key={score.userId}
                    className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                      isTopThree ? 'bg-gradient-to-r from-yellow-50 to-transparent' : ''
                    }`}
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        {isTopThree && (
                          <span className="text-2xl">
                            {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                          </span>
                        )}
                        <span className="font-semibold text-gray-700">{index + 1}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <div className="font-semibold text-gray-800">{score.name}</div>
                        <div className="text-sm text-gray-500">{score.email}</div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="inline-block bg-gradient-main text-white px-4 py-2 rounded-lg font-bold">
                        {score.score}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className={`font-semibold ${
                        score.winStreak >= 2 ? 'text-yellow-600' : 'text-gray-700'
                      }`}>
                        {score.winStreak}
                        {score.winStreak >= 2 && ' 🔥'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="text-green-600 font-semibold">{score.totalWins}</span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="text-red-600 font-semibold">{score.totalLosses}</span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="text-gray-700 font-semibold">{ratio}</span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
