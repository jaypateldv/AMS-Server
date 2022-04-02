const User = require('../models/user.model')
const Auditorium = require('../models/auditorium.model') 


const managerList = async (req,res) => {
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
            {$skip:skip}
        ])
        // res.status(200).send({ count: pendingList.length, pendingList })
        res.status(200).send(managerList)

    } catch (err) {
        res.status(400).send(err.message)
    }
}

const setManagerStatus = async (req,res) => {
    try {
        const Updatedmanager = await User.findByIdAndUpdate(req.body.managerId, { verificationStatus: req.body.verificationStatus }, { new: true, runValidators: true })
        if (Updatedmanager) {
            if (Updatedmanager.verificationStatus == "true")
                a=1
            else
            a=1

            res.status(200).send(Updatedmanager)
        }
        else res.status(404).send("Manager not found..")
    } catch (err) {
        res.status(404).send(err.message)
    }
}
module.exports = {
    managerList,
   setManagerStatus
}