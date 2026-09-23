const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  dob: { type: Date, required: true },
  creditScore: { type: Number, required: true, min: 300, max: 900 },
  employmentType: { type: String, enum: ['Salaried', 'Self-Employed'], required: true },
  salaryType: { type: String, enum: ['DAT', 'Cash', 'Cheque'], required: true },
  salary: { type: Number, required: true },
  status: { type: String, enum: ['Active', 'Rejected'], default: 'Rejected' },
  eligibleProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'LoanProduct' }]
}, { timestamps: true })

module.exports = mongoose.model('LoanUser', userSchema)
