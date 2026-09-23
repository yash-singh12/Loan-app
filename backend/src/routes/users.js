const express = require('express')
const LoanProduct = require('../models/LoanProduct')
const LoanUser = require('../models/LoanUser')
const { auth, isAdmin } = require('../middleware/auth')
const { checkUser } = require('../utils/eligibility')

const router = express.Router()
router.use(auth)

// list users
router.get('/', async (req, res) => {
  let filter = {}
  if (req.query.status == 'Active' || req.query.status == 'Rejected') {
    filter.status = req.query.status
  }
  const users = await LoanUser.find(filter).populate('eligibleProducts').sort({ createdAt: -1 })
  res.json(users)
})

// which products this user is eligible for
router.get('/:id/eligible', async (req, res) => {
  const user = await LoanUser.findById(req.params.id).populate('eligibleProducts')
  if (!user) return res.status(404).json({ message: 'Not found' })
  res.json({ status: user.status, eligibleProducts: user.eligibleProducts })
})

// add user - admin only
router.post('/', isAdmin, async (req, res) => {
  const { fullName, dob, creditScore, employmentType, salaryType, salary } = req.body

  if (!fullName || !dob || creditScore == null || !employmentType || !salaryType || salary == null) {
    return res.status(400).json({ message: 'All fields required' })
  }
  if (creditScore < 300 || creditScore > 900) {
    return res.status(400).json({ message: 'creditScore should be 300-900' })
  }

  // run eligibility on backend only
  const products = await LoanProduct.find()
  const result = checkUser({ dob: dob, creditScore: creditScore, employmentType: employmentType, salaryType: salaryType, salary: salary }, products)

  const user = await LoanUser.create({
    fullName: fullName,
    dob: dob,
    creditScore: creditScore,
    employmentType: employmentType,
    salaryType: salaryType,
    salary: salary,
    status: result.status,
    eligibleProducts: result.eligibleProductIds
  })

  await user.populate('eligibleProducts')
  res.status(201).json(user)
})

module.exports = router
