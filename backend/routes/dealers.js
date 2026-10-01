const express = require('express')
const { query } = require('../database')
const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const result = await query('SELECT * FROM dealers ORDER BY created_at DESC')
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const result = await query('SELECT * FROM dealers WHERE id = $1', [req.params.id])
    if (result.rows.length === 0) return res.status(404).json({ error: 'Dealer not found' })
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/', async (req, res) => {
  try {
    const { id, name, phone, address, city, notes } = req.body

    if (!name) return res.status(400).json({ error: 'Dealer name is required' })

    const dealerId = id || 'dealer-' + Date.now()

    await query(
      `INSERT INTO dealers (id, name, phone, address, city, notes)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (id) DO UPDATE SET
         name = EXCLUDED.name,
         phone = EXCLUDED.phone,
         address = EXCLUDED.address,
         city = EXCLUDED.city,
         notes = EXCLUDED.notes,
         updated_at = NOW()`,
      [dealerId, name, phone || null, address || null, city || null, notes || null]
    )

    res.status(201).json({ success: true, id: dealerId })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const { name, phone, address, city, notes } = req.body
    await query(
      `UPDATE dealers SET name = $1, phone = $2, address = $3, city = $4, notes = $5, updated_at = NOW()
       WHERE id = $6`,
      [name, phone || null, address || null, city || null, notes || null, req.params.id]
    )
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    await query('DELETE FROM dealers WHERE id = $1', [req.params.id])
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
