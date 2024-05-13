import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";

const protect = asyncHandler(async (req, res, next) => {
  let token;

  token = req.cookies.jwt || null;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      req.user = await User.findById(decoded.userId).select("-password");

      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, Invalid token");
    }
  } else {
    res.status(401);
    throw new Error("Not authorized, No token");
  }
});

const isAdmin = asyncHandler ( async (req, res, next) => {
  let token;
  token = req.cookies.jwt || null;
  if(token){
    try{
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      const user = await User.findById(decoded.userId)
      if(user?.role === "admin" || user?.role === "dev"){
        next()
      }else{
        res.status(401);
        throw new Error("No Access, Don't have the permission")
      }
    }catch(error){
      res.status(401);
      throw new Error("Not authorized, No token");
    }
  }
});

const isMember = asyncHandler ( async (req, res, next) => {
  let token;
  token = req.cookies.jwt || null;
  if(token){
    try{
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      const user = await User.findById(decoded.userId)
      if(user?.role === "member" || user?.role === "dev"){
        next()
      }else{
        res.status(401);
        throw new Error("No Access, Don't have the permission")
      }
    }catch(error){
      res.status(401);
      throw new Error("Not authorized, No token");
    }
  }
})

export { protect, isAdmin, isMember };
