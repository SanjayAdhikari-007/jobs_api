const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:[true,"Please provide name"],
            minlength:2,
            maxlength:50,
        },
        email:{
            type:String,
            required:[true,"Please provide email"],
            match:[
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                "Please provide valid email"
            ],
            unique:true,
        },
        password:{
            type:String,
            required:[true,"Please provide password"],
            minlength:6,
        },

    }
);

UserSchema.pre('save',async function(){
    const salt = await bcrypt.genSalt(10);
    // Here this points to document.
    this.password = await bcrypt.hash(this.password,salt);
    console.log(this.password);
});

UserSchema.methods.createJWT = function(){
    const token =  jwt.sign({userId:this._id, username:this.name},process.env.SECRET_KEY,{
        expiresIn:process.env.TOKEN_EXPIRES_IN
    });
    console.log("Token is ",token);
    return token;
};

UserSchema.methods.comparePassword = async function(candidatePassword){
    const isMatch = await bcrypt.compare(candidatePassword,this.password);
    return isMatch;
}

module.exports = mongoose.model('User',UserSchema);