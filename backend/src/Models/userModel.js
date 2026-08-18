import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import crypto from "node:crypto";

const userSchema = new mangoose.Schema({

    name:{
        type : String, 
        required:[true, "Please Enter Your Name"],
        trim:true,
        maxLength:[100, "Your name should be under 100 character"]
    }
})
