const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

const Post = require('../../models/Post');
const Profile = require('../../models/Profile');

//validation
const validatePostInput = require('../../validation/post');
const { route } = require('./users');
//@Route GET api/posts/test
router.get('/test', (req, res) => res.json({ msg: "Post work" }));

//@Route    GET api/posts
//@desc     Ger posts
//@access   Public
router.get('/', (req, res) => {
    Post.find()
        .sort({ date: -1 })
        .then(posts => res.json(posts))
        .catch(err => res.status(404).json({ nopostfound: 'No post found' }));
})

//@Route    DELETE api/posts/:id
//@desc     Delete posts by id
//@access   Private
router.delete('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Profile.findOne({ user: req.user.id })
        .then(profile => {
            Post.findById(req.params.id)
                .then(post => {
                    //check for post owner
                    if (post.user.toString() !== req.user.id) {
                        return res.status(401).json({ notauthorized: 'User not authorized' });
                    }
                    //delete
                    post.remove().then(() => res.json({ message: 'success remove' }))
                        .catch(err => res.status(404).json({ postnotfound: 'No post found' }));
                })
        })
})

//@Route    GET api/posts/:id
//@desc     Get posts by id
//@access   Public
router.get('/:id', (req, res) => {
    Post.findById(req.params.id)
        .then(post => res.json(post))
        .catch(err => res.status(404).json({ nopostfound: 'No post found' }));
})

//@Route    POST api/posts
//@desc     Create posts
//@access   Private
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    //check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }
    const newPost = new Post({
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.avatar,
        user: req.user.id
    });
    newPost.save().then(post => res.json(post));
})

//@Route    POST api/posts/like/:id
//@desc     Like post
//@access   Private
router.post('/like/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Profile.findOne({ user: req.user.id })
        .then(profile => {
            Post.findById(req.params.id)
                .then(post => {
                    if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
                        return res.status(400).json({ alreadyliked: 'User already liked this post' })
                    }

                    post.likes.unshift({ user: req.user.id });
                    post.save().then(post => res.json(post));
                })
        })
})


module.exports = router;