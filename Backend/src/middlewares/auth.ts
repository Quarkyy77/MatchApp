import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.models"

export const isUserAuthenticated = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const userAuthToken = req.cookies.userAuthToken || req.body.userAuthToken;
    const userRefreshToken = req.cookies.userRefreshToken || req.body.userRefreshToken;
    if (!userAuthToken && !userRefreshToken) {
        return res.status(401).json({
            message: "Authentication failed: No authToken or refreshToken provided..."
        });
    }
    jwt.verify(userAuthToken, process.env.JWT_SECRET_KEY || "", (err: any, decoded: any) => {
        if (err) {
            jwt.verify(userRefreshToken, process.env.JWT_REFRESH_SECRET_KEY || "", (refreshErr: any, refreshDecoded: any) => {
                if (refreshErr) {
                    return res.status(401).json({
                        message: "Authentication failed: Both tokens are invalid...",
                        ok: false,
                    });
                } else {
                    const newUserAuthToken = jwt.sign(
                        { userId: refreshDecoded.userId },
                        process.env.JWT_SECRET_KEY || "",
                        { expiresIn: "40m" }
                    );
                    const newUserRefreshToken = jwt.sign(
                        { userId: refreshDecoded.userId },
                        process.env.JWT_REFRESH_SECRET_KEY || "",
                        { expiresIn: "1d" }
                    );
                    res.cookie("userAuthToken", newUserAuthToken, { httpOnly: true });
                    res.cookie("userRefreshToken", newUserRefreshToken, { httpOnly: true });
                    Object.assign(req, { userId: refreshDecoded?.userId });
                    Object.assign(req, { ok: true });
                    next();
                }
            }
            );
        } else {
            Object.assign(req, { userId: decoded?.userId });
            next();
        }
    }
    );
}

export const isBlocked= async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try
    {
        const email=req.body.email;
    const user= await User.findOne({  email })
    if(!user){
       return  res.status(404).json({message:"user doesnt exist"})
    }
    else{
        const spam =user.spamreports.length;
        if(spam<=9)
        {
            next();
        }
        else{
            return res.status(403).json({message: "user is blocked and cannot login"});
        }
    }
}
    catch(err){
        return res.status(400).json({message:"error"})
    }
}