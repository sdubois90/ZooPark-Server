const express = require("express");
const router = express.Router();
const User = require('../models/User');


// Find all users
router.get('/api/users', (req, res, next) => {
    User.find({})
        .then(apiResult => {
            console.log(apiResult);
            res.status(200).json(apiResult)
        })
        .catch(apiError => res.status(500).json(apiError))
})

// Find a user in particular
router.get('/api/users/:id', (req, res, next) => {
    User.findById(req.params.id)
        .then(apiResult => res.status(200).json(apiResult))
        .catch(apiError => res.status(500).json(apiError))
});

// Creating a user
router.post('/api/users', (req, res, next) => {
    User.create(req.body)
        .then(apiResult => res.status(201).json(apiResult))
        .catch(apiError => res.status(500).json(apiError))
})

// Updating a user
router.patch('/api/users/:id', (req, res, next) => {
    User.findByIdAndUpdate(req.params.id, req.body, {new:true})
    .then(apiResult => res.status(200).json(apiResult))
    .catch(apiError => res.status(500).json(apiError))
});

// Deleting a user
router.delete('/api/users/:id', (req, res, next) => {
    User.findByIdAndRemove(req.params.id)
        .then((apiResult) => {
            console.log(apiResult)
            if (apiResult === null) {
                res.status(404).json({ message: "User to delete not found" });
            } else {
                res.status(204).json(apiResult);
            }
        })
        .catch((apiError) => {
            res.status(500).json(apiError)
        })
});


module.exports = router;