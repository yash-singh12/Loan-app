// this file has all eligibility logic
// age is calculated from dob, not stored

function getAge(dob) {
  let birth = new Date(dob)
  let today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  let m = today.getMonth() - birth.getMonth()
  if (m < 0 || (m == 0 && today.getDate() < birth.getDate())) {
    age--
  }
  return age
}

function isEligible(user, product) {
  let age = getAge(user.dob)

  // chek age
  if (age < product.minAge || age > product.maxAge) return false
  // chek credit score
  if (user.creditScore < product.minCreditScore) return false
  // employment type should be in allowed list
  if (!product.allowedEmploymentTypes.includes(user.employmentType)) return false
  // salary type also
  if (!product.allowedSalaryTypes.includes(user.salaryType)) return false
  // salary
  if (user.salary < product.minSalary) return false

  return true
}

function checkUser(user, products) {
  let okList = []
  let okIds = []

  for (let i = 0; i < products.length; i++) {
    if (isEligible(user, products[i])) {
      okList.push(products[i])
      // some products have _id some have id, handle both
      if (products[i]._id) okIds.push(products[i]._id)
      else okIds.push(products[i].id)
    }
  }

  let status = 'Rejected'
  if (okList.length > 0) status = 'Active'

  return { eligibleProductIds: okIds, eligibleProducts: okList, status: status }
}

module.exports = { getAge, isEligible, checkUser }
