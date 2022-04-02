var dateTime = require('node-datetime');

const isValidBookingDate = (date) => {
    var current_date = dateTime.create();
    var bookingDate = dateTime.create(date)
    current_date = current_date.format('Y-m-d');
    bookingDate = bookingDate.format('Y-m-d');
    if (current_date == bookingDate)
        return "Can not select current date"
    else if (current_date > bookingDate)
        return "can not select past date"
    else return "booked"
}

const isValidEventUpdateDate = (event_date) => {
    let current_date = Date.now()
    current_date = new Date(current_date)
    event_date = new Date(event_date)
    const diff = (event_date.getTime() - current_date.getTime()) / (1000 * 60 * 60 * 24)
    console.log("date diff : ", diff, current_date, event_date)
    if (diff > 2)
        return true
}

const convertDate = (date) => {
    var date = dateTime.create(date)
    date = date.format('Y-m-d');
    return date
}

const getMergeTimeSlots = (bookedSlots) => {
    let sl = [];
    for (let t of bookedSlots) {
        sl = sl.concat(t.timeSlots);
    }
    return sl;
}

const AvailableTime = (allTimings, bookedTimings, availableTimings) => {
    availableTimings = allTimings.filter(
      (element) => !bookedTimings.includes(element.slot)
    );
    return availableTimings;
  }

module.exports = {
    isValidBookingDate, 
    isValidEventUpdateDate, 
    convertDate, 
    getMergeTimeSlots,
    AvailableTime }