const User = require('../models/user.model')
const Auditorium = require('../models/auditorium.model')


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
        res.status(200).send({managerList,count:managerList.length})

    } catch (err) {
        res.status(400).send(err.message)
    }
}

const setManagerStatus = async (req, res) => {
    try {
        const Updatedmanager = await User.findByIdAndUpdate(req.body.managerId, { verificationStatus: req.body.verificationStatus }, { new: true, runValidators: true })
        if (Updatedmanager) {
            if (Updatedmanager.verificationStatus == "true")
                a = 1
            else
                a = 1

            res.status(200).send(Updatedmanager)
        }
        else res.status(404).send("Manager not found..")
    } catch (err) {
        res.status(404).send(err.message)
    }
}

const acceptedList = async (req, res) => {
    try {
        var pendingList = []
        const managerList = await User.find({ verificationStatus: "true", role: "manager" })
        res.status(200).send(managerList)
    } catch (err) {
        res.status(400).send(err.message)
    }
}
const rejectedList = async (req, res) => {
    try {
        var pendingList = []
        const managerList = await User.find({ verificationStatus: "false", role: "manager" })
        res.status(200).send(managerList)
    } catch (err) {
        res.status(400).send(err.message)
    }
}

const removeUserById = async (req, res) => {
    try {
        const user = await User.findByIdAndRemove(req.params.userId)
        await TicketTransaction.deleteMany({ user_id: req.params.userId })
        res.status(200).send({ message: `User - ${user.name} hase been deleted successfully...` })
    } catch (err) {
        res.status(400).send({ error: err.message })
    }
}

const allUsers = async (req,res) => {
    try {
        const users = await User.find(req.query)
        res.status(200).send(users)
    } catch (err) {
        res.status(400).send({ error: err.message })
    }
}

module.exports = {
    managerList,
    setManagerStatus,
    acceptedList,
    rejectedList,
    removeUserById,
    allUsers
}