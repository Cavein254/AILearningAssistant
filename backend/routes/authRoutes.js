import express from "express";
import {body} from "express-validator";

import {
    register,
    login,
    getProfile,
    updateProfile,
    changePassword,
} from '../controllers/authController.js';

import protect from '../middleware/auth.js';

const router = express.Router();

const registerValidation = [
    body('username')
        .trim()
        .isLength({min: 3})
        .withMessage('Username must be at least 3 characters long'),
    body('email')
        .trim()
        .isEmail()
        .normalizeEmail()
        .withMessage('Please enter a valid email address'),
    body('password')
        .trim()
        .isLength({min: 3})
        .withMessage('Password must be at least 3 characters long'),
]

const loginValidation = [
    body('email')
        .trim()
        .isEmail()
        .normalizeEmail()
        .withMessage('Please enter a valid email address'),
    body('password')
        .notEmpty()
        .trim()
        .isLength({min: 3})
        .withMessage('Password must be at least 3 characters long'),
]

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);


router.get('/profile', protect, getProfile);
router.put('/update-profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);


export default router;
