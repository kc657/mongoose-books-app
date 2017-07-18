let mongoose = require('mongoose')

let BookSchema = new mongoose.Schema ({
  author: String,
  title: String,
  image: String,
  releaseDate: String
})

let Book = mongoose.model('Book', BookSchema)

module.exports = Book
