require('dotenv').config()
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const { connectDB } = require('./database')
const authRoutes = require('./routes/auth')
const salesRoutes = require('./routes/sales')
const advancesRoutes = require('./routes/advances')
const dealersRoutes = require('./routes/dealers')
const itemsRoutes = require('./routes/items')

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/sales', salesRoutes)
app.use('/api/advances', advancesRoutes)
app.use('/api/dealers', dealersRoutes)
app.use('/api/items', itemsRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Farmer App Backend is running' })
})

// Start server
async function startServer() {
  try {
    await connectDB()
    
    app.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════╗
║  Farmer App Backend Server Ready   ║
║  🚀 Running on port ${PORT}          ║
║  📊 Database: Supabase PostgreSQL  ║
║  🔗 API: http://localhost:${PORT}   ║
╚════════════════════════════════════╝
      `)
    })
  } catch (err) {
    console.error('Failed to start server:', err)
    process.exit(1)
  }
}

startServer()
