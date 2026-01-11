require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { auth } = require('express-oauth2-jwt-bearer');
const {
  getOrCreateUser,
  getUserScore,
  getAllScores,
  updateScore,
  saveGameHistory
} = require('./database');
const { makeMove } = require('./gameLogic');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const checkJwt = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

app.use('/api', checkJwt);

app.post('/api/user/profile', (req, res) => {
  try {
    const userId = req.auth.payload.sub;
    const { email, name } = req.body;

    getOrCreateUser(userId, email, name);
    const score = getUserScore(userId);

    res.json({
      success: true,
      user: {
        id: userId,
        email,
        name,
        score: score.score || 0,
        winStreak: score.win_streak || 0,
        totalWins: score.total_wins || 0,
        totalLosses: score.total_losses || 0
      }
    });
  } catch (error) {
    console.error('Error creating/getting user:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/user/score', (req, res) => {
  try {
    const userId = req.auth.payload.sub;
    const score = getUserScore(userId);

    if (!score) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.json({
      success: true,
      score: {
        score: score.score || 0,
        winStreak: score.win_streak || 0,
        totalWins: score.total_wins || 0,
        totalLosses: score.total_losses || 0
      }
    });
  } catch (error) {
    console.error('Error getting score:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/game/move', (req, res) => {
  try {
    const userId = req.auth.payload.sub;
    const { board, position } = req.body;

    if (!Array.isArray(board) || board.length !== 9) {
      return res.status(400).json({ success: false, error: 'Invalid board state' });
    }

    if (typeof position !== 'number' || position < 0 || position > 8) {
      return res.status(400).json({ success: false, error: 'Invalid position' });
    }

    const result = makeMove(board, position);

    if (result.gameOver) {
      let gameResult = 'draw';
      if (result.winner === 'X') {
        gameResult = 'win';
      } else if (result.winner === 'O') {
        gameResult = 'loss';
      }

      const scoreUpdate = updateScore(userId, gameResult);
      saveGameHistory(userId, gameResult, result.board);

      res.json({
        success: true,
        ...result,
        scoreUpdate
      });
    } else {
      res.json({
        success: true,
        ...result
      });
    }
  } catch (error) {
    console.error('Error making move:', error);
    res.status(400).json({ success: false, error: error.message });
  }
});

app.get('/api/admin/scores', (req, res) => {
  try {
    const scores = getAllScores();
    res.json({
      success: true,
      scores: scores.map(s => ({
        userId: s.user_id,
        name: s.name,
        email: s.email,
        score: s.score || 0,
        winStreak: s.win_streak || 0,
        totalWins: s.total_wins || 0,
        totalLosses: s.total_losses || 0,
        updatedAt: s.updated_at
      }))
    });
  } catch (error) {
    console.error('Error getting all scores:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
