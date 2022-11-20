const { sign, verify, refreshVerify } = require('./jwt_make');
const jwt = require('jsonwebtoken');
const redis = require('redis');
const redisClient = redis.createClient(process.env.REDIS_PORT);
const { verifyToken } = require("../routes/middlewares");

const access_refresh = async (req, res) => {
  const authToken = req.headers.authorization.split('Bearer ')[1];
  const authResult = verify(authToken);
  const decoded = jwt.decode(authToken);

  if (req.headers.authorization && req.headers.refresh) {
  
        const refreshToken = req.headers.refresh;

        
        
        if (req.decoded === null) {
            res.status(404).send({
                code:404,
                state: false,
                message: 'No content.',
            });
            }
        const refreshResult =  refreshVerify(refreshToken, decoded.id);
        if (authResult.state === false && authResult.message === 'jwt expired') {
            
            if (refreshResult.state === false) {
                res.status(419).send({
                    code:419,
                    state: false,
                    message: 'No authorized.',
                });
            } else {
            
                const newAccessToken = sign(decoded.id);
                await redisClient.connect();
                const user_refreshToken = await redisClient.get(String(decoded.id));
                res.status(200).send({ 
                    code:200,
                state: true,
                data: {
                    accessToken: "Bearer " + newAccessToken,
                    refreshToken: user_refreshToken
                },
                });
            }
       }else {
       
        res.status(400).send({
          ok: false,
          message: 'Access token is not expired!',
        });
      }
  } else if(req.headers.authorization){ 
    if (authResult.state === false && authResult.message === 'jwt expired'){
        return res.status(419).json({
            code: 419,
            message: '토큰이 만료되었습니다',
          });
    }
        res.status(203).send({
            code:203,
            state: true,
            message: 'u can do automatic login.',
        });
   
    
  }
};

module.exports = access_refresh;