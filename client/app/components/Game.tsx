'use client'

import { useState } from 'react'

interface GameProps {
  onGameEnd: () => void
}

type Cell = 'X' | 'O' | null

export default function Game({ onGameEnd }: GameProps) {
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null))
  const [isGameOver, setIsGameOver] = useState(false)
  const [winner, setWinner] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const handleCellClick = async (index: number) => {
    if (board[index] || isGameOver || isProcessing) return

    setIsProcessing(true)

    try {
      const response = await fetch('/api/game/move', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          board,
          position: index,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setBoard(data.board)

        if (data.gameOver) {
          setIsGameOver(true)
          setWinner(data.winner)

          if (data.winner === 'X') {
            const bonusMsg = data.scoreUpdate?.bonusPoints
              ? ` +${data.scoreUpdate.bonusPoints} bonus point for 3 wins in a row!`
              : ''
            setMessage(`🎉 You won!${bonusMsg}`)
          } else if (data.winner === 'O') {
            setMessage('😔 Bot wins! Try again!')
          } else {
            setMessage("🤝 It's a draw!")
          }

          onGameEnd()
        }
      }
    } catch (error) {
      console.error('Error making move:', error)
      setMessage('Error making move. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setIsGameOver(false)
    setWinner(null)
    setMessage('')
    setIsProcessing(false)
  }

  const getCellClass = (index: number) => {
    let baseClass = 'w-24 h-24 md:w-32 md:h-32 bg-white rounded-2xl shadow-lg flex items-center justify-center text-5xl md:text-6xl font-bold transition-all'

    if (!board[index] && !isGameOver) {
      baseClass += ' hover:bg-gray-50 hover:-translate-y-1 hover:shadow-xl cursor-pointer'
    }

    if (board[index] === 'X') {
      baseClass += ' text-blue-500'
    } else if (board[index] === 'O') {
      baseClass += ' text-red-500'
    }

    if (isGameOver || isProcessing) {
      baseClass += ' cursor-not-allowed'
    }

    return baseClass
  }

  return (
    <div className="bg-white rounded-2xl p-8 shadow-xl">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Play Tic-Tac-Toe</h2>
        <p className="text-gray-600">You are <span className="text-blue-500 font-bold">X</span>, Bot is <span className="text-red-500 font-bold">O</span></p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {board.map((cell, index) => (
          <button
            key={index}
            className={getCellClass(index)}
            onClick={() => handleCellClick(index)}
            disabled={isGameOver || isProcessing || !!cell}
          >
            {cell}
          </button>
        ))}
      </div>

      {message && (
        <div className={`text-center p-4 rounded-xl mb-6 ${
          winner === 'X' ? 'bg-green-100 text-green-800' :
          winner === 'O' ? 'bg-red-100 text-red-800' :
          'bg-blue-100 text-blue-800'
        }`}>
          <p className="text-xl font-semibold">{message}</p>
        </div>
      )}

      {isGameOver && (
        <div className="text-center">
          <button
            className="bg-gradient-main text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all hover:-translate-y-0.5 hover:shadow-xl"
            onClick={resetGame}
          >
            Play Again
          </button>
        </div>
      )}

      {isProcessing && (
        <div className="text-center">
          <p className="text-gray-600">Bot is thinking...</p>
        </div>
      )}
    </div>
  )
}
