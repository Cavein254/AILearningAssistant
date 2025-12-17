import jwt from "jsonwebtoken";
import User from "../models/User.js";


const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || "7d",
    });
}

export const register = async (req, res, next) => {
    try {
        const {username, email, password} = req.body;

        const userExists = await User.findOne({$or: [{ email }]})

        if(userExists) {
            return res.status(400).json({
                success: false,
                error:
                    userExists.email === email
                    ? "Email already registered"
                    : "Username already taken",
                statusCode: 400,
            })
        }

        const user = await User.create({username, email, password})

        if(!user){
            return res.status(400).json({
                success: false,
                error: "User registration failed",
                statusCode: 400,
            })
        }

        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            token,
            user:{
                id: user._id,
                username: user.username,
                email: user.email,
                profileImage: user.profileImage,
                createdAt: user.createdAt,
            },
            statusCode: 201,
        })
    } catch (error) {
        next(error);
    }
}

export const login = async (req, res, next) => {
    try {
        const {email, password} = req.body;

        if(!email || !password){
            return res.status(400).json({
                success: false,
                error: "Email and password are required",
                statusCode: 400,
            })
        }

        const user = await User.findOne({email}).select("+password");

        if(!user){
            return res.status(400).json({
                success: false,
                error: "User not found",
                statusCode: 400,
            })
        }

        const isPasswordMatched = await user.comparePassword(password);

        if(!isPasswordMatched){
            return res.status(400).json({
                success: false,
                error: "Invalid credentials",
                statusCode: 400,
            })
        }

        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            message: "User logged in successfully",
            token,
            user:{
                id: user._id,
                username: user.username,
                email: user.email,
                profileImage: user.profileImage,
                createdAt: user.createdAt,
            },
            statusCode: 200,
        })
    } catch (error) {
        next(error);
    }
}


export const getProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        if(!user){
            return res.status(400).json({
                success: false,
                error: "User not found",
                statusCode: 400,
            })
        }

        res.status(200).json({
            success: true,
            message: "User profile fetched successfully",
            user:{
                id: user._id,
                username: user.username,
                email: user.email,
                profileImage: user.profileImage,
                createdAt: user.createdAt,
            },
            statusCode: 200,
        })
    } catch (error) {
        next(error);
    }
}


export const updateProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        if(!user){
            return res.status(400).json({
                success: false,
                error: "User not found",
                statusCode: 400,
            })
        }

        user.username = req.body.username || user.username;
        user.email = req.body.email || user.email;
        user.profileImage = req.body.profileImage || user.profileImage;

        await user.save();

        res.status(200).json({
            success: true,
            message: "User profile updated successfully",
            user:{
                id: user._id,
                username: user.username,
                email: user.email,
                profileImage: user.profileImage,
                createdAt: user.createdAt,
            },
            statusCode: 200,
        })
    } catch (error) {
        next(error);
    }
}

export const changePassword = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        if(!user){
            return res.status(400).json({
                success: false,
                error: "User not found",
                statusCode: 400,
            })
        }

        user.password = req.body.password;

        await user.save();

        res.status(200).json({
            success: true,
            message: "User password changed successfully",
            statusCode: 200,
        })
    } catch (error) {
        next(error);
    }
}