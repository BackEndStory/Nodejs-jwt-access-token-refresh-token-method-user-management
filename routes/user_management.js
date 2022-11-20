const express = require('express');
const { verifyToken } = require("./middlewares");
const jwt = require('../jwt_token/jwt_make');
//const {sign} = require('../jwt_token/jwt_make')
const User = require('../models/user');
const bcrypt = require('bcrypt');
const redis = require('redis');
const access_refresh = require('../jwt_token/access_refresh');
const redisClient = redis.createClient(process.env.REDIS_PORT);
const router = express.Router();

router.post('/login', async(req,res,next)=>{
    const {user_identify, user_password} = req.body;
    try{
        const user_identify_sign = await User.findAll({ attributes:['id','role','password'],where:{ identifier:user_identify }});
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
          
        await redisClient.connect();
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
        await redisClient.connect();
        await redisClient.del(String(decode.id));
        return res.status(200).send({ 
            code:200,
            message:"Ok"
        });       
        }catch(error){
         return res.status(401).json('Unauthorized access'); 
        }
});

module.exports = router;