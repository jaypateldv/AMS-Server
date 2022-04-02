const express = require("express")
const router = new express.Router()
const adminCtrl = require('../controllers/admin.controllers')


router.get("/",async(req,res,)=>{
    res.send("from admin")
})

// see all manager
router.get("/admin/managerList", [authToken, isAdmin], adminCtrl.managerList()) 


// router.post('/admin/setManagerStatus', [authToken, isAdmin], async (req, res) => {
//     try {
//         const Updatedmanager = await User.findByIdAndUpdate(req.body.managerId, { verificationStatus: req.body.verificationStatus }, { new: true, runValidators: true })
//         if (Updatedmanager) {
//             if (Updatedmanager.verificationStatus == "true")
//                 a=1
//             else
//             a=1

//             res.status(200).send(Updatedmanager)
//         }
//         else res.status(404).send("Manager not found..")
//     } catch (err) {
//         res.status(404).send(err.message)
//     }
// })


module.exports= router


