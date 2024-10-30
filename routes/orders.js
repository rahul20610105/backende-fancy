import express from "express"
import Order from "../models/Order.js"

const orderRouter=express.Router()

//middleware to verufy user (eg:jwt or sessions based authentication)
const verifyUser=(req,res,next)=>{
//your identificaton logic here (eg:jwt or session check)
const userId=req.user?._id;
if (!userId) return res.status(401).json({message:"unauthorized"})
    req.userId=userId;
next();
};


//get all orders for the authenticated user 

orderRouter.get('/',verifyUser,async(req,res)=>{
    try {
const orders=await Order.find({userId:req.userId})
res.json(orders)
    }catch(error){
console.log('error fetching orders',error)
res.status(500).json({message:"error fetching orders"})
    }
});

export default orderRouter