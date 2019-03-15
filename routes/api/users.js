const express = require('express');
const mongoose = require('mongoose');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');

const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

const {secret} = require('../../config/keys');

const router = express.Router();

// Load User model
const User = require('../../models/User');

// @route   GET api/users/test
// @desc    Tests users route
// @access  Public
router.get('/test', (req, res) => {
    res.json({msg: 'Users works'});
});

// @route   GET api/users/register
// @desc    Register user
// @access  Public
router.post('/register', async (req, res) => {
    const {errors, isValid} = validateRegisterInput(req.body);

    // Check Validation
    if(!isValid){
        return res.status(400).json(errors);
    }

    try {
        const user = await User.findOne({email: req.body.email});
        if(user){
            errors.email = 'Ematil already exists';
            return res.status(400)
                      .json(errors);

        } else {
            const avatar = gravatar.url(req.body.email, {
                s: '200',   // Size
                r: 'pg',    // Ratings
                d: 'mm'     // Default
            });

            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                avatar,
                password: req.body.password
            });

            bcrypt.genSalt(10, (err, salt) => {
                if(err){
                    throw err;
                }
                bcrypt.hash(newUser.password, salt, async (err, hash) => {
                    if(err){
                        throw err;
                    }
                    newUser.password = hash;
                    const user = await newUser.save();
                    res.json(user);
                });
            });
        }
    } catch(err) {
        console.log(err);
        return res.sendStatus(500)
                  .json({msg: 'Internal server error'});

    };
});

// @route   GET api/users/login
// @desc    Login User / Register JWT Token
// @access  Public
router.post('/login', async (req, res) => {
    const {errors, isValid} = validateLoginInput(req.body);

    // Check Validation
    if(!isValid){
        return res.status(400).json(errors);
    }

    const {email, password} = req.body;
    try {
        // Find user by email
        const user = await User.findOne({email});
        if(!user){
            errors.email = 'Email is not registered with us :(';
            return res.status(404)
                      .json(errors);
        }

        // Check password
        bcrypt.compare(password, user.password)
            .then(isMatch => {
                if(isMatch){
                    // User Matched

                    // Create JWT payload
                    const payload = {
                        id: user.id,
                        name: user.name,
                        avatar: user.avatar
                    };

                    // Sign Token
                    jwt.sign(
                        payload,
                        secret,
                        {expiresIn: 3600},
                        (err, token) => {
                            if(err){
                                throw err
                            }
                            res.json({
                                success: true,
                                token: `Bearer ${token}`
                            });
                        }
                    );
                } else {
                    errors.password = 'Incorrect password';
                    res.json(errors)
                }
            });
    } catch(err){
        return res.status(500).json(err);
    }
});

// @route   GET api/users/current
// @desc    Return current User
// @access  Private
router.get(
    '/current',
    passport.authenticate('jwt', {session: false}),
    (req, res) => {
        res.json({
            id: req.user.id,
            name: req.user.name,
            email: req.user.email,
            avatar: req.user.avatar
        });
    }
);

module.exports = router;