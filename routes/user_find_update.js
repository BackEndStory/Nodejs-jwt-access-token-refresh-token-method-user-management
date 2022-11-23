const express = require('express');
const { verifyToken } = require("./middlewares");
const User = require('../models/user');
const upload = require('../imageUploader')
const router = express.Router();
const path = require('path');
let AWS = require("aws-sdk");
AWS.config.loadFromPath(__dirname + "/../config/awsconfig.json"); 
let s3 = new AWS.S3();

let multer = require("multer");
let multerS3 = require('multer-s3');
// let upload = multer({

//     storage: multerS3({
//         s3: s3,
//         bucket: "profile-user",
//         Key: function (req, file, cb) {
//              let extension = path.extname(file.originalname);
             
//              cb(null, req.Date.now().toString() + extension)
//         },
//         acl: 'public-read-write',
//     })

// })


router.post('/update_profile', upload.single('file'), async(req,res,next)=>{
  if(req.file === undefined){
     res.status(404).json({
        message:"error"
     })
  }
  else{
    res.status(200).json({
        message:'OK'
    })
  }

 

});


module.exports = router;