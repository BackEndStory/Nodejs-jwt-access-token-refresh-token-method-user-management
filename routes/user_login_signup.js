const express = require('express');
const { verifyToken } = require("./middlewares");
const jwt = require('../jwt_token/jwt_make');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const redis = require('redis');
const access_refresh = require('../jwt_token/access_refresh');
const redisClient = redis.createClient(process.env.REDIS_PORT);
redisClient.connect();
const router = express.Router();

router.post('/login', async(req,res,next)=>{
    const {user_identify, user_password} = req.body;
    try{
        const user_identify_sign = await User.findAll({ attributes:['id','role','password'],
              where:{ identifier:user_identify }});
        if(user_identify_sign == "" || user_identify_sign == null || user_identify_sign == undefined ){
            return res.status(404).json({ code:404, message: "Id can't find"});
        }
        const  user_identify_sign_id = user_identify_sign.map((el) => el.id);
        const  user_password_sign = user_identify_sign.map((el) => el.password);
        const  user_role = user_identify_sign.map((el) => el.role);
        
        const compare_password = await bcrypt.compare(user_password,user_password_sign[0]);
        if(!compare_password){
            return res.status(404).json({code:404, message: "Password can't find"});
        }
        const accessToken = "Bearer " + jwt.sign(user_identify_sign_id,user_role);
        const refreshToken = "Bearer " + jwt.refresh();  
          
        redisClient.set(String(user_identify_sign_id[0]), refreshToken);
        if(user_role[0] === false){
            res.status(200).send({ 
                state: true,
                data: {
                accessToken,
                refreshToken,
                },
                role: false
            });
        }
        else{
            res.status(200).send({ 
                state: true,
                data: {
                accessToken,
                refreshToken,
                },
                role: true
            });       
        }
    }
catch(error){
    console.error(error);
    res.status(500).json({ "code": 500});
}
});

router.get('/access_refresh', access_refresh);

router.post('/logout',async(req,res,next)=>{
    const token = req.headers.authorization.split('Bearer ')[1]; 
    try{ 
        const decode = jwt.decode(token); 
        if (decode === null) {
            res.status(404).send({
                code:404,
                state: false,
                message: 'No content.',
            });}
        await redisClient.del(String(decode.id));
        return res.status(200).send({ 
            code:200,
            message:"Ok"
        });       
        }catch(error){
         return res.status(401).json('Unauthorized access'); 
        }
});

router.post('/sign_up_sign_id',async(req,res,next)=>{
      const overlap_id = req.body.overlap_id;
    try{ 
        const user_identify_sign = await User.findAll({ 
            where:{ identifier:overlap_id }
        });
        console.log(user_identify_sign);   
        if(user_identify_sign == ""){
          return res.status(200).json({
                code:200,
                message:"u can use id!"
          });
        }
        else{
            return res.status(203).json({
                code:203,
                message:"u can't use id!"
        });
    }
        }catch(error){
         return res.status(500).json({
              code:500,
              message:'Server Error'
            }); 
        }
});

router.post('/sign_up_nickname',async(req,res,next)=>{
    const overlap_nickname = req.body.overlap_nickname;
  try{ 
      const user_nickname_sign = await User.findAll({ 
          where:{ nickname:overlap_nickname }
      });
      console.log(user_nickname_sign);   
      if(user_nickname_sign == ""){
        return res.status(200).json({
              code:200,
              message:"u can use nickname!"
        });
      }
      else{
          return res.status(203).json({
              code:203,
              message:"u can't use nickname!"
      });
  }
      }catch(error){
       return res.status(500).json({
            code:500,
            message:'Server Error'
          }); 
      }
});

router.post('/sign_up',async(req,res,next)=>{
    const { id,password,email,nickname }= req.body;
  try{ 
       const hash_password =  await bcrypt.hash(password,12);
       const overlap_email = await User.findAll({ 
        where:{ email:email }
    });
    console.log(overlap_email);
       if(overlap_email == ""){
            await User.create({ 
                identifier:id,
                role: 0,
                password:hash_password,
                email: email,
                nickname:nickname
            });

            return res.status(200).json({
                code:200,
                message:"Ok"
            });
       }
        return res.status(203).json({
            code:203,
            message:'Already exist email'
        }); 
      }catch(error){
       return res.status(500).json({
            code:500,
            message:'Server Error'
          }); 
     }
});


module.exports = router;