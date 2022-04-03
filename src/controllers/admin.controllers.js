const User = require('../models/user.model')
const email = require("../email/account")
const AuditoriumBooking = require('../models/auditoriumBooking.model')
const TicketTransaction = require('../models/ticketTransaction.model')

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
        res.status(400).send(err.message)
    }
}

// for admin to remove user by id (admin can remove reported user)
const removeUserById = async (req, res) => {
    try {
        console.log(("id",req.params.userId));
        const user = await User.findByIdAndRemove(req.params.userId)
        await TicketTransaction.deleteMany({ user_id: req.params.userId })
        email.sendCancelationMail(user.email, user.name)
        res.status(200).send({ message: `User - ${user.name} hase been deleted successfully...` })
    } catch (err) {
        res.status(400).send({ error: err.message })
    }
}

// for displaying all user list to admin
const allUsers = async (req, res) => {
    try {
        // const users = await User.find({role:{$not:{$eq:"admin"}}})
        const users =  await User.aggregate([
            {$match:{role:{$not:{$eq:"admin"}}}},
            {$sort:{role:-1}}
        ])
        res.status(200).send(users)
    } catch (err) {
        res.status(400).send({ error: err.message })
    }
}

// for displaying All Events
const getAllEvents = async (req, res) => {
    try {
        const eventDetails = await AuditoriumBooking.aggregate([
            {$match:{}},
            {$lookup:{
                "from":"users",
                "localField":"organizer_id",
                "foreignField":"_id",
                "as":"bookedBy"
            }},
            {$project:{"bookedBy.email":0,"bookedBy.password":0,"bookedBy.verificationStatus":0,"bookedBy.role":0,"bookedBy.contact":0,"bookedBy.updatedAt":0,"bookedBy.createdAt":0}}
        ])
        res.status(200).send(eventDetails)
    }
    catch (err) {
        res.status(400).send(err.message)
    }
}

// exporting all admin function
module.exports = {
    managerList,
    setManagerStatus,
    getAllEvents,
    removeUserById,
    allUsers
}