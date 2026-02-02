const { body } = require("express-validator")

class AuthValidation {
    static loginUser=[
        body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Valid email is required').toLowerCase(),
        body('password').notEmpty().withMessage('Password is required').isLength({min:6}).withMessage('Password must be at least 6 characters long')
    ]

    static registerUser=[
        body('name').notEmpty().withMessage('Name is required'),
        body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Valid email is required').toLowerCase(),
        body('password').notEmpty().withMessage('Password is required').isLength({min:6}).withMessage('Password must be at least 6 characters long'),
        body('ac_type').notEmpty().withMessage('Account type is required').isIn(['saving', 'current']).withMessage('Account type must be either saving or current')
    ]

}
module.exports = AuthValidation 