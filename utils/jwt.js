const JWT= require('jsonwebtoken');
const createError = require('http-errors');

module.exports = {
    //signAccessToken
    signAccessToken:(userId)=>{
        return new Promise((resolve, reject) =>{
            const payload = {
                // iss :'accounts.examplesoft.com',

            };
            const secret= process.env.ACCESS_TOKEN_SECRET;
            const options= {
                expiresIn:"1h",
                issuer :'accounts.myaccount.com',
                audience : userId.toString(),
            };
            JWT.sign(payload,secret,options, (err,token)=>{
                if(err){
                          reject(err);
                         return reject(createError.InternalServerError());
                        }
                    resolve(token); 
            });

        }) 
    },
    // verifyAccessToken
    verifyAccessToken:(req,res,next)=>{
        if(!req.headers.authorization){
            return next(createError.Unauthorized());
    }
    const authHeader= req.headers.authorization.split(' ');
    const bearerToken= authHeader[1];
    console.log(bearerToken);
    JWT.verify(bearerToken,process.env.ACCESS_TOKEN_SECRET, (err,payload)=>{
        if(err){
                const message = err.name === 'JsonWebTokenError'?'Unauthorized' : err.message;
                return next(createError.Unauthorized(message));
        }
                req.payload = payload;
                next();
    })
},

// signRefreshToken
    signRefreshToken:(userId)=>{
        return new Promise((resolve, reject) =>{
            const payload = {
                // iss :'accounts.examplesoft.com',

            };
            const secret= process.env.REFRESH_TOKEN_SECRET;
            const options= {
                expiresIn:"1y",
                issuer :'accounts.myaccount.com',
                audience : userId.toString(),
            };
            JWT.sign(payload,secret,options, (err,token)=>{
                if(err){
                          reject(err);
                         return reject(createError.InternalServerError());
                        }
                    resolve(token); 
            });

        }) 

},
// verifyRefreshToken
    verifyRefreshToken:(verifyRefreshToken)=>{
        return new Promise((resolve, reject) =>{
            JWT.verify(verifyRefreshToken,process.env.REFRESH_TOKEN_SECRET, (err,payload)=>{
                if(err){
                        reject(err);
                        return reject(createError.Unauthorized());
                }
                const userId=payload.audience;
                resolve(userId);
            });
        });
}
}