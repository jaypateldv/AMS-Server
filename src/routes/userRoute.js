const express = require("express")
const router = new express.Router()

router.get("/",async(req,res,)=>{
    res.send("from user")
})

module.exports= router


