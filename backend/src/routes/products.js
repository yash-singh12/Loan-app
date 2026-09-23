const express = require('express')
const LoanProduct = require('../models/LoanProduct')
const LoanUser = require('../models/LoanUser')
const { auth, isAdmin } = require('../middleware/auth')
const { checkUser } = require('../utils/eligibility')

const router = express.Router()
router.use(auth)

router.get('/', async (req, res) => {
  const list = await LoanProduct.find().sort({ createdAt: -1 })
  res.json(list)
})

// add product - admin only, then recheck all users
router.post('/', isAdmin, async (req, res) => {
  const b = req.body
  if (!b.name) return res.status(400).json({ message: 'name required' })
  if (b.minAge == null || b.maxAge == null) return res.status(400).json({ message: 'minAge/maxAge required' })
  if (b.minAge > b.maxAge) return res.status(400).json({ message: 'minAge cant be more than maxAge' })
  if (b.minCreditScore < 300 || b.minCreditScore > 900) return res.status(400).json({ message: 'credit score should be 300-900' })
  if (!b.allowedEmploymentTypes || b.allowedEmploymentTypes.length == 0) return res.status(400).json({ message: 'employment type required' })
  if (!b.allowedSalaryTypes || b.allowedSalaryTypes.length == 0) return res.status(400).json({ message: 'salary type required' })
  if (b.minSalary == null || b.minSalary < 0) return res.status(400).json({ message: 'minSalary invalid' })

  const product = await LoanProduct.create(b)

  // re-evaluate everyone because new product added
  const allProducts = await LoanProduct.find()
  const allUsers = await LoanUser.find()
  for (const u of allUsers) {
    const result = checkUser(u, allProducts)
    u.eligibleProducts = result.eligibleProductIds
    u.status = result.status
    await u.save()
  }

  res.status(201).json({ product: product, reEvaluation: { users: allUsers.length, products: allProducts.length } })
})

// edit product - admin only
router.put('/:id', isAdmin, async (req, res) => {
  const b = req.body
  if (!b.name) return res.status(400).json({ message: 'name required' })
  if (b.minAge > b.maxAge) return res.status(400).json({ message: 'minAge cant be more than maxAge' })

  const product = await LoanProduct.findByIdAndUpdate(req.params.id, b, { new: true })
  if (!product) return res.status(404).json({ message: 'Not found' })

  // criteria changed so check all users again
  const allProducts = await LoanProduct.find()
  const allUsers = await LoanUser.find()
  for (const u of allUsers) {
    const result = checkUser(u, allProducts)
    u.status = result.status
    u.eligibleProducts = result.eligibleProductIds
    await u.save()
  }

  res.json({ product: product, reEvaluation: { users: allUsers.length, products: allProducts.length } })
})

module.exports = router
