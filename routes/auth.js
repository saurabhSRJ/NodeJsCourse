const express = require('express');
const { body } = require('express-validator');
const User = require('../models/user');
const authController = require('../controller/auth');

const router = express.Router();

router.post(
    '/signup',
    [
        body('email')
        .isEmail()
        .withMessage('Please enter a valid email')
        .custom((value, {req}) => {
            User.findOne({email: value})
            .then(userDoc => {
                if(userDoc) {
                    return Promise.reject('Email id already exists')
                }
            })
        })
        .normalizeEmail(),
        body('password').trim().isLength({min: 5}).withMessage('password should be at least 5 characters'),
        body('name').trim().not().isEmpty()
    ],
    authController.signup
);

module.exports = router