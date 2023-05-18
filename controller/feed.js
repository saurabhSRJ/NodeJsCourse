const { validationResult } = require('express-validator');
const Post = require('../models/post');
const fs = require('fs');
const path = require('path');

exports.getPosts = (req, res, next) => {
    console.log('get all posts called');
    const currentPage = req.query.page || 1;
    const pageSize = 2;
    let totalItems;
    Post.find()
        .countDocuments()
        .then(count => {
            totalItems = count;
            return Post.find()
                .skip((currentPage - 1) * pageSize)
                .limit(pageSize)
        })
        .then(posts => {
            res.status(200).json({
                message: 'Fetched posts successfully',
                posts: posts,
                totalItems: totalItems
            })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.createPost = (req, res, next) => {
    console.log('create post called');
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation error. Please enter correct data');
        error.statusCode = 422;
        throw error;
    }
    if (!req.file) {
        const error = new Error('No image provided');
        error.statusCode = 422;
        throw error;
    }
    const imageUrl = req.file.path;
    const title = req.body.title;
    const content = req.body.content;
    const post = new Post({
        title: title,
        content: content,
        imageUrl: imageUrl,
        creator: { name: 'Saurabh' }
    });
    post.save()
        .then(result => {
            res.status(200).json({
                message: "Post created successfully",
                post: result
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.getPost = (req, res, next) => {
    console.log('post details called');
    const postId = req.params.postId;
    Post.findById(postId)
        .then(post => {
            if (!post) {
                const error = new Error('Post not found');
                error.statusCode = 404;
                throw error;
            }
            res.status(200).json({
                message: 'Post fetched', post: post
            });
        })
        .catch(
            err => {
                if (!err.statusCode) {
                    err.statusCode = 500;
                }
                next(err);
            }
        )
};

exports.updatePost = (req, res, next) => {
    console.log('update post called');
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation error. Please enter correct data');
        error.statusCode = 422;
        throw error;
    }
    const postId = req.params.postId;
    const title = req.body.title;
    const content = req.body.content;
    let imageUrl = req.body.image;
    if (req.file) {
        imageUrl = req.file.path;
    }
    if (!imageUrl) {
        const error = new Error('No image provided');
        error.statusCode = 422;
        throw error;
    }
    Post.findById(postId)
        .then(post => {
            if (!post) {
                const error = new Error('Post not found');
                error.statusCode = 404;
                throw error;
            }
            if (imageUrl !== post.imageUrl) {
                deleteImage(post.imageUrl);
            }
            post.title = title;
            post.content = content;
            post.imageUrl = imageUrl;
            return post.save()
        })
        .then(result => {
            res.status(200).json({
                message: 'Post updated', post: result
            })
        })
        .catch(
            err => {
                if (!err.statusCode) {
                    err.statusCode = 500;
                }
                next(err);
            }
        )
}

exports.deletePost = (req, res, next) => {
    console.log('delete post called');
    const postId = req.params.postId;
    Post.findById(postId)
        .then(post => {
            if (!post) {
                const error = new Error('Post not found');
                error.statusCode = 404;
                throw error;
            }
            deleteImage(post.imageUrl);
            return Post.findByIdAndRemove(postId);
        })
        .then(result => {
            res.status(200).json({ message: 'Post deleted' });
        })
        .catch(
            err => {
                if (!err.statusCode) {
                    err.statusCode = 500;
                }
                next(err);
            }
        )
}

const deleteImage = filePath => {
    filePath = path.join(__dirname, '..', filePath);
    fs.unlink(filePath, err => { console.log(err) });
}