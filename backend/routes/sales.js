const express = require('express')
const { query } = require('../database')
const router = express.Router()

function normalizeRow(row) {
  if (!row) return row
  return {
    ...row,
    rate: row.rate !== null && row.rate !== undefined ? Number(row.rate) : null,
    firstKg: row.first_kg !== null && row.first_kg !== undefined ? Number(row.first_kg) : 0,
    secondKg: row.second_kg !== null && row.second_kg !== undefined ? Number(row.second_kg) : 0,
    firstAmount: row.first_amount !== null && row.first_amount !== undefined ? Number(row.first_amount) : 0,
    secondRate: row.second_rate !== null && row.second_rate !== undefined ? Number(row.second_rate) : 0,
    secondAmount: row.second_amount !== null && row.second_amount !== undefined ? Number(row.second_amount) : 0,
    totalAmount: row.total_amount !== null && row.total_amount !== undefined ? Number(row.total_amount) : 0,
  }
}

// Get all sales
router.get('/', async (req, res) => {
  try {
    const result = await query('SELECT * FROM sales ORDER BY date DESC')
    res.json(result.rows.map(normalizeRow))
  } catch (err) {
    console.error('GET /sales error:', err)
    res.status(500).json({ error: err.message, sales: [] })
  }
})

// Get sales by date
router.get('/date/:date', async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM sales WHERE date = $1',
      [req.params.date]
    )
    res.json(result.rows.map(normalizeRow))
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Get single sale
router.get('/:id', async (req, res) => {
  try {
    const result = await query('SELECT * FROM sales WHERE id = $1', [req.params.id])
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Sale not found' })
    }
    res.json(normalizeRow(result.rows[0]))
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Add sale
router.post('/', async (req, res) => {
  try {
    const {
      id,
      date,
      rate,
      firstKg,
      secondKg,
      firstAmount,
      secondRate,
      secondAmount,
      totalAmount,
      dealerId,
      dealerName,
      itemId,
      itemName,
      notes
    } = req.body

    if (!date || rate === undefined || firstKg === undefined || secondKg === undefined) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const saleId = id || 'sale-' + Date.now()

    await query(
      `INSERT INTO sales (
        id, date, rate, first_kg, second_kg, first_amount, second_rate, second_amount, total_amount,
        dealer_id, dealer_name, item_id, item_name, notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
      [
        saleId,
        date,
        Number(rate),
        Number(firstKg),
        Number(secondKg),
        Number(firstAmount || 0),
        Number(secondRate || 0),
        Number(secondAmount || 0),
        Number(totalAmount || 0),
        dealerId || null,
        dealerName || null,
        itemId || null,
        itemName || null,
        notes || null
      ]
    )

    res.status(201).json({ success: true, id: saleId })
  } catch (err) {
    console.error('POST /sales error:', err)
    res.status(500).json({ error: err.message })
  }
})

// Update sale
router.put('/:id', async (req, res) => {
  try {
    const {
      date,
      rate,
      firstKg,
      secondKg,
      firstAmount,
      secondRate,
      secondAmount,
      totalAmount,
      dealerId,
      dealerName,
      itemId,
      itemName,
      notes
    } = req.body

    await query(
      `UPDATE sales SET
        date = $1, rate = $2, first_kg = $3, second_kg = $4,
        first_amount = $5, second_rate = $6, second_amount = $7,
        total_amount = $8, dealer_id = $9, dealer_name = $10,
        item_id = $11, item_name = $12, notes = $13, updated_at = NOW()
       WHERE id = $14`,
      [
        date,
        Number(rate),
        Number(firstKg),
        Number(secondKg),
        Number(firstAmount || 0),
        Number(secondRate || 0),
        Number(secondAmount || 0),
        Number(totalAmount || 0),
        dealerId || null,
        dealerName || null,
        itemId || null,
        itemName || null,
        notes || null,
        req.params.id
      ]
    )

    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Delete sale
router.delete('/:id', async (req, res) => {
  try {
    await query('DELETE FROM sales WHERE id = $1', [req.params.id])
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
