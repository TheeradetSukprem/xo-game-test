'use client'

import { useUser } from '@auth0/nextjs-auth0/client'

interface UserProfile {
  score: number
  winStreak: number
  totalWins: number
  totalLosses: number
}

interface ScoreBoardProps {
  userProfile: UserProfile
}

export default function ScoreBoard({ userProfile }: ScoreBoardProps) {
  const { user } = useUser()

  const handleLogout = () => {
    window.location.href = '/api/auth/logout'
  }

  return (
    <div className="bg-white rounded-2xl p-8 w-full max-w-4xl shadow-xl">
      <div className="flex items-center gap-6 mb-8 pb-6 border-b-2 border-gray-100">
        <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-main flex items-center justify-center">
          {user?.picture ? (
            <img src={user.picture} alt={user.name || ''} className="w-full h-full object-cover" />
          ) : (
            <div className="text-white text-2xl font-bold">
              {(user?.name || user?.email || 'U')[0].toUpperCase()}
            </div>
          )}
        </div>
        <div className="flex-1">
          <h3 className="text-gray-800 text-xl font-semibold mb-2">
            {user?.name || user?.email}
          </h3>
          <button
            className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg text-sm transition-all hover:bg-gray-200 hover:text-gray-800"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-gradient-main text-white rounded-xl p-6 text-center transition-all hover:-translate-y-1 hover:shadow-lg">
          <div className="text-4xl font-extrabold mb-2">{userProfile.score}</div>
          <div className="text-sm opacity-90 uppercase tracking-wider">Total Score</div>
        </div>

        <div className="bg-gray-50 rounded-xl p-6 text-center transition-all hover:-translate-y-1 hover:shadow-lg relative">
          <div className="text-4xl font-extrabold mb-2 text-primary">{userProfile.winStreak}</div>
          <div className="text-sm text-gray-600 uppercase tracking-wider">Win Streak</div>
          {userProfile.winStreak === 2 && (
            <div className="absolute -top-2 -right-2 bg-yellow-400 text-gray-800 px-3 py-1 rounded-xl text-xs font-bold shadow-md animate-pulse">
              One more for bonus!
            </div>
          )}
        </div>

        <div className="bg-gradient-success text-white rounded-xl p-6 text-center transition-all hover:-translate-y-1 hover:shadow-lg">
          <div className="text-4xl font-extrabold mb-2">{userProfile.totalWins}</div>
          <div className="text-sm opacity-90 uppercase tracking-wider">Wins</div>
        </div>

        <div className="bg-gradient-danger text-white rounded-xl p-6 text-center transition-all hover:-translate-y-1 hover:shadow-lg">
          <div className="text-4xl font-extrabold mb-2">{userProfile.totalLosses}</div>
          <div className="text-sm opacity-90 uppercase tracking-wider">Losses</div>
        </div>
      </div>
    </div>
  )
}
