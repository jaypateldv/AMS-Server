const express = require("express")
const router = new express.Router()
const userControllers = require("../controllers/user.controllers")
const { isManagerSignUp } = require('../middlewares/roleMiddleware')
const authToken = require('../middlewares/authMiddleware')
router.get("/", async (req, res,) => {
    res.send("from user")
})

// Handling user Sign-up
router.post('/signup', isManagerSignUp, userControllers.signUp)

// Handling user Log-in
router.post('/login', userControllers.login)

// Display User Profile
router.get('/profile', authToken, userControllers.profile)

// Update User Profile
router.patch('/profileupdate', authToken, userControllers.profileUpdate)

// Delete User
router.patch('/deleteaccount', authToken, userControllers.deleteAccount)

module.exports = router


