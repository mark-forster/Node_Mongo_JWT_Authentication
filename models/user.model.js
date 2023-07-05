const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password:{
        type: String,
        required: true
    }
});



userSchema.pre('save', async function(next){
        try{
            const user = this;
              user.password = await bcrypt.hash(user.password, 8);
            next();
        }   
        catch(err){
                    next(err);
         }
});


userSchema.methods.isCorrectPassword = async function(password){
   try{
    return await bcrypt.compare(password, this.password);
   }
   catch(err){
    throw err;
      }
};

module.exports =new mongoose.model('User', userSchema);