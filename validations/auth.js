const Joi= require('joi');

const userSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(2).required()
});


const loginSchema= Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(2).required()
})

module.exports = {userSchema, loginSchema};