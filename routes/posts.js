const express = require("express");
const router = express.Router();
const Post = require('../models/Post');
// For files (pictures), need the cloudinary middleware when receiving
// a form-data (used if contains files such as pictures) from the front-end
const upload = require("../config/cloudinary");


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



// Create a post (upload on the single option and they key is "picture")
// Need it when receiving a form-data (used if contains files) from the front-end
router.post('/api/posts', upload.single("picture"), (req, res, next) => {
    // CREATE AN OBJECT WITH THE TEXT AND THE CURRENT USER , AND PASS IT TO THE CREATE
    console.log("user id",req.session.currentUser._id)
    console.log("POSTING A COMMENT")
    console.log("hello", req.file)
    const userPost = {
        user: req.session.currentUser._id,    // id of the user creating the post
        text: req.body.text,       // The text of the post
    }

    // If req.body contains a file =>
    if (req.file) {
        if (req.file["resource_type"] === 'image') {
            userPost.picture = req.file.secure_url
        } else if (req.file["resource_type"] === 'video') {
            userPost.video = req.file.secure_url
        }
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

// Updating a like
router.patch('/api/posts/like/:id', (req, res, next) => {
    console.log("LIKING A POST")
    // console.log("USER", req.session.currentUser._id)

    Post.findByIdAndUpdate(req.params.id, { $addToSet: { likes : req.session.currentUser._id } }, { new: true, useFindAndModify: false })
        .then(apiResult => res.status(200).json(apiResult))
        .catch(apiError => res.status(500).json(apiError))
});


// Dislike
router.patch('/api/posts/dislike/:id', (req, res, next) => {
    console.log("DISLKING A POST")
    Post.findByIdAndUpdate(req.params.id, { $pull: { likes :  req.session.currentUser._id  } }, { new: true, useFindAndModify: false })
        .then(apiResult => res.status(200).json(apiResult))
        .catch(apiError => res.status(500).json(apiError))
});


module.exports = router;