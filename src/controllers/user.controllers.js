const User = require("../models/user.model")
const Auditorium = require("../models/auditorium.model")

const login = async (req, res, next) => {
    console.log("in user.controllers => logjn")
    try{
        const user = await User.findByCredentials(req.body.email,req.body.password)
        const authtoken = await user.generateAuthToken()
        console.log("auth token",authtoken)
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

        if(req.body.role==="manager"){
            const auditorium = new Auditorium({
                auditoriumName:req.body.auditoriumName,
                address:req.body.address,
                capacity:req.body.capacity,
                city:req.body.city,
                manager_id:user._id,
                costPerHour:req.body.costPerHour,
                auditoriumDescription:req.body.auditoriumDescription
            })

            await auditorium.save()
            return res.status(201).send({ username: user.name, auditoriumname: auditorium.auditoriumName, authToken })
        }
        return res.status(201).send({user,authToken})
    }catch(error){
        res.status(400).send({error:error.message})
    }
}

module.exports = {login,signUp}