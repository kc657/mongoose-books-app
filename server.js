// server.js
// SERVER-SIDE JAVASCRIPT

// ///////////////////////////
//  SETUP and CONFIGURATION
// ///////////////////////////

// require express in our app
var express = require('express'),
  bodyParser = require('body-parser'),
  db = require('./models')

// generate a new express app and call it 'app'
var app = express()

// serve static files in public
app.use(express.static('public'))

// body parser config to accept our datatypes
app.use(bodyParser.urlencoded({ extended: true }))

// //////////////////
//  DATA
// /////////////////

var newBookUUID = 18

// //////////////////
//  ROUTES
// /////////////////

// define a root route: localhost:3000/
app.get('/', function (req, res) {
  res.sendFile('views/index.html', { root: __dirname})
})

// get all books
app.get('/api/books', function (req, res) {
  // send all books as JSON response
  db.Book.find().populate('author').exec(function (err, books) {
    if (err) { return console.log('index error: ' + err) }
    res.json(books)
  })
})

// get one book
app.get('/api/books/:id', function (req, res) {
  // find one book by its id
  console.log('books show', req.params)
  var newBook = req.params.id
  db.Book.findOne({_id: newBook}).populate('author').exec(function (err, books) {
    if (err) {
      console.log('Find by ID error ' + err)
      res.sendStatus(500)
    }
    res.json(books)
  })
})

// create new book
app.post('/api/books', function (req, res) {
  // create new book with form data (`req.body`)
  console.log('books create', req.body)
  var newBook = db.Book({
    title: req.body.title,
    image: req.body.image,
    releaseDate: req.body.releaseDate,
    author: req.body.author
  })
  // db.Author.findOne({name: req.body.author}, function (err, author) {
  //   newBook.author = author
  //   newBook.save(function (err, book) {
  //     if (err) { console.log('error') }
  //     res.json(book)
  //   })
  // })
  db.Author.findOne({name:req.body.author}).populate('author').exec(function (err, author) {
    newBook.author = author
    newBook.save(function (err, book) {
      if (err) { console.log('error') }
      res.json(book)
    })
  })
  // db.Author.create({name: req.body.author}).exec(function(err, book){
  //   if (err) {
  //     console.log("error");
  //   }
  //   res.json(book)
  // })
})

// // update book
// app.put('/api/books/:id', function (req, res) {
// // get book id from url params (`req.params`)
//   console.log('books update', req.params)
//   var bookUpdateId = req.params.id
//   db.Book.findOneAndUpdate({_id: bookUpdateId},
//     {
//       author: req.body.author,
//       title: req.body.title
//     }, {new: true})
//   res.json(bookUpdateId)
// })

// delete book
app.delete('/api/books/:id', function (req, res) {
  // get book id from url params (`req.params`)
  console.log('books delete', req.params)
  let bookToDelete = req.params.id
  db.Book.findByIdAndRemove({_id: bookToDelete}, function (err, book) {
    res.json(bookToDelete)
  })
})

app.listen(process.env.PORT || 3000, function () {
  console.log('Book app listening at http://localhost:3000/')
})
