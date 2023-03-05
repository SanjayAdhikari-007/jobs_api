const User = require('../models/User');
const jwt = require('jsonwebtoken');
const {UnauthenticatedError} = require('../errors/index');

const auth = async (req,res,next)=>{
    //check header
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith("Bearer ")){
        throw new UnauthenticatedError("Authentication Invalid");
    }
    const token = authHeader.split(" ")[1];
    try{
        const payload = jwt.verify(token,process.env.SECRET_KEY);
        req.user = {userId : payload.userId, name:payload.username}
        next();
    }catch(e){
        throw new UnauthenticatedError("Authentication Invalid. Please login again");
    }
};

module.exports = auth;
