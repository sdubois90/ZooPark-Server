const express = require("express");
const router = express.Router();
const Comment = require('../models/Comment');
const Post = require('../models/Post');


// Find all comments
router.get('/api/:postId/comments', (req, res, next) => {
    Post.find({_id: req.params.postId}).populate("comments")
        .then(specificPost => res.status(200).json(specificPost.data.comments))
        .catch(apiError => res.status(500).json(apiError))
})

// Find a comment in particular
router.get('/api/comments/:id', (req, res, next) => {
    Comment.findById(req.params.id)
        .then(apiResult => res.status(200).json(apiResult))
        .catch(apiError => res.status(500).json(apiError))
});

// Creating a comment
router.post('/api/:postId/comments', (req, res, next) => {
    Comment.create(req.body)
        .then(apiResult =>
            Post.findByIdAndUpdate({_id: req.params.postId},{ $addToSet: { comments : apiResult.data._id } }, { new: true, useFindAndModify: false })
            .then((updatedPost)=>res.status(200).json(updatedPost))
            .catch(apiError => res.status(500).json(apiError))
        )
        .catch(apiError => res.status(500).json(apiError))
})

// Updating a comment
router.patch('/api/comments/:id', (req, res, next) => {
    Comment.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then(apiResult => res.status(200).json(apiResult))
        .catch(apiError => res.status(500).json(apiError))
});

// Deleting a comment
router.delete('/api/comments/:id', (req, res, next) => {
    Comment.findByIdAndRemove(req.params.id)
        .then(apiResult => res.status(204).json(apiResult))
        .catch(apiError => res.status(500).json(apiError))
});


module.exports = router;