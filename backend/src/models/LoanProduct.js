const mongoose = require('mongoose')

// loan product schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  minAge: { type: Number, required: true },
  maxAge: { type: Number, required: true },
  minCreditScore: { type: Number, required: true, min: 300, max: 900 },
  allowedEmploymentTypes: { type: [String], required: true }, // ['Salaried','Self-Employed']
  allowedSalaryTypes: { type: [String], required: true }, // DAT, Cash, Cheque
  minSalary: { type: Number, required: true }
}, { timestamps: true })

module.exports = mongoose.model('LoanProduct', productSchema)
