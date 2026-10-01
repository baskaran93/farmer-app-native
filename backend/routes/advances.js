const express = require('express')
const { query } = require('../database')
const router = express.Router()

// Get all advances
router.get('/', async (req, res) => {
  try {
    const result = await query('SELECT * FROM advances ORDER BY date DESC')
    res.json(result.rows)
  } catch (err) {
    console.error('GET /advances error:', err)
    res.status(500).json({ error: err.message, advances: [] })
  }
})

// Get single advance
router.get('/:id', async (req, res) => {
  try {
    const result = await query('SELECT * FROM advances WHERE id = $1', [req.params.id])
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Advance not found' })
    }
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Add advance
router.post('/', async (req, res) => {
  try {
    const { id, date, amount, description } = req.body

    if (!id || !date || !amount) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    await query(
      `INSERT INTO advances (id, date, amount, description)
       VALUES ($1, $2, $3, $4)`,
      [id, date, amount, description || 'Advance']
    )

    res.status(201).json({ success: true, id })
  } catch (err) {
    console.error('POST /advances error:', err)
    res.status(500).json({ error: err.message })
  }
})

// Update advance
router.put('/:id', async (req, res) => {
  try {
    const { date, amount, description } = req.body

    await query(
      `UPDATE advances SET date = $1, amount = $2, description = $3, updated_at = NOW()
       WHERE id = $4`,
      [date, amount, description, req.params.id]
    )

    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Delete advance
router.delete('/:id', async (req, res) => {
  try {
    await query('DELETE FROM advances WHERE id = $1', [req.params.id])
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
