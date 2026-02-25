const { google } = require('googleapis');

const TARGET_DATE = process.argv[2] || new Date().toISOString().split('T')[0];

async function getEvents() {
  const auth = new google.auth.GoogleAuth({
    keyFile: './webmania-383615-ef4510e17e0f.json',
    scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
  });

  const authClient = await auth.getClient();
  const calendar = google.calendar({ version: 'v3', auth: authClient });

  const calList = await calendar.calendarList.list();
  const calendars = calList.data.items.map(c => c.id);

  if (calendars.length === 0) {
    console.log('No calendars found. Sharing calendars with service account...');
    console.log('Run once with broader scope to auto-discover:');
    console.log('https://github.com/anomalyco/opencode');
    return;
  }

  console.log(`Calendars: ${calendars.length}`);
  let allBusy = [];

  for (const calId of calendars) {
    const res = await calendar.events.list({
      calendarId: calId,
      timeMin: `${TARGET_DATE}T00:00:00+01:00`,
      timeMax: `${TARGET_DATE}T23:59:59+01:00`,
      singleEvents: true,
      orderBy: 'startTime',
    });

    const events = res.data.items || [];
    events.forEach(e => {
      allBusy.push({
        cal: calId.split('@')[0],
        start: e.start.dateTime.slice(11, 16),
        end: e.end.dateTime.slice(11, 16)
      });
    });
  }

  console.log(`\nBusy slots on ${TARGET_DATE}:`);
  allBusy.sort((a, b) => a.start.localeCompare(b.start));
  allBusy.forEach(b => console.log(`${b.cal}: ${b.start} - ${b.end}`));
}

getEvents();
