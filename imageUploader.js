const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');
require('dotenv').config();
const env = process.env;



const s3 = new aws.S3({
  accessKeyId: env.AWS_ACCESS_KEY,
  secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  region : "ap-northeast-2"
});
console.log(s3);

const upload = multer({
  
  storage: multerS3({
      s3: s3,
      bucket:'profile-user',
      acl:'public-read',
      contentType: multerS3.AUTO_CONTENT_TYPE,
      key: function(req, file, cb){
          cb(null,`profile_image/${Date.now()}_${file.originalname} `); // 이름 설정
      }
  })
})
console.log(upload);
module.exports = multer(upload);

