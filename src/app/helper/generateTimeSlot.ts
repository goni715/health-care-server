import { isBefore, parseISO, format, addMinutes, addDays } from "date-fns";



function generateTimeSlots(data) {
    const { startDate, endDate, startTime, endTime } = data;
    const start = parseISO(`${startDate}T${startTime}:00`);
    const end = parseISO(`${startDate}T${endTime}:00`);
    const results = [];

    let currentDate = parseISO(startDate);
    const endDateObj = parseISO(endDate);

    while (!isBefore(endDateObj, currentDate)) {
        let currentSlotStart = new Date(`${format(currentDate, 'yyyy-MM-dd')}T${startTime}:00`);
        const currentEndTime = new Date(`${format(currentDate, 'yyyy-MM-dd')}T${endTime}:00`);

        // Create slots for the current day
        while (isBefore(currentSlotStart, currentEndTime)) {
            const slotEnd = addMinutes(currentSlotStart, 30);

            if (isBefore(slotEnd, addMinutes(currentEndTime, 1))) { // Include slot that ends exactly at end time
                results.push({
                    date: format(currentDate, 'yyyy-MM-dd'),
                    startTime: format(currentSlotStart, 'HH:mm'),
                    endTime: format(slotEnd, 'HH:mm')
                });
            }
            currentSlotStart = slotEnd; // Move to the next 30-minute slot
        }

        // Move to the next day
        currentDate = addDays(currentDate, 1);
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
  ]