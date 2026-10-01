const express = require('express')
const router = express.Router()
const { query } = require('../database')
const crypto = require('crypto')

function md5Hash(str) {
  return crypto.createHash('md5').update(str).digest('hex')
}

// Login route
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({ success: false, error: 'Username and password required' })
    }

    const result = await query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    )

    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, error: 'Invalid username or password' })
    }

    const user = result.rows[0]
    const hashedPassword = md5Hash(password)

    if (user.password !== hashedPassword && password !== user.password) {
      return res.status(401).json({ success: false, error: 'Invalid username or password' })
    }

    if (!user.is_active) {
      return res.status(403).json({ success: false, error: 'User account is inactive' })
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.full_name
      }
    })
  } catch (err) {
    console.error('Login error:', err)
    res.status(500).json({ success: false, error: 'Login failed' })
  }
})

// Register route
router.post('/register', async (req, res) => {
  try {
    const { username, password, email, fullName } = req.body

    if (!username || !password) {
      return res.status(400).json({ success: false, error: 'Username and password required' })
    }

    const checkResult = await query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    )

    if (checkResult.rows.length > 0) {
      return res.status(400).json({ success: false, error: 'Username already exists' })
    }

    const hashedPassword = md5Hash(password)
    const userId = 'user-' + Date.now()

    await query(
      `INSERT INTO users (id, username, password, email, full_name, is_active)
       VALUES ($1, $2, $3, $4, $5, TRUE)`,
      [userId, username, hashedPassword, email || null, fullName || username]
    )

    res.json({
      success: true,
      message: 'User created successfully',
      user: { id: userId, username, email, fullName: fullName || username }
    })
  } catch (err) {
    console.error('Register error:', err)
    res.status(500).json({ success: false, error: 'Registration failed' })
  }
})

module.exports = router
