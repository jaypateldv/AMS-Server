const express = require("express")
const router = new express.Router()
const  userControllers = require("../controllers/user.controllers")
router.get("/",async(req,res,)=>{
    res.send("from user")
})


router.post('/signup',userControllers.signUp)
router.post('/login',userControllers.login)
module.exports= router


