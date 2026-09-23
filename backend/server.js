require('dotenv').config()
const express = require('express')
const cors = require('cors')
const connectDB = require('./src/config/db')

const authRoutes = require('./src/routes/auth')
const productRoutes = require('./src/routes/products')
const userRoutes = require('./src/routes/users')

var app = express()

// allow frontend
app.use(cors({ origin: process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(',') : true }))
app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({ ok: true })
})

app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/users', userRoutes)

const PORT = process.env.PORT || 5000

// connect db then start server
connectDB(process.env.MONGO_URI).then(() => {
  app.listen(PORT, () => console.log("server running on port " + PORT))
}).catch((e) => {
  console.log(e)
  process.exit(1)
})

module.exports = app
