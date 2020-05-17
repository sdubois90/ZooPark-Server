const express = require("express");
const router = express.Router();
const Post = require('../models/Post');


// Find all posts
router.get('/api/posts', (req, res, next) => {
    Post.find({}).populate('user')
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
    // CREATE AN OBJECT WITH THE TEXT AND THE CURRENT USER , AND PASS IT TO THE CREATE
    console.log(req.session.currentUser._id)
    const userPost = {
        user: req.session.currentUser._id,    // id of the user creating the post
        text: req.body.text                   // The text of the post
    }
// Creating : new Post() + save() and we consume the promise by populating it
// Then we consume again
// It is like a create + populate
    const post = new Post(userPost)
    post.save().then(post => post.populate('user').execPopulate())
        .then(apiResult => res.status(201).json(apiResult))
        .catch(apiError => res.status(500).json(apiError))
})
// Post.create(userPost).then(post => post.populate('user').execPopulate())
//     .then(apiResult => res.status(201).json(apiResult))
//     .catch(apiError => res.status(500).json(apiError))

// Updating a post
router.patch('/api/posts/:id', (req, res, next) => {
    Post.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then(apiResult => res.status(200).json(apiResult))
        .catch(apiError => res.status(500).json(apiError))
});

// Deleting a post
router.delete('/api/posts/:id', (req, res, next) => {
    Post.findByIdAndRemove(req.params.id)
        .then((apiResult) => {
            console.log(apiResult)
            if (apiResult === null) {
                res.status(404).json({ message: "Post to delete not found" });
            } else {
                res.status(204).json(apiResult);
            }
        })
        .catch((apiError) => {
            res.status(500).json(apiError)
        })
});


module.exports = router;