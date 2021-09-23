import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";
import generateToken from "../utils/genToken.js";
import fast2sms from "fast-two-sms";

import jwt from "jsonwebtoken";
import _ from 'lodash';


export const loginUser = asyncHandler(async(req,res)=>{
  var name;
    const {phone_number}=req.body;
    const userExists = await User.findOne({ phone_number });
    if(userExists){var name=userExists.name;}
    var randomNo=Math.floor(100000 + Math.random() * 900000);
    if(!userExists){
      const newUser = new User({
        phone_number,
        otp:randomNo
      });
      await newUser.save();
      name='User'
    } 
      var textmsg= "Hello "+name+"\n"+"Your OTP for login is "+randomNo
      // const response= await fast2sms.sendMessage({authorization:process.env.SMS_API_KEY,message:textmsg,numbers:[req.body.phone_number]});
      const response=textmsg;
      if(userExists){
      userExists.otp=randomNo;
      await userExists.save();
    }
      
      res.status(201).json({response});
    
});
export const verifyUserLogIn = asyncHandler(async(req,res)=>{
  const { otp,phone_number} = req.body;
  const userExists = await User.findOne({ phone_number });
  if(userExists.otp==otp){
    userExists.otp='';
    await userExists.save();
      //issue token
      res.status(200).json({
        _id: userExists._id,
        name: userExists.name,
        token: generateToken(userExists._id),
      });
  }
  else{
    userExists.otp='';
    await userExists.save();
    res.status(400).json({
      success:false,
      error:'Invalid OTP try again'
    });
  }

});

export const updateProfile = asyncHandler(async(req,res)=>{
const{img_url,name,phone_number}=req.body;
const userExists = await User.findOne({ phone_number });
if(!userExists){
  res.status(400).json({
    success:false,
    error:'no account found'
  });
}
if(img_url!=undefined){
userExists.img_url=img_url;}
if(name!=undefined){
userExists.name=name;}
const user = await userExists.save();
if(user){
  res.status(200).json({
    success:true,
    data:user
  });
}
else{
  res.status(400).json({
    success:false,
    error:'something went wrong'
  });
}

})