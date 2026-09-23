const express = require('express')
const bcrypt = require('bcryptjs')
const AdminUser = require('../models/AdminUser')
const { auth, makeToken } = require('../middleware/auth')

const router = express.Router()

// login api
router.post('/login', async (req, res) => {
  const email = req.body.email
  const password = req.body.password

  const user = await AdminUser.findOne({ email: (email || '').toLowerCase() })
  if (!user) return res.status(401).json({ message: 'Invalid credentials' })

  const ok = await bcrypt.compare(password || '', user.passwordHash)
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' })

  const token = makeToken(user)
  res.json({ token: token, user: { id: user._id, name: user.name, email: user.email, role: user.role } })
})

// for frontend to check who is logged in
router.get('/me', auth, (req, res) => {
  res.json({ user: req.user })
})

module.exports = router
