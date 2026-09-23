const jwt = require('jsonwebtoken')
const AdminUser = require('../models/AdminUser')

function makeToken(user) {
  return jwt.sign(
    { id: user._id, role: user.role, email: user.email },
    process.env.JWT_SECRET || 'dev_secret',
    { expiresIn: '8h' }
  )
}

// chek token
async function auth(req, res, next) {
  let header = req.headers.authorization || ''
  let token = null
  if (header.startsWith('Bearer ')) {
    token = header.slice(7)
  }
  if (!token) return res.status(401).json({ message: 'Missing token' })

  try {
    var decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret')
    const user = await AdminUser.findById(decoded.id)
    if (!user) return res.status(401).json({ message: 'Invalid token' })

    req.user = { id: user._id, name: user.name, email: user.email, role: user.role }
    next()
  } catch (err) {
    console.log(err)
    return res.status(401).json({ message: 'Invalid token' })
  }
}

// only admin can do add/edit
function isAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' })
  }
  next()
}

module.exports = { auth, isAdmin, makeToken }
