const express = require("express")
const router = new express.Router()
const adminCtrl = require('../controllers/admin.controllers')
const authToken   = require('../middlewares/authMiddleware')
const  {isAdmin}  = require('../middlewares/roleMiddleware')

router.get("/",async(req,res,)=>{
    res.send("from admin")
})

// see all manager
router.get("/admin/managerList",[authToken,isAdmin], adminCtrl.managerList) 

// for changing manager status
router.post('/admin/setManagerStatus', [authToken, isAdmin], adminCtrl.setManagerStatus)


module.exports= router


