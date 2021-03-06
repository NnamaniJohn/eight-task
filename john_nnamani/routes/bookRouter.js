const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const upload = multer({ dest:'uploads/'});

const Books = require('../models/books');

const bookRouter = express.Router();

bookRouter.use(bodyParser.json());

bookRouter.route('/')
    .get((req, res, next) => {
        Books.find({})
            .then((books) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(books);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(upload.single('file'), (req, res, next) => {
        if (!req.file.mimetype.startsWith('application/pdf')) {
            return res.status(422).json({
                error :'The uploaded file must be a pdf'
            });
        }
        data = req.body;
        path = "/uploads/" + req.file.filename;
        data["path"] = path;

        Books.create(data)
            .then((book) => {
                console.log('Book Created ', book);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(book);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put((req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported');
    })
    .delete((req, res, next) => {
        Books.remove({})
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

bookRouter.route('/:bookId')
    .get((req, res, next) => {
        Books.findById(req.params.bookId)
            .then((book) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(book);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post((req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation not supported');
    })
    .put((req, res, next) => {
        Books.findByIdAndUpdate(req.params.bookId, {
            $set: req.body
        }, { new: true })
            .then((book) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(book);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete((req, res, next) => {
        Books.findByIdAndRemove(req.params.bookId)
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

module.exports = bookRouter;