const express = require('express');
const { verifyToken } = require("./middlewares");
const User = require('../models/user');
const router = express.Router();
const path = require('path');
let AWS = require("aws-sdk");
const env = process.env;


router.post('/update_profile', async(req,res,next)=>{

    AWS.config.update({
      region: 'ap-northeast-2',
      accessKeyId: env.AWS_ACCESS_KEY_ID,
      secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
    });
    const s3 = new AWS.S3();
    console.log(req.file);
    //const fileContent = Buffer.from(req.file.data);
    const fileContent = Buffer.from(req.file);
    const params = {
        Bucket:'profile-user',
        //Key: req.files.data.name,
        Key: req.file.name,
        Body: fileContent,
        ACL: 'public-read',
        ContentType: req.file.mimetype
    }
    
    s3.upload(params, (err,data)=>{
      
      if(err){
        throw err;
      }
      res.send({
           "responsecode": 200,
           "response_message":"Success",
           "response_data": data
      });
    })


  });

  // if(req.file === undefined){
  //    res.status(404).json({
  //       message:"error"
  //    })
  // }
  // else{
  //   res.status(200).json({
  //       message:'OK'
  //   })
  // }

 




module.exports = router;