import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import crypto, { randomBytes } from "node:crypto";
import { timeStamp } from "node:console";

const userSchema = new mongoose.Schema({

    name:{
        type : String, 
        required:[true, "Please Enter Your Name"],
        trim:true,
        maxLength:[100, "Your name should be under 100 character"]
    },
    email:{
        type : String,
        required:[true, "Please enter your email"],
        unique:true,
        lowercase:true,
        trim:true,
        validate:[validator.isEmail, "Please Enter valid email address"]
    },
    password:{
        type : String,
        required:[true, "Please enter the password"],
        minlength:[8,"Your password should be atleast 8 character longer"],
        maxlength:[20,"Your password should be atmost 20 character longer"],
        select:false

    },
    passwordConfirm:{
        type: String,
        required:[true,"Please confirm your password"],
        validate: {
            validator: function(el){
            return el === this.password;
        },
        message:"Passwords are not the same !"
    }
},
    phoneNumber:{
        type: String,
        required: true,
        trim:true,
        unique:true
    },
    role:{
        type:String,
        required:true,
        enum:["user","admin"],
        default:"user"
    },
    avatar:{
        url:{type:String},
        public_id:{type:String}
    },
    passwordChangedAt:{
        type:Date
    },
    passwordResetToken:{
        type:String,
        select:false,
        index:true,
    },
    passwordResetExpired:{
        select:false,
        type:Date
    }

},
{timestamps:true}
)

userSchema.set("toJSON",{
        tranform : function(doc,ret){
            delete ret.password;
            delete ret.passwordConfirm;
            delete ret.passwordResetExpired;
            delete ret.passwordResetToken;
            delete ret.__v;
            return ret;
        }
    }
)

userSchema.pre("save", async function (){
    if(!this.isModified("password") )return ;

    this.password = await bcrypt.hash(this.password,12)
    this.passwordConfirm = undefined;
    
});

userSchema.methods.correctPassword = async function(candidatePassword,userPassword){
 return await bcrypt.compare(candidatePassword,userPassword)
}

userSchema.methods.changedPasswordAfter = function (JWTTimestamp){
    if(this.passwordChangedAt){
        const changedTimeStamp = parseInt(
            this.passwordChangedAt.getTime()/1000,10
        );
    return JWTTimestamp < changedTimeStamp
    
    }
    return false;

}

userSchema.methods.createPasswordResetToken = function(){
    const resetToken = crypto.randomBytes(32).toString("hex")
    this.passwordResetToken = crypto.createHash("sha256")
    .update(resetToken)
    .digest("hex");
    this.passwordResetExpired = Date.now() +10 *60*1000;
    return resetToken;
}


const User = mongoose.model("User",userSchema);

export{User};