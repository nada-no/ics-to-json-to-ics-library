let events = [];

/**
 * Write ICS to a file in the current directory called event.ics
 * @param {Date} start - Starting time of the event.
 * @param {Date} end - Ending time of the event.
 * @param {String} title - Title of the event.
 * @param {String} location - Location of the event.
 */
function makeICS(start, end, title = "", location = "") {
	fs.writeFile(
		__dirname + "/calendar-events.ics",
		makeString(startDate, endDate, title, location),
		function (err) {
			if (err) {
				return console.log(err);
			}
		}
	);
}

/**
 * Output ICS as a string
 * @param {Array} events - The array of events
 * @returns {String} String representation of the ICS events
 */
function makeString(events) {
	let icsString = "BEGIN:VCALENDAR\r\n";
    console.log(events);
   
	icsString +=
		"VERSION:2.0\r\n" +
		"PRODID:-//calendar/webxdc//EN\r\n";
	for (const i in events) {
        let dateStart = new Date(events[i].year, events[i].month, events[i].day);
        let dateEnd = new Date(dateStart.getTime() + 86400000);
		icsString += "BEGIN:VEVENT\r\n" +
			`UID:${events[i].id}\r\n` +
			`DTSTAMP:${toDateTime(new Date())}\r\n` +
            `CREATED:${toDateTime(new Date())}\r\n` +
			`DTSTART;VALUE=DATE:${toDateTime(dateStart)}\r\n` +
            //maybe do something with this longer than a day events later
			`DTEND;VALUE=DATE:${toDateTime(dateEnd)}\r\n` + 
			`SUMMARY:${events[i].data}\r\n` +
            `DESCRIPTION:${events[i].data}\r\n` +
 			// `LOCATION:${events[i][location]? events[i].location : ""}\r\n` +
			"END:VEVENT\r\n";
	}
	icsString += "END:VCALENDAR";
	return icsString;
}

// JS Date Format -> ICS Date Format
function toDateTime(date) {
	const isoString = date.toISOString();
	const formattedString = isoString.replace(/[-:.]/g, "");
	return formattedString.substring(0, formattedString.length - 4) + "Z";
}

// Set info in the clipboard
function setClipboard(){
    let data = makeString(events);
    console.log(data);
    navigator.clipboard.writeText(data);
}

// // Not important unless sequencing events
// function generateUID() {
// 	const randomInt = Math.floor(1000 + Math.random() * 9000);
// 	return "uid" + randomInt + "@charliepeters.me";
// }

window.webxdc.setUpdateListener(function (update) {
    if (update.payload.addition) {
        events.push(update.payload);
    } 
});