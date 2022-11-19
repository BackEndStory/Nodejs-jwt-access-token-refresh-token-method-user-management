const { sign, verify, refreshVerify } = require('./jwt_make');
const jwt = require('jsonwebtoken');

const refresh = async (req, res) => {

  if (req.headers.authorization && req.headers.refresh) {
        const authToken = req.headers.authorization.split('Bearer ')[1];
        const refreshToken = req.headers.refresh;

        const authResult = verify(authToken);
        const decoded = jwt.decode(authToken);
        
        if (decoded === null) {
            res.status(401).send({
                state: false,
                message: 'No content.',
            });
            }
        const refreshResult = refreshVerify(refreshToken, decoded.id);
        if (authResult.state === false && authResult.message === 'jwt expired') {

            if (refreshResult.state === false) {
                res.status(401).send({
                state: false,
                message: 'No authorized.',
                });
            } else {
            
                const newAccessToken = sign(decoded.id);

                res.status(200).send({ 
                state: true,
                data: {
                    accessToken: "Bearer " + newAccessToken,
                    refreshToken,
                },
                });
            }
       }else {
    
        res.status(400).send({
            state: false,
            message: 'Acess token is not expired.',
        });
        }
  } else { 
    res.status(400).send({
        state: false,
      message: 'Access token and refresh token are need for refresh.',
    });
  }
};

module.exports = refresh;