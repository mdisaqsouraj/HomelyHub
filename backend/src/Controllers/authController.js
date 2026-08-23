import {User} from "../Models/userModel.js";
import jwt from "jsonwebtoken";
import crypto from "node:crypto";
import imagekit from "../utils/ImagekitIO.js";
import { sendMail, forgotPasswordMailGenContent } from "../utils/mail.js";
import { signinToken, createSendToken, defaultAvatarUrl, filterObj } from "../utils/token.js";


const signup = async(req,res)=>{

    try{ 
        
        const newUser = await User.create ({
        name:req.body.name,
        email:req.body.email,
        phoneNumber:req.body.phoneNumber,
        password:req.body.password,
        passwordConfirm:req.body.passwordConfirm,
        avatar:{url:req.body.avatar || defaultAvatarUrl(req.body.name) }
    })
    createSendToken(newUser,201,res)
}
    catch(error){
       // const duplicateField = Object.keys(error.keyPattern || {})[0];
       // const message = duplicateField? 'The ${duplicateField} already exist':
      // error.message;
       res.status(400).json({message : error.message})

    }
}
const login = async(req,res) =>{
    try{
        const{email,password} = req.body;
        if(!email || !password){
            throw new Error("Please Enter Email & Password")

        }
        const user = await User.findOne({email}).select("+password")

        if(!user || (await user.correctPassword(password,user.password))=== false){
            throw new Error("Incorrect email or password")

        }
        createSendToken(user,200,res)
    }catch(error){
        res.status(400).json({status:"fail", message:error.message})
    }
}

const protect = async(req,res,next)=>{
    try{
    let token;
    
    if(
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")

    ){
        token = req.headers.authorization.split(" ")[1]
    }else if(
        req.cookies.jwt && req.cookies.jwt !== "loggedout"){
            token = req.cookies.jwt
        }
    if(!token){
        throw new Error("You are not logged in!! Please login top access")
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const currentUser = await User.findById(decoded)
    if(!currentUser){
        throw new Error("The User belonging to the token Doesn't exists")
    }
    if(currentUser.changedPasswordAfter(decoded)){
        throw new Error("The user recently changed the password, Please login again")
    }

    req.user = currentUser;
    next();

}catch(error){
    res.status(401).json({
        status:fail,
        message:error.message
    })

}
}


export{signup,login,protect};