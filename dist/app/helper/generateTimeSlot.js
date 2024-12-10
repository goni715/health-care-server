"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const date_fns_1 = require("date-fns");
function generateTimeSlots(data) {
    const { startDate, endDate, startTime, endTime } = data;
    const start = (0, date_fns_1.parseISO)(`${startDate}T${startTime}:00`);
    const end = (0, date_fns_1.parseISO)(`${startDate}T${endTime}:00`);
    const results = [];
    let currentDate = (0, date_fns_1.parseISO)(startDate);
    const endDateObj = (0, date_fns_1.parseISO)(endDate);
    while (!(0, date_fns_1.isBefore)(endDateObj, currentDate)) {
        let currentSlotStart = new Date(`${(0, date_fns_1.format)(currentDate, 'yyyy-MM-dd')}T${startTime}:00`);
        const currentEndTime = new Date(`${(0, date_fns_1.format)(currentDate, 'yyyy-MM-dd')}T${endTime}:00`);
        // Create slots for the current day
        while ((0, date_fns_1.isBefore)(currentSlotStart, currentEndTime)) {
            const slotEnd = (0, date_fns_1.addMinutes)(currentSlotStart, 30);
            if ((0, date_fns_1.isBefore)(slotEnd, (0, date_fns_1.addMinutes)(currentEndTime, 1))) { // Include slot that ends exactly at end time
                results.push({
                    date: (0, date_fns_1.format)(currentDate, 'yyyy-MM-dd'),
                    startTime: (0, date_fns_1.format)(currentSlotStart, 'HH:mm'),
                    endTime: (0, date_fns_1.format)(slotEnd, 'HH:mm')
                });
            }
            currentSlotStart = slotEnd; // Move to the next 30-minute slot
        }
        // Move to the next day
        currentDate = (0, date_fns_1.addDays)(currentDate, 1);
    }
    return results;
}
// Example usage:
const data = {
    startDate: "2024-11-11",
    endDate: "2024-11-15",
    startTime: "10:00",
    endTime: "12:30"
};
console.log(generateTimeSlots(data));
const output = [
    { date: '2024-11-11', startTime: '10:00', endTime: '10:30' },
    { date: '2024-11-11', startTime: '10:30', endTime: '11:00' },
    { date: '2024-11-11', startTime: '11:00', endTime: '11:30' },
    { date: '2024-11-11', startTime: '11:30', endTime: '12:00' },
    { date: '2024-11-11', startTime: '12:00', endTime: '12:30' },
    { date: '2024-11-12', startTime: '10:00', endTime: '10:30' },
    { date: '2024-11-12', startTime: '10:30', endTime: '11:00' },
    { date: '2024-11-12', startTime: '11:00', endTime: '11:30' },
    { date: '2024-11-12', startTime: '11:30', endTime: '12:00' },
    { date: '2024-11-12', startTime: '12:00', endTime: '12:30' },
    { date: '2024-11-13', startTime: '10:00', endTime: '10:30' },
    { date: '2024-11-13', startTime: '10:30', endTime: '11:00' },
    { date: '2024-11-13', startTime: '11:00', endTime: '11:30' },
    { date: '2024-11-13', startTime: '11:30', endTime: '12:00' },
    { date: '2024-11-13', startTime: '12:00', endTime: '12:30' },
    { date: '2024-11-14', startTime: '10:00', endTime: '10:30' },
    { date: '2024-11-14', startTime: '10:30', endTime: '11:00' },
    { date: '2024-11-14', startTime: '11:00', endTime: '11:30' },
    { date: '2024-11-14', startTime: '11:30', endTime: '12:00' },
    { date: '2024-11-14', startTime: '12:00', endTime: '12:30' },
    { date: '2024-11-15', startTime: '10:00', endTime: '10:30' },
    { date: '2024-11-15', startTime: '10:30', endTime: '11:00' },
    { date: '2024-11-15', startTime: '11:00', endTime: '11:30' },
    { date: '2024-11-15', startTime: '11:30', endTime: '12:00' },
    { date: '2024-11-15', startTime: '12:00', endTime: '12:30' }
];
