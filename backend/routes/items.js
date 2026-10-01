const express = require('express')
const { query } = require('../database')
const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const result = await query('SELECT * FROM items ORDER BY created_at DESC')
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const result = await query('SELECT * FROM items WHERE id = $1', [req.params.id])
    if (result.rows.length === 0) return res.status(404).json({ error: 'Item not found' })
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/', async (req, res) => {
  try {
    const { id, name, unit, rate, category, notes } = req.body

    if (!name) return res.status(400).json({ error: 'Item name is required' })

    const itemId = id || 'item-' + Date.now()

    await query(
      `INSERT INTO items (id, name, unit, rate, category, notes)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (id) DO UPDATE SET
         name = EXCLUDED.name,
         unit = EXCLUDED.unit,
         rate = EXCLUDED.rate,
         category = EXCLUDED.category,
         notes = EXCLUDED.notes,
         updated_at = NOW()`,
      [itemId, name, unit || 'kg', rate || 0, category || 'Vegetable', notes || null]
    )

    res.status(201).json({ success: true, id: itemId })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const { name, unit, rate, category, notes } = req.body
    await query(
      `UPDATE items SET name = $1, unit = $2, rate = $3, category = $4, notes = $5, updated_at = NOW()
       WHERE id = $6`,
      [name, unit || 'kg', rate || 0, category || 'Vegetable', notes || null, req.params.id]
    )
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    await query('DELETE FROM items WHERE id = $1', [req.params.id])
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
