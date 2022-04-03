const User = require('../models/user.model')
const Auditorium = require('../models/auditorium.model')
const email = require("../email/account")

// display manager list to admin so admin can accept or reject
const managerList = async (req, res) => {
    try {
        let query = req.query.status ? { verificationStatus: req.query.status, role: "manager" } : {}
        let skip = req.query.skip ? Number(req.query.skip) : 0
        const managerList = await User.aggregate([
            { $match: query },
            {
                $lookup:
                    { from: "auditoria", localField: "_id", foreignField: "manager_id", as: "auditorium" }
            },
            { $project: { password: 0, tokens: 0, "auditorium.auditoriumImages": 0 } },
            { $skip: skip }
        ])
        // res.status(200).send({ count: pendingList.length, pendingList })
        res.status(200).send({ managerList, count: managerList.length })

    } catch (err) {
        res.status(400).send(err.message)
    }
}

// for update status of manager after accepting manager's request
const setManagerStatus = async (req, res) => {
    try {
        const Updatedmanager = await User.findByIdAndUpdate(req.body.managerId, { verificationStatus: req.body.verificationStatus }, { new: true, runValidators: true })
        if (Updatedmanager) {
            if (Updatedmanager.verificationStatus == "true")
                email.sendVerificationAcceptedMail(Updatedmanager.email, Updatedmanager.name)
            else
                email.sendVerificationRejectedMail(Updatedmanager.email, Updatedmanager.name)

            res.status(200).send(Updatedmanager)
        }
        else res.status(404).send("Manager not found..")
    } catch (err) {
        res.status(404).send(err.message)
    }
}

// for displaying all accepted manager list to admin
const acceptedList = async (req, res) => {
    try {
        var pendingList = []
        const managerList = await User.find({ verificationStatus: "true", role: "manager" })
        res.status(200).send(managerList)
    } catch (err) {
        res.status(400).send(err.message)
    }
}

// for displaying all rejected manager list to admin
const rejectedList = async (req, res) => {
    try {
        var pendingList = []
        const managerList = await User.find({ verificationStatus: "false", role: "manager" })
        res.status(200).send(managerList)
    } catch (err) {
        res.status(400).send(err.message)
    }
}

// for admin to remove user by id (admin can remove reported user)
const removeUserById = async (req, res) => {
    try {
        const user = await User.findByIdAndRemove(req.params.userId)
        await TicketTransaction.deleteMany({ user_id: req.params.userId })
        res.status(200).send({ message: `User - ${user.name} hase been deleted successfully...` })
    } catch (err) {
        res.status(400).send({ error: err.message })
    }
}

// for displaying all user list to admin
const allUsers = async (req, res) => {
    try {
        const users = await User.find(req.query)
        res.status(200).send(users)
    } catch (err) {
        res.status(400).send({ error: err.message })
    }
}

// exporting all admin function
module.exports = {
    managerList,
    setManagerStatus,
    acceptedList,
    rejectedList,
    removeUserById,
    allUsers
}