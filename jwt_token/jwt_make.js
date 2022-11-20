const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const redis = require('redis');
const secret = process.env.SECRET;


module.exports = {
  sign: (user_id,user_role) => { 
    const payload = { 
      id: user_id,
      role: user_role,
    };

    return jwt.sign(payload, secret, { 
      algorithm: 'HS256', 
      expiresIn: '3m', 	  
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
      expiresIn: '8m',
    });
  },
  refreshVerify: async (token, userId) => {
      const redisClient = redis.createClient(process.env.REDIS_PORT);
      await redisClient.connect();
      const getAsync = promisify(redisClient.get).bind(redisClient);
      
      try {
        const data = await getAsync(String(userId)); 
        if (token === data) {
          try {
            jwt.verify(token, secret);
            return true;
          } catch (err) {
            return false;
          }
        } else {
          return false;
        }
      } catch (err) {
        return false;
      }
  },
};