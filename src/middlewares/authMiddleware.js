const jwt = require("jsonwebtoken")
const User = require("../models/user.model")

const authToken = async (req, res, next) => {
    console.log("auth")
    try {
        const token = req.header('Authorization').split(" ")[1]
        console.log("get  token", token)
        const decoded = jwt.verify(token, process.env.JWTSECRETE)
        const user = await User.findOne({ _id: decoded._id})
        if (!user) {
            throw new Error("User not authorized.")
        }
        req.token = token
        req.user = user
    } catch (err) {
        console.log("in authToken catch")
        return res.status(401).send({ error: "Please authenticate first." })
    }
    next()
}

module.exports = authToken 