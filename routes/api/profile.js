const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

//load validation
const validateProfileInput = require('../../validation/profile');

//load profile model
const Profile = require('../../models/Profile');

//load user model
const User = require('../../models/User');
const { route } = require('./users');

//@Route     GET api/profile/test
//@desc      Tests profile route
//@access    Public
router.get('/test', (req, res) => res.json({ msg: "Profile works" }));

//@Route     GET api/profile
//@desc      get current user profile
//@access    Private
router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    const errors = {};
    Profile.findOne({ user: req.user.id })
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            if (!profile) {
                errors.noprofile = 'No profile for this user';
                return res.status(404).json(errors);
            }
            res.json(profile);
        }).catch(err => res.status(404).json(err));
});

//@Route     POST api/profile
//@desc      create or update user profile
//@access    Private
router.post('/', passport.authenticate('jwt', { session: false }),
    (req, res) => {
        const { errors, isValid } = validateProfileInput(req.body);

        //     //check validation
        if (!isValid) {
            return res.status(400).json(errors);
        }

        //get fieldds
        const profileFields = {};
        profileFields.user = req.user.id;
        if (req.body.handle) profileFields.handle = req.body.handle;
        if (req.body.company) profileFields.company = req.body.company;
        if (req.body.website) profileFields.website = req.body.website;
        if (req.body.location) profileFields.location = req.body.location;
        if (req.body.bio) profileFields.bio = req.body.bio;
        if (req.body.status) profileFields.status = req.body.status;
        if (req.body.githubusername) profileFields.githubusername = req.body.githubusername;

        //skills-split into array
        if (typeof req.body.skills !== 'undefined') {
            profileFields.skills = req.body.skills.split(',');
        }

        //social
        profileFields.social = {};
        if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
        if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
        if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
        if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
        if (req.body.instargram) profileFields.social.instargram = req.body.instargram;

        Profile.findOne({ user: req.user.id })
            .then(profile => {
                if (profile) {
                    //update
                    Profile.findOneAndUpdate({ user: req.user.id }, { $set: profileFields }, { new: true })
                        .then(profile => res.json(profile));
                } else {
                    //create
                    //check if handle exists
                    Profile.findOne({ handle: profileFields.handle }).then(profile => {
                        if (profile) {
                            errors.handle = 'That handle already exists';
                            res.status(400).json(errors);
                        }
                        console.log('CREATING NEW PROFILE...');

                        //save profile
                        new Profile(profileFields).save()
                            .then(profile => res.json(profile))
                            .catch(err => console.log('GO HERE', err));
                    }
                    )
                }
            })

    }
)

//@Route     GET api/profile/handle/:handle
//@desc      get profile by handle
//@access    Public
router.get('/handle/:handle', (req, res) => {
    const errors = {};
    Profile.findOne({ handle: req.params.handle })
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            if (!profile) {
                errors.noprofile = 'There is no profile for this user';
                res.status(404).json(errors);
            }
            res.json(profile);
        })
        .catch(err => res.status(404).json(err));
})

//@Route     GET api/profile/user/:user_id
//@desc      get profile by use_id
//@access    Public
router.get('/user/:user_id', (req, res) => {
    const errors = {};
    Profile.findOne({ user: req.params.user_id })
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            if (!profile) {
                errors.noprofile = 'There is no profile for this user';
                res.status(404).json(errors);
            }
            res.json(profile);
        })
        .catch(err => res.status(404).json({ profile: 'There is no profile for this user' }));
})

//@Route     GET api/profile/all
//@desc      get all profile
//@access    Public
router.get('/all', (req, res) => {
    const errors = {};
    Profile.find().populate('user', ['name', 'avatar'])
        .then(profiles => {
            if (!profiles) {
                errors.noprofile = 'There is no profile for this user';
                return res.status(404).json(errors)
            }
            res.json(profiles);
        }).catch(err => res.status(404).json({ noprofile: 'There is no profile for this user' }))
})
module.exports = router;