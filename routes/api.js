'use strict'

const Book = require('../models/Book')

module.exports = function (app) {
  app
    .route('/api/books')
    .get(async function (req, res) {
      // get all books
      let books = await Book.find({})

      // format them in the desired way
      let formattedBooks = books.map((book) => ({
        title: book.title,
        _id: book._id,
        commentcount: book.comments.length,
      }))

      // return the response
      return res.json(formattedBooks)
    })
    .post(async function (req, res) {
      // get the title from the body
      let title = req.body.title

      // if no title provided inform the user
      if (!title) {
        return res.send('missing required field title')
      }

      // create the books with empty comments array
      let book = await Book.create({ title, comments: [] })

      // return the book's id and title informations
      return res.json({ _id: book._id, title: book.title })
    })
    .delete(async function (req, res) {
      // delete all the books
      await Book.deleteMany({})

      // return the deletion message
      return res.send('complete delete successful')
    })

  app
    .route('/api/books/:id')
    .get(async function (req, res) {
      // get the book id from parameters
      let bookId = req.params.id

      // get the book from the database
      let book = await Book.findOne({ _id: bookId })

      // if no book exists return the desired message
      if (!book) {
        return res.send('no book exists')
      }

      // if the book exists get the wanted properties => comments, _id, title, commentcount
      let formattedBook = {}

      formattedBook.comments = book.comments
      formattedBook._id = book._id
      formattedBook.title = book.title
      formattedBook.commentcount = book.comments.length

      // return the formatted version
      return res.json(formattedBook)
    })
    .post(async function (req, res) {
      // get the book id from parameters
      let bookid = req.params.id

      // get the comment from body
      let comment = req.body.comment

      // if comment not provided return error
      if (!comment) {
        return res.send('missing required field comment')
      }

      // get the book from the database
      let book = await Book.findOne({ _id: bookid })

      // if book is not in the database
      if (!book) {
        return res.send('no book exists')
      }

      // add the comment to the provided book
      book.comments.push(comment)
      book.save()

      return res.json(book)
    })
    .delete(async function (req, res) {
      // get the book id
      const bookId = req.params.id

      // get the book
      let book = await Book.findOne({ _id: bookId })

      // if book does not exist
      if (!book) {
        return res.send('no book exists')
      }

      // delete it from database
      await Book.deleteOne({ _id: bookId })

      // return the desired message
      return res.send('delete successful')
    })
}
