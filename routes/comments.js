const express = require("express");
const router = express.Router();
const Comment = require('../models/Comment');


// Find all users
router.get('/api/comments', (req, res, next) => {
    Comment.find({})
        .then(apiResult => {
            console.log(apiResult);
            res.status(200).json(apiResult)
        })
        .catch(apiError => res.status(500).json(apiError))
})

// Find a user in particular
router.get('/api/comments/:id', (req, res, next) => {
    Comment.findById(req.params.id)
        .then(apiResult => res.status(200).json(apiResult))
        .catch(apiError => res.status(500).json(apiError))
});

// Creating a user
router.post('/api/comments', (req, res, next) => {
    Comment.create(req.body)
        .then(apiResult => res.status(201).json(apiResult))
        .catch(apiError => res.status(500).json(apiError))
})

// Updating a user
router.patch('/api/comments/:id', (req, res, next) => {
    Comment.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then(apiResult => res.status(200).json(apiResult))
        .catch(apiError => res.status(500).json(apiError))
});

// Deleting a user
router.delete('/api/comments/:id', (req, res, next) => {
    Comment.findByIdAndRemove(req.params.id)
        .then(apiResult => res.status(204).json(apiResult))
        .catch(apiError => res.status(500).json(apiError))
});


module.exports = router;