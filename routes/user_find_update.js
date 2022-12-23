const express = require('express');
const { verifyToken } = require("./middlewares");
const User = require('../models/user');
const upload = require('../imageUploader');
const router = express.Router();





// router.post('/update_profile', verifyToken, upload.single('image'), async(req,res,next)=>{
//   try{ 
//     console.log(req.file.location);
//     const image = req.file;

//     if (image === undefined) {
//       return res.status(400).json( { 
//       message:"이미지가 존재하지 않습니다.",
//       code:400   
//       });
//     }
//     await User.update({ prifile_img:image.location},{
//      where:{id:req.decoded.id},
//     }); 
    

//     res.status(200).json({
//       code:200,
//       image_url:image.location});
//     }
//     catch(error){
//       console.error(error);
//       res.status(500).json({ "code": 500});
//     }
//   });


 




module.exports = router;