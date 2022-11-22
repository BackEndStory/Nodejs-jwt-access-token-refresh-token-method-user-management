
const jwt = require('jsonwebtoken');
const redis = require('redis');
const secret = process.env.SECRET;
const redisClient = redis.createClient(process.env.REDIS_PORT);
redisClient.connect();

module.exports = {
  sign: (user_id,user_role) => { 
    const payload = { 
      id: user_id,
      role: user_role,
    };

    return jwt.sign(payload, secret, { 
      algorithm: 'HS256', 
      expiresIn: '1m', 	  
    });
  },
  decode:(token) => {
    let decoded = null;
    decoded = jwt.decode(token, secret);
      return {
        message: true,
        id: decoded.id,
        role: decoded.role,
  }
  },
  verify: (token) => { 
    let decoded = null;
    try {
      decoded = jwt.verify(token, secret);
      return {
        message: true,
        id: decoded.id,
        role: decoded.role,
      };
    } catch (err) {
      return {
        state: false,
        message: err.message,
      };
    }
  },
  refresh: () => {
    return jwt.sign({}, secret, { 
      algorithm: 'HS256',
      expiresIn: '2m',
    });
  },
  refreshVerify: async (token, userId) => {
      console.log(userId);
      console.log(token);
    try{
      const data = await redisClient.get(String(userId));
      console.log(data.split('Bearer ')[1]);
      if (token === data.split('Bearer ')[1]) {
        try {
          jwt.verify(data.split('Bearer ')[1], secret);
          return {state:true};
        } catch (error) {
            return {state:false}; 
        }
      } else {
        return {state:false};
      }
      } catch (err) {
        return {state:false};
      }
  }
};