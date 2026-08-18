import express from "express";
import dotenv from "dotenv";
import cors from "cors"
import cookieparser from "cookie-parser"
import connectDB from "./utils/db.js";

dotenv.config();
const app = express();

app.use(express.json({limit:"100mb"}))

app.use(express.urlencoded({limit:"100mb" , extended:true}))

app.use(cookieparser())

const PORT = process.env.PORT;

app.get("/",(req,res)=>{
    res.send("HomelyHub server is running sucessfully")
})
connectDB()
app.listen(PORT,()=>{
    console.log(`App is Running On PORT number: ${PORT}`);
})
    