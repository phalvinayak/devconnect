const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');

// Load Profile Model
const Profile = require('../../models/Profile');
// Load User Model
const User = require('../../models/User');

const router = express.Router();

// @route   GET api/profile/test
// @desc    Tests profile route
// @access  Public
router.get('/test', (req, res) => {
    res.json({msg: 'Profile works'});
});

// @route   GET api/profile
// @desc    Get current users profile
// @access  Private
router.get(
    "/",
    passport.authenticate('jwt', {session: false}),
    async (req, res) => {
        const errors = {};
        try{
            const profile = await Profile.findOne({user: req.user.id});
            if(!profile){
                errors.noprofile = 'There is no profile for the user';
                return res.status(404).json(errors);
            }
            return res.json(profile);
        } catch(err){
            return res.sendStatus(500)
                    .json({msg: 'Something went wrong, please try again'});
        }
    }
);


// @route   POST api/profile
// @desc    Create current users profile
// @access  Private
router.post(
    '/',
    passport.authenticate('jwt', {session: false}),
    async (req, res) => {
        // Get fields
    }
);
module.exports = router;