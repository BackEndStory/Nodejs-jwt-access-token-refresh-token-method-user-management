const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const path = require('path');
const env = process.env;


  
  
    const s3 = new AWS.S3({
        region: 'ap-northeast-2',
        accessKeyId: env.AWS_ACCESS_KEY_ID,
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
        });
    const upload = multer({
        
        storage: multerS3({
            s3:s3,
            bucket: 'profile-user',
            Body: buffer,
            ContentEncoding: 'base64',
            contentType: multerS3.AUTO_CONTENT_TYPE,
            key: (req,file,callback)=>{
            callback(null,`${Date.now()}_${req.file.originalname}`)      
            },
        
         }),
        acl:'public-read'
        
})    
module.exports = upload;

