const sgmail = require("@sendgrid/mail")
sgmail.setApiKey(process.env.sendGridApiKey)

const sendWelcomeMail = (email, name) => {
    sgmail.send({
        to: email,
        from: "pateljaykjp1@gmail.com",
        subject: "Thanks for joining us!",
        html: `
                <h1>Welcome To Auditoria <b>${name}</b></h1>
                <br><p>We would like to thank you for signing up to our service.We would love to hear what you think, if there is anything we can improve. If you have any questions, please reply to this Email. We are always happy to help!</p>
                <br><br> <h5><b>Thank You!</b></h5>            
             `
    })
}

const sendCancelationMail = (email, name) => {
    sgmail.send({
        to: email,
        from: "pateljaykjp1@gmail.com",
        subject: "You deleted your Account!",
        html: `
                <h1>Dear ${name},</h1>
                <br><p>Your Auditoria account has been deleted! Give your valuable feedback to us over a mail.</p>
                <br><br> 
                <p>  Have a nice day!</p>
                <h5><b>Thank You!</b></h5> 
            `
    })
}

const sendVerificationPendingMail = (email, name) => {
    sgmail.send({
        to: email,
        from: "pateljaykjp1@gmail.com",
        subject: "Regarding Verification",
        html: `
                <h1>Welcome ${name} to Auditoria </h1>
                <br><p> We have received your request, Once we verified it we will let you know.</p>
                <br><br>
                <h5><b>Thank You for joining us!</b></h5> 
            `
    })
}

const sendVerificationAcceptedMail = (email, name) => {
    sgmail.send({
        to: email,
        from: "pateljaykjp1@gmail.com",
        subject: "Regarding Accepted Request",
        html: `
                <h1>Welcome again ${name}</h1>
                <br><p><b>Congratulations!</b> Your request has been Accepted. Now you are part of Auditoria.</p>
                <br><br>
                <h5><b>Thank You!</b></h5> 
             `
    })
}
const sendVerificationRejectedMail = (email, name) => {
    sgmail.send({
        to: email,
        from: "pateljaykjp1@gmail.com",
        subject: "Regarding Rejected Request",
        html: `
                <h1>Welcome ${name}</h1>
                <br><p>We have seen your request but Sorry to say, your request has been Rejected. Now you are part of Auditoria. We hope to see you again</p>
                <br><br>
                <h5><b>Thank You!</b></h5> 
            `
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