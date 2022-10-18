const User = require("../models/user.model")
const Auditorium = require("../models/auditorium.model")
const email = require("../email/account")

// Handling User Log-in
const login = async (req, res, next) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const authToken = await user.generateAuthToken()
        // req.header.authorization = "Bearer " + authToken
        console.log("user",user);
        res.status(200).send({ user, authToken })
    } catch (error) {
        res.status(400).send({ error: error.message })
    }
}

// Handling User Sign-up
const signUp = async (req, res, next) => {
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
            email.sendVerificationPendingMail(user.email, user.name)
            req.header.authorization = "Bearer " + authToken
            return res.status(201).send({ username: user.name, auditoriumname: auditorium.auditoriumName, authToken })
        }
        email.sendWelcomeMail(user.email, user.name)
        return res.status(201).send({ user, authToken })
    } catch (error) {
        res.status(400).send({ error: error.message })
    }
}

// For Displaying User Profile
const profile = async (req, res, next) => {
    console.log("user.controllers => profile")
    res.status(200).send(req.user)
}

// For Updating User Profile
const profileUpdate = async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ["name", "email", "password", "age", "contact"]
    const isValidUpdate = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidUpdate)
        return res.status(400).send("Invalid Updates..")
    try {
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        if (!req.user)
            return res.status(404).send("User not found!")
        res.status(200).send(req.user)
    } catch (error) {
        res.status(400).send(error.message)
    }
}

// Delete User Account
const deleteAccount = async (req, res) => {
    try {
        const user = req.user
        await req.user.remove()
        email.sendCancelationMail(user.email, user.name)
        res.status(200).send(req.user)
    } catch (error) {
        res.status(400).send(error.message)
    }
}

module.exports = { login, signUp, profile, profileUpdate, deleteAccount }