const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Post Model
const Post = require('../../models/Post');

const validatePostInput = require('../../validation/post');
const validateCommentInput = require('../../validation/comment');

// @route   GET api/posts/test
// @desc    Tests post route
// @access  Public
router.get('/test', (req, res) => {
    return res.json({msg: 'Posts works'});
});

// @route   GET api/posts
// @desc    Get Posts
// @access  Public
router.get('/', async(req, res) => {
    try{
        const posts = await Post.find().sort({date: -1});
        if(posts.length > 1){
            res.json(posts);
        }
        return res.status(404).json({nopostfound: 'No Posts found'});
    } catch(err){
        return res.status(404).json({nopostfound: 'No Posts found'});
    }
});

// @route   GET api/posts/:id
// @desc    Get single Post by id
// @access  Public
router.get('/:id', async(req, res) => {
    try{
        const post = await Post.findById(req.params.id);
        return res.json(post);
    } catch(err){
        return res.status(404).json({nopostfound: 'No post found'});
    }
});

// @route   POST api/posts
// @desc    Create post
// @access  Private
router.post(
    '/',
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
        const {errors, isValid} = validatePostInput(req.body);

        // Check Validation
        if(!isValid){
            // Set status 400 and send errors
            return res.status(400).json(errors);
        }

        try{
            const newPost = new Post({
                text: req.body.text,
                name: req.user.name,
                avatar: req.user.avatar,
                user: req.user.id
            });
            const post = await newPost.save();
            return res.json(post);
        } catch(err){
            return res.status(500).json(err);
        }
    }
);

// @route   DELETE api/posts/:id
// @desc    Delete post
// @access  Private
router.delete(
    '/:id',
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
        try{
            const post = await Post.findOne({$and: [{user: req.user.id}, {_id: req.params.id}]});
            if(post){
                await post.remove();
                return res.json({ success: true });
            }
            return res.status(401).json({notauthorized: 'User not authorized to delete the post'});
        } catch(err){
            console.log(err);
            return res.status(404).json({postnotfound: 'Post not found'});
        }
    }
);


// @route   POST api/posts/like/:id
// @desc    Like post
// @access  Private
router.post(
    '/like/:id',
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
        try {
            const post  = await Post.findById(req.params.id);
            if(post.likes.some(like => like.user.toString() === req.user.id)){
                return res.status(400).json({alreadyliked: 'User already liked this post'});
            }
            post.likes.unshift({user: req.user.id});
            await post.save();
            return res.json(post);
        } catch(err){
            return res.status(404).json({postnotfound: 'Post not found'});
        }
    }
);

// @route   POST api/posts/unlike/:id
// @desc    Unlike post
// @access  Private
router.post(
    '/unlike/:id',
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
        try {
            const post  = await Post.findById(req.params.id);
            const postIndex = post.likes.findIndex(like => like.user.toString() === req.user.id);
            if(postIndex === -1){
                return res.status(400).json({notliked: 'User has not yet liked this post'});
            }
            post.likes.splice(postIndex, 1);
            await post.save();
            return res.json(post);
        } catch(err){
            return res.status(404).json({postnotfound: 'Post not found'});
        }
    }
);

// @route   POST api/posts/comment/:id
// @desc    Add comment to post
// @access  Private
router.post(
    '/comment/:id',
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
        const {errors, isValid} = validateCommentInput(req.body);

        // Check Validation
        if(!isValid){
            // Set status 400 and send errors
            return res.status(400).json(errors);
        }
        try {
            const post  = await Post.findById(req.params.id);
            const newComment = {
                text: req.body.text,
                name: req.user.name,
                avatar: req.user.avatar,
                user: req.user.id
            }
            post.comments.unshift(newComment);
            await post.save();
            res.json(post);
        } catch(err){
            return res.status(404).json({postnotfound: 'Post not found'});
        }
    }
);

// @route   DELETE api/posts/comment/:post_id/:comment_id
// @desc    Delete comment from the post
// @access  Private
router.delete(
    '/comment/:post_id/:comment_id',
    passport.authenticate('jwt', {session: false}),
    async (req, res) => {
        try {
            const post  = await Post.findById(req.params.post_id);
            const commentIndex = post.comments.findIndex(comment => comment._id.toString() === req.params.comment_id && comment.user.toString() === req.user.id);
            if(commentIndex === -1){
                return res.status(400).json({notauthorized: 'You are not authorized to delete the comment'});
            }
            post.comments.splice(commentIndex, 1);
            await post.save();
            return res.json(post);
        } catch(err){
            return res.status(404).json({postnotfound: 'Post not found'});
        }
    }
);
module.exports = router;