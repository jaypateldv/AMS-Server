const express = require("express")
const router = new express.Router()
const userControllers = require("../controllers/user.controllers")
const {isManagerSignUp} = require('../middlewares/roleMiddleware')
const authToken = require('../middlewares/authMiddleware')
router.get("/", async (req, res,) => {
    res.send("from user")
})

router.post('/signup',isManagerSignUp, userControllers.signUp)
router.post('/login', userControllers.login)
router.get('/profile',authToken,userControllers.profile)
router.patch('/profileupdate',authToken,userControllers.profileUpdate)
router.patch('/deleteaccount',authToken,userControllers.deleteAccount)
module.exports = router

 
