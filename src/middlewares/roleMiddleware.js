const isManagerSignUp = async (req, res, next) => {
    console.log("rolemidldeware.js => isManagerSignUp  check")

    if (req.body.role = "manager") {
        const requireFields = ['name', 'email', 'auditoriumName', 'address', 'city', 'capacity', 'costPerHour']

        const manager = await Object.keys(req.body)
        const isValidManager =await requireFields.every((field) => manager.includes(field))
        if (!isValidManager)
            return res.status(400).send({ error: "Please fill all required fields" })
    }
    next()
}

const isManager = async (req, res, next) => {
    console.log("rolemidldeware.js => isManager() - role check  check",req.user.role)
    if (req.user.role !== "manager")
        return res.status(401).send({ error: "Unauthorized Perosn.." })
    next()
}

const isAdmin = async (req, res, next) => {
    console.log("rolemidldeware.js => isAdmin() - role check  check")
    if (req.user.role !== "admin")
        return res.status(401).send({ error: "Unauthorized Perosn.." })
    next()
}

const isOrganizer = async (req, res, next) => {
    console.log("rolemidldeware.js => isOrganizer() - role check  check")
    if (req.user.role !== "organizer")
        return res.status(401).send({ error: "Unauthorized Perosn.." })
    next()
}

const isCustomer = async (req, res, next) => {
    console.log("rolemidldeware.js => isCustomer() - role check  check")
    if (req.user.role !== "customer")
        return res.status(401).send({ error: "Unauthorized Perosn.." })
    next()
}

module.exports = { isManager, isAdmin, isCustomer, isOrganizer, isManagerSignUp }