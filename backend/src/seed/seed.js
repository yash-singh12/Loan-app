require('dotenv').config()
const bcrypt = require('bcryptjs')
const connectDB = require('../config/db')
const AdminUser = require('../models/AdminUser')
const LoanProduct = require('../models/LoanProduct')
const LoanUser = require('../models/LoanUser')
const { checkUser } = require('../utils/eligibility')

async function run() {
  await connectDB(process.env.MONGO_URI)

  await AdminUser.deleteMany({})
  await LoanProduct.deleteMany({})
  await LoanUser.deleteMany({})

  // logins
  let adminPass = await bcrypt.hash('Admin@123', 10)
  let viewerPass = await bcrypt.hash('Viewer@123', 10)

  await AdminUser.create([
    { name: 'Admin', email: 'admin@demo.com', passwordHash: adminPass, role: 'admin' },
    { name: 'Viewer', email: 'viewer@demo.com', passwordHash: viewerPass, role: 'viewer' }
  ])

  const products = await LoanProduct.insertMany([
    { name: 'Personal Loan', description: 'for salaried people', minAge: 21, maxAge: 58, minCreditScore: 700, allowedEmploymentTypes: ['Salaried'], allowedSalaryTypes: ['Cheque', 'DAT'], minSalary: 25000 },
    { name: 'Business Loan', description: 'for self employed', minAge: 21, maxAge: 60, minCreditScore: 650, allowedEmploymentTypes: ['Self-Employed'], allowedSalaryTypes: ['Cheque', 'DAT', 'Cash'], minSalary: 30000 },
    { name: 'Micro Loan', description: 'small loan, easy rules', minAge: 18, maxAge: 65, minCreditScore: 600, allowedEmploymentTypes: ['Salaried', 'Self-Employed'], allowedSalaryTypes: ['DAT', 'Cash', 'Cheque'], minSalary: 12000 }
  ])

  var users = [
    { fullName: 'Rahul Sharma', dob: '1996-03-15', creditScore: 720, employmentType: 'Salaried', salaryType: 'Cheque', salary: 30000 },
    { fullName: 'Priya Verma', dob: '1990-07-20', creditScore: 780, employmentType: 'Self-Employed', salaryType: 'DAT', salary: 50000 },
    { fullName: 'Amit Low', dob: '2008-01-01', creditScore: 500, employmentType: 'Salaried', salaryType: 'Cash', salary: 8000 },
    { fullName: 'Neha Cash', dob: '1985-11-05', creditScore: 690, employmentType: 'Salaried', salaryType: 'Cash', salary: 20000 }
  ]

  for (let i = 0; i < users.length; i++) {
    let r = checkUser(users[i], products)
    await LoanUser.create({ ...users[i], eligibleProducts: r.eligibleProductIds, status: r.status })
  }

  console.log('seed done')
  process.exit(0)
}

run().catch((e) => {
  console.log(e)
  process.exit(1)
})
