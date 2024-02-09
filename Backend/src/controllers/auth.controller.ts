import express from "express";
import User from "../models/user.models";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

// Register User
// name, email, password, gender
export const register = async (req: express.Request, res: express.Response) => {
    try {
        const { name, email, password, gender } = req.body;
        if (!name || !email || !password || !gender) {
            res.status(400).json({
                message: "Please provide all necessary credentials..."
            })
        }
        const existingCustomer = await User.findOne({ email });
        if (existingCustomer) {
            return res.status(400).json({
                message: "Customer already exists...",
            });
        }
        const emailExpression: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        const passwordExpression: RegExp =
            /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,20}$/;
        if (!passwordExpression.test(password.toString())) {
            return res.status(400).json({
                message: "Enter valid password with uppercase, lowercase, number & @ between range 7-15...",
            });
        }
        if (!emailExpression.test(email.toString())) {
            return res.status(400).json({ message: "Invalid email address type..." });
        }

     
        const hashedPassword = bcryptjs.hashSync(password, 10);
        const user = new User({
            name, email, password: hashedPassword, gender
        });
        await user.save();
        return res.status(200).json({
            message: "User registered successfully..."
        });
    } catch (err) {
        res.status(500).json({
            message: "Error while registering customer..."
        })
    }
}


// Login User
export const login = async (req: express.Request, res: express.Response) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                message: "Please provide all necessary credentials..."
            })
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "User does not exist...",
            });
        }
        const validPassword = bcryptjs.compareSync(password, user.password);
        if (!validPassword) {
            return res.status(403).json({
                message: "Wrong Password...",
            });
        }
        const userAuthToken = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET_KEY || "",
            { expiresIn: "40m" }
        );
        const userRefreshToken = jwt.sign(
            { userId: user._id },
            process.env.JWT_REFRESH_SECRET_KEY || "",
            { expiresIn: "1d" }
        );
        res.cookie("userAuthToken", userAuthToken, { httpOnly: true });
        res.cookie("userRefreshToken", userRefreshToken, { httpOnly: true });
        res.status(200).json({ message: "Login Successfull...", user, userAuthToken, userRefreshToken });
    } catch (err) {
        res.status(500).json({
            message: "Unable to login..."
        })
    }
}

// Logout current User
export const logout = async (req: express.Request, res: express.Response) => {
    try {
        res.clearCookie("userAuthToken");
        res.clearCookie("userRefreshToken");
        return res.status(200).json({
            message: "Logout Successfull..."
        })
    } catch (err) {
        return res.status(500).json({
            message: "Unable to logout..."
        })
    }
}