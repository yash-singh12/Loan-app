const mongoose = require('mongoose')

// db connection
async function connectDB(uri) {
  if (!uri) {
    throw new Error('MONGO_URI missing in .env')
  }
  await mongoose.connect(uri)
  console.log('mongodb connected')
}

module.exports = connectDB
