const express = require('express');
const User=require('../models/user.model')
const router= express.Router();
const {userSchema, loginSchema}=require('../validations/auth')
const {signAccessToken, signRefreshToken, verifyRefreshToken}= require('../utils/jwt');
router.post('/register', async (req,res, next)=>{
    try{
        const result= await userSchema.validateAsync(req.body);

        const {name,email,password} = req.body;
        if(!name ||!email ||!password){
            return res.status(400).json({message:'Please enter all fields'});
        }
        const user = await User.findOne({email:result.email});

        if(user){
                    return res.status(400).json({message:'User already exists'});
                }
        else{
            const newUser = new User({
                name,
                email,
                password
                
            });
            const savedUser = await newUser.save();
            const accessToken= await signAccessToken(savedUser._id)
            
            res.status(201).json({user:newUser, accessToken:accessToken });
        }

    }
    catch(err){
        if(err.isJoi === true) err.status=422;
            next(err);
        }
    
});
router.post('/login', async (req,res, next)=>{
    try{
        const {result}=await loginSchema.validateAsync(req.body);
       
        const user = await User.findOne({email:req.body.email});
        if(!user){
            return res.status(400).json({message:'User not found'});
        }
        const isMatch = await user.isCorrectPassword(req.body.password);
        if(!isMatch){
                    return res.status(400).json({message:'Invalid Password'});
                }
        const accessToken= await signAccessToken(user._id);
        const refreshToken= await signRefreshToken(user._id);
        res.status(200).json({user:user, accessToken:accessToken , refreshToken:refreshToken});
    }
    catch(err){
        if(err.isJoi === true) {
             res.status(422).json({message:err.details[0].message});
        }
      return  next(err);
    }

});
router.post('/refresh-token', async (req,res, next)=>{

    const {refreshToken}= req.body;
    if(!refreshToken){ res.send({message:'Refresh token is required'})};
   const userId= await verifyRefreshToken(refreshToken);
   const accessToken= await signAccessToken(userId);
   const refreshtoken= await signRefreshToken(userId);
    res.send({accessToken:accessToken, refreshToken:refreshtoken});
});
router.delete('/logout', async (req,res, next)=>{
     const {refreshToken}= req.body;
     if(!refreshToken){ res.send({message:'Refresh token is required'})};

    res.status(200).json({message:'Logout successful'});
});


module.exports=router;