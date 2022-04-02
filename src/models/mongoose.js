const mongoose = require("mongoose")
mongoose.connect(process.env.MONGODBURL,{
    useNewUrlParser:true,
    useUnifiedTopology:true
    // useCreateIndex:true
    //useFindAndModify:false

})
mongoose.connection.on('connected',()=>{
    console.log("Connected to Mongo Database")
})
mongoose.connection.on('error',(err)=>{
    console.log("Enable to connect!",err)
})