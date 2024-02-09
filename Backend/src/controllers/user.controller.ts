import express from "express";
import User from "../models/user.models"


export const updateUserLocation = async (req: express.Request, res: express.Response) => {
    try {
        await User.findByIdAndUpdate(req.userId, {
            $set: {
                location: req.body.location
            }
        })
        return res.status(201).json({
            message: "User's location updated successfully...",
            location: req.body.location
        })
    } catch (err) {
        return res.status(500).json({
            message: "Unable to update user's location..."
        })
    }
}

export const getNearbyUsers = async (req: express.Request, res: express.Response) => {
    try {
        const { userId, location } = req.body;
        const foundUsers = await User.find({ location: location })
        const requester=await User.findById({_id: userId});
        
        const oppositeGenderUsers=foundUsers.filter(obj=>{
            return  !(obj.spamreports.length<10) && obj.gender!=requester?.gender;
        })
        return res.status(200).json(oppositeGenderUsers)
    } catch (err) {
        return res.status(500).json({
            message: "Unable to fetch nearby users..."
        })
    }
}

export const requestMatch = async (req: express.Request, res: express.Response) => {
    try {
        const {userId, location} = req.body;
        const user = await User.findById({_id: userId});
        if (!user) {
            return res.status(404).json({
                message: "user not found...",
            });
        }
        const request = {
            userId: req.userId,
            location: location
        }
        user.matches.push(request);
        await user.save();
        return res.status(201).json({
            message: " successfully sent match request..."
        });
    } catch (err) {
        return res.status(500).json({
            message: "Unable to send request..."
        })
    }
}



export const getMatchStatus = async (req: express.Request, res: express.Response) => {
    try {
        const user = await User.findById({ _id: req.userId });
        if (!user) {
            return res.status(404).json({
                message: "Customer not found...",
            });
        }
        return res.status(200).json(user.MatchStatus);
    } catch (err) {
        return res.status(500).json({
            message: "Unable to fetch customer status..."
        })
    }
}

export const markSpam= async (req: express.Request, res: express.Response) => {
    try {
        const {userId} = req.body;
        const user = await User.findById({_id: userId});
        if (!user) {
            return res.status(404).json({
                message: "user not found...",
            });
        }
        console.log(user?.spamreports.length)
        user?.spamreports.push('spam');
        console.log(user?.spamreports.length)
        await user.save();
        return res.status(200).json({message: "User reported as spam"});
        
    } catch (err) {
        return res.status(500).json({
            message: "Unable to fetch user status..."
        })
        
    }
}