const express = require("express");
const router = express.Router();
const Post = require('../models/Post');


// Find all posts
router.get('/api/posts', (req, res, next) => {
    Post.find({})
        .then(apiResult => {
            console.log(apiResult);
            res.status(200).json(apiResult)
        })
        .catch(apiError => res.status(500).json(apiError))
})

// Find a post type in particular
router.get('/api/posts/:id', (req, res, next) => {
    Post.findById(req.params.id)
        .then(apiResult => res.status(200).json(apiResult))
        .catch(apiError => res.status(500).json(apiError))
});

// Creating a post
router.post('/api/posts', (req, res, next) => {
    Post.create(req.body)
        .then(apiResult => res.status(201).json(apiResult))
        .catch(apiError => res.status(500).json(apiError))
})

// Updating a post
router.patch('/api/posts/:id', (req, res, next) => {
    Post.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then(apiResult => res.status(200).json(apiResult))
        .catch(apiError => res.status(500).json(apiError))
});

// Deleting a post
router.delete('/api/posts/:id', (req, res, next) => {
    Post.findByIdAndRemove(req.params.id)
        .then(apiResult => res.status(204).json(apiResult))
        .catch(apiError => res.status(500).json(apiError))
});


module.exports = router;