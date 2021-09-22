import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";
import generateToken from "../utils/genToken.js";
import fast2sms from "fast-two-sms";

import jwt from "jsonwebtoken";
import _ from 'lodash';

export const registerUser = asyncHandler(async(req, res) => {
    const { name,phone_number} = req.body;
  
    const userExists = await User.findOne({ phone_number });
  
    if (userExists) {
      res.status(400).json({
        success:false,
        error:'An Account exists with this Phone Number'
      })
    }
    else{
      
        var randomNo=Math.floor(100000 + Math.random() * 900000);
        var textmsg= "Hello "+name+" ThankYou for registering with our service."+"\n"+"Your OTP for signing up is "+randomNo
        // const response= await fast2sms.sendMessage({authorization:process.env.SMS_API_KEY,message:textmsg,numbers:[req.body.phone_number]})
        const response=randomNo
        // console.log(textmsg);
        // console.log(response);
        const newUser = new User({
          name,
          phone_number,
          otp:randomNo
        });
        await newUser.save();
        res.status(200).json({
          response
        })
    }
    
});
export const verifyUserSignIn = asyncHandler(async(req,res)=>{
  const { otp,phone_number} = req.body;
  const userExists = await User.findOne({ phone_number });
  if(!userExists){
    res.status(400).json({
      success:false,
      error:'No Account exists with this Phone Number'
    })
  }
  else{
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
      await User.findOneAndDelete({phone_number});
      res.status(400).json({
        success:false,
        error:'Invalid OTP try again'
      })
    }
  }

})
export const loginUser = asyncHandler(async(req,res)=>{
    const {phone_number}=req.body;
    const userExists = await User.findOne({ phone_number });
    if(!userExists){
      res.status(400).json({
        success:false,
        error:'No Account exists with this Phone Number try Signing Up'
      })
    }
    else{
      var randomNo=Math.floor(100000 + Math.random() * 900000);
      var textmsg= "Hello "+userExists.name+"\n"+"Your OTP for login is "+randomNo
      // const response= await fast2sms.sendMessage({authorization:process.env.SMS_API_KEY,message:textmsg,numbers:[req.body.phone_number]});
      const response=randomNo;
      userExists.otp=randomNo;
      await userExists.save();
      res.status(201).json({response});
    }
    
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
    res.status(200).json({
      success:false,
      error:'Invalid OTP try again'
    });
  }

});