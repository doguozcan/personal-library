const mongoose = require('mongoose')

const connectDB = (url) => {
  return mongoose
    .connect(url)
    .then(() => {
      console.log('Connected to the MongoDB successfully!')
    })
    .catch((error) => {
      console.error(
        `Could not connected to the MongoDB. The error message: ${error.message}`
      )
      throw error
    })
}

module.exports = connectDB
