const User = require("../models/user.model")

const login = async (req, res, next) => {
    console.log("in user.controllers => logjn")
    try{
        const user = await User.findByCredentials(req.body.email,req.body.password)
        const authtoken = await user.generateAuthToken()
        res.status(200).send({user,authtoken})

    }catch(error){
        res.status(400).send({error:error.message})
    }

}

const signUp = async (req, res, next) => {
    console.log("in user.controllers => signup") 
    const user = new User({
        name:req.body.name,
        email:req.body.email,
        password:req.body.password,
        contact : req.body.contact,
        role:req.body.role
    })
    try{
        await user.save()
        const authToken = await user.generateAuthToken()
        return res.status(201).send({user,authToken})
    }catch(error){
        res.status(400).send({error:error.message})
    }
}

module.exports = {login,signUp}