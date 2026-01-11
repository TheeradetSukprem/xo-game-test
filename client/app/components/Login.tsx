'use client'

export default function Login() {
  const handleLogin = () => {
    window.location.href = '/api/auth/login'
  }

  return (
    <div className="flex justify-center items-center min-h-screen p-8">
      <div className="bg-white rounded-3xl p-12 max-w-lg w-full shadow-2xl">
        <h1 className="text-5xl font-extrabold text-primary mb-2">XO Game</h1>
        <h2 className="text-2xl text-primary-dark mb-4">Tic-Tac-Toe</h2>
        <p className="text-gray-600 text-lg mb-8">
          Challenge the bot and climb the leaderboard!
        </p>

        <div className="flex flex-col gap-4 mb-8">
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
            <span className="text-3xl">🎮</span>
            <span className="text-gray-800 font-medium">Play against AI</span>
          </div>
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
            <span className="text-3xl">🏆</span>
            <span className="text-gray-800 font-medium">Earn points & streaks</span>
          </div>
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
            <span className="text-3xl">📊</span>
            <span className="text-gray-800 font-medium">Track your progress</span>
          </div>
        </div>

        <button
          className="w-full bg-gradient-main text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all hover:-translate-y-0.5 hover:shadow-2xl mb-6"
          onClick={handleLogin}
        >
          Login to Play
        </button>

        <div className="pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-400 text-center">
            Secure authentication with OAuth 2.0
          </p>
        </div>
      </div>
    </div>
  )
}
