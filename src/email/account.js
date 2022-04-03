const sgmail = require("@sendgrid/mail")
sgmail.setApiKey(process.env.sendGridApiKey)

const sendWelcomeMail = (email, name) => {
    sgmail.send({
        to: email,
        from: "pateljaykjp1@gmail.com",
        subject: "Thanks for joining us!",
        text: `Welcome to the app ${name} , Let me know how you get along with the app.`
    })
}

const sendCancelationMail = (email, name) => {
    sgmail.send({
        to: email,
        from: "pateljaykjp1@gmail.com",
        subject: "Sorry to see you go!",
        text: `Goodbye ${name}, I hope to see you back sometime soon.`
    })
}

const sendVerificationPendingMail = (email, name) => {
    sgmail.send({
        to: email,
        from: "pateljaykjp1@gmail.com",
        subject: "Regarding verification",
        text: `Welcome ${name} to AMS System, we have received your request, once we verified it we'll let you know.\n Thank you for joining us.`
    })
}

const sendVerificationAcceptedMail = (email, name) => {
    sgmail.send({
        to: email,
        from: "pateljaykjp1@gmail.com",
        subject: "Regarding Accepted Request",
        text: `Welcome again ${name}, we have accepted your request, now you are part of AMS system`
    })
}
const sendVerificationRejectedMail = (email, name) => {
    sgmail.send({
        to: email,
        from: "pateljaykjp1@gmail.com",
        subject: "Regarding Rejected Request",
        text:`Hello ${name}, we have seen your request and sorry to say you that your request is not accepted.\nI hope to see you again , Thank you.`
    })
}
const sendTicketConfirmationMail = (name,eventName,amout,eventDate,seatNumbers)=>{
    sgmail.send({
        to: email,
        from: "pateljaykjp1@gmail.com",
        subject: "Tickets Confirmation",
        text:`Hello ${name}, your tickets for ${eventName} on date ${eventDate} is confirmed.\npayment aount : ${amout}\nseats numbers : ${seatNumbers}`
    })
}

const sendTicketFaliedMail = (name,eventName,amout,eventDate,seatNumbers)=>{
    sgmail.send({
        to: email,
        from: "pateljaykjp1@gmail.com",
        subject: "Tickets Falied",
        text:`Hello ${name}, your tickets for ${eventName} on date ${eventDate} is falied.\npayment aount : ${amout}\nseats numbers : ${seatNumbers}`
    })
}
const sendCancleTicketMail = (name,eventName,eventDate,totalPrice)=>{
    sgmail.send({
        to: email,
        from: "pateljaykjp1@gmail.com",
        subject: "Tickets Cancellation",
        text:`Hello ${name}, your tickets for ${eventName} on date ${eventDate} is cancele now.\npayment aount : ${totalPrice}`
    })
}
const sendAuditoriumBookingConfirmationMail=(name,booking,cost)=>{
    sgmail.send({
        to: email,
        from: "pateljaykjp1@gmail.com",
        subject: "Auditorium Booking Confirmation",
        text:`Hello ${name}, your auditorium booking with ${booking.event_name} is confirmed.\nEvent Details,\n Date : ${booking.event_date},Time Slots : ${booking.timeSlots}`
    })
}
const sendAuditoriumBookingFaliedMail=(name,booking,cost)=>{
    sgmail.send({
        to: email,
        from: "pateljaykjp1@gmail.com",
        subject: "Auditorium Booking Confirmation",
        text:`Hello ${name}, your auditorium booking with ${booking.event_name} is falied.`
    })
}
module.exports = {
    sendWelcomeMail,
    sendCancelationMail,
    sendVerificationAcceptedMail,
    sendVerificationPendingMail,
    sendVerificationRejectedMail,
    sendTicketConfirmationMail,
    sendTicketFaliedMail,
    sendCancleTicketMail,
    sendAuditoriumBookingConfirmationMail,
    sendAuditoriumBookingFaliedMail
}
