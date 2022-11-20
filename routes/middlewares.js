const jwt = require('jsonwebtoken');
const secret = process.env.SECRET;

exports.verifyToken = (req, res, next) => {
    try {
      const token = req.headers.authorization;
      const organized_token = token.split('Bearer ')[1];
      req.decoded = jwt.verify(organized_token, secret);
      return next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') { // 유효기간 초과
        return res.status(419).json({
          code: 419,
          message: '토큰이 만료되었습니다',
        });
      }
      return res.status(401).json({
        code: 401,
        message: '유효하지 않은 토큰입니다',
      });
    }
}