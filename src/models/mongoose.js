const mongoose = require("mongoose")
mongoose.connect(process.env.MONGODBURL,{
    useNewUrlParser:true,
    useUnifiedTopology:true
})
mongoose.connection.on('connected',()=>{
    console.log("Connected to MongoDB Database")
})
mongoose.connection.on('error',(err)=>{
    console.log("Enable to connect!",err)
})