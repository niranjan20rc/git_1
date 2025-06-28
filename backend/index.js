// Require
const express=require("express");
const cors =require("cors");
const mongoose = require("mongoose");
require('dotenv').config();
 
// variables
const LINK=process.env.MONGO_URL;
const PORT=process.env.PORT || 8080;

 

// Middle Ware
const app = express();
app.use(cors());
app.use(express.json())



// DB 
mongoose.connect(LINK).then(()=>{console.log("DB CREATED")}).catch((e)=>{console.log(e.message)});
const my_schema = mongoose.Schema({
    name:{type:String,required:true},
    age:{type:String,required:true},
    email:{type:String,required:true},
    phone:{type:String,required:true},
    city:{type:String,required:true},
})
const MERN_DB = mongoose.model("MERN_DB",my_schema)

// REST API ROUTS

// GET
app.get("/users",async(req,res)=>{
    try{
        res.json(await MERN_DB.find());
    }
    catch(error){
        res.json(error.message);
    }
})

// POST
app.post("/users",async(req,res)=>{
    try{
        const newInfo = new MERN_DB(req.body);
        await newInfo.save();
        res.json(newInfo);
    }
    catch(error){
        res.json(error.message);
    }
})

//PUT
app.put("/users/:id",async(req,res)=>{
    try{
        res.json(await MERN_DB.findByIdAndUpdate(req.params.id,req.body));
    }
    catch(error){
        res.json(error.message);
    }
    
})


// DELETE
app.delete("/users/:id",async(req,res)=>{
    try{
        res.json(await MERN_DB.findByIdAndDelete(req.params.id));
    }
    catch(error){
        res.json(error.message);
    }
})


// SERVER RUN
app.listen(PORT,()=>{
    console.log("server is listening")
})
