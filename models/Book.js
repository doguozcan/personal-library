const mongoose = require('mongoose')

const BookSchema = mongoose.Schema({
  title: String,
  comments: [String],
})

module.exports = mongoose.model('Book', BookSchema)
