const express = require("express")
const router = new express.Router()
const userControllers = require("../controllers/user.controllers")
const {isManagerSignUp} = require('../middlewares/roleMiddleware')

router.get("/", async (req, res,) => {
    res.send("from user")
})


router.post('/signup',isManagerSignUp, userControllers.signUp)
router.post('/login', userControllers.login)
module.exports = router


