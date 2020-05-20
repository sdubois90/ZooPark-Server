const express = require("express");
const router = express.Router();
const Comment = require('../models/Comment');
const Post = require('../models/Post');
const upload = require("../config/cloudinary");

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
router.post('/api/:postId/comments', upload.single("picture"), (req, res, next) => {
    const comment = {
        user: req.session.currentUser._id,    // id of the user creating the post
        text: req.body.text,       // The text of the post
    }
    console.log(req.body)
    console.log(req.file)

    // If req.body contains a file =>
    if (req.file) {
        comment.picture = req.file.secure_url
    }
    console.log("mycomment",comment)
    Comment.create(comment)
        .then(apiResult => {
            console.log(apiResult)
            Post.findByIdAndUpdate({_id: req.params.postId},{ $addToSet: { comments : apiResult._id } }, { new: true, useFindAndModify: false }).populate("comments")
                .then((updatedPost)=>res.status(200).json(updatedPost))
                .catch(apiError => res.status(500).json(apiError))
        })
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