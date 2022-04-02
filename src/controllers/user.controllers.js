const User = require("../models/user.model")
const Auditorium = require("../models/auditorium.model")
const { Router } = require("express")

const login = async (req, res, next) => {
    console.log("in user.controllers => logjn")
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const authToken = await user.generateAuthToken()
        console.log("auth token", authToken)
        req.header.authorization = "Bearer " + authToken
        console.log("headre token",req.header)
        res.status(200).send({ user, authToken })

    } catch (error) {
        res.status(400).send({ error: error.message })
    }

}

const signUp = async (req, res, next) => {
    console.log("in user.controllers => signup")
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        contact: req.body.contact,
        role: req.body.role
    })
    try {
        await user.save()
        const authToken = await user.generateAuthToken()

        if (req.body.role === "manager") {
            const auditorium = new Auditorium({
                auditoriumName: req.body.auditoriumName,
                address: req.body.address,
                capacity: req.body.capacity,
                city: req.body.city,
                manager_id: user._id,
                costPerHour: req.body.costPerHour,
                auditoriumDescription: req.body.auditoriumDescription
            })

            await auditorium.save()
            req.header.authorization = "Bearer " + authtoken

            return res.status(201).send({ username: user.name, auditoriumname: auditorium.auditoriumName, authToken })
        }
        req.he
        return res.status(201).send({ user, authToken })
    } catch (error) {
        res.status(400).send({ error: error.message })
    }
}

const profile = async (req, res, next) => {
    console.log("user.controllers => profile")
    res.status(200).send(req.user)
}

const profileUpdate= async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ["name", "email", "password", "age","contact"]
    const isValidUpdate = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidUpdate)
        return res.status(400).send("Invalid Updates..")
    //console.log("_id : ", req.user._id)
    try {
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        //const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        if (!req.user)
            return res.status(404).send("User not found")
        res.status(200).send(req.user)
    } catch (err) {
        res.status(400).send(err.message)
    }
}

const deleteAccount = async (req, res) => {
    try {
        await req.user.remove()
        res.status(200).send(req.user)
    } catch (err) {
        res.status(400).send(err)
    }
}
module.exports = { login, signUp, profile ,profileUpdate , deleteAccount}