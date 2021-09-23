import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String,default:''  },
    phone_number: { type: Number,required:true },
    otp:{type:Number,default:''},
    publicKey:{type:String,default:''},
    img_url:{type:String,default:''}
  },
  { timestamps: true }
);



const User = mongoose.model("User", userSchema);

export default User;