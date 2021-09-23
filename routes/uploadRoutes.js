
import dotenv from "dotenv";
import express from "express";
import multer from "multer";
import AWS from "aws-sdk";
import { v4 as uuidv4 } from 'uuid'
// const AWS = require('aws-sdk')
// const uuid = require('uuid/v4')
const router = express.Router();
dotenv.config();


const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET
})

const storage = multer.memoryStorage({
    destination: function(req, file, callback) {
        callback(null, '')
    }
})

const upload = multer({storage}).single('image')

router.post('/',upload,(req, res) => {

    let myFile = req.file.originalname.split(".")
    const fileType = myFile[myFile.length - 1]
    if (fileType =='jpg' || fileType=='png' || fileType=='jpeg' )  
    {
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `${uuidv4()}.${fileType}`,
        Body: req.file.buffer,
        ContentType: 'image/'+fileType
    }

    s3.upload(params, (error, data) => {
        if(error){
            res.status(500).send(error)
        }

        res.status(200).send(data)
    })
    }
    else{
      res.status(500).json({
        error:"images only"
      })
    }
    
})

export default router;