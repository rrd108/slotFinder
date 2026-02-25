const { google } = require('googleapis');

const TARGET_DATE = process.argv[2] || new Date().toISOString().split('T')[0];

const CALENDAR_CONTACTS = {
  'rrd@1108.cc': { name: 'Radharadhya Das', email: 'rrd@1108.cc' },
  'rrd108@gmail.com': { name: 'Radharadya dasa', email: 'rrd108@gmail.com' },
  '1108.cc_g4hha1ln9lar7jib60hes5nf54@group.calendar.google.com': { name: 'Csala', email: 'you@decide.com' },
};

async function getEvents() {
  const auth = new google.auth.GoogleAuth({
    keyFile: './webmania-383615-ef4510e17e0f.json',
    scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
  });

  const authClient = await auth.getClient();
  const calendar = google.calendar({ version: 'v3', auth: authClient });

  const calList = await calendar.calendarList.list();
  const calendars = calList.data.items.map(c => ({ 
    id: c.id, 
    name: c.summary,
    contact: CALENDAR_CONTACTS[c.id] || { name: c.summary, email: c.id }
  }));

  console.log(`Calendars (${calendars.length}):`);
  calendars.forEach(c => console.log(`  - ${c.id}: ${c.contact.name} (${c.contact.email})`));
  console.log('');

  let allBusy = [];

  for (const cal of calendars) {
    const res = await calendar.events.list({
      calendarId: cal.id,
      timeMin: `${TARGET_DATE}T00:00:00+01:00`,
      timeMax: `${TARGET_DATE}T23:59:59+01:00`,
      singleEvents: true,
      orderBy: 'startTime',
    });

    const events = res.data.items || [];
    events.forEach(e => {
      allBusy.push({
        calId: cal.id,
        name: cal.contact.name,
        email: cal.contact.email,
        start: e.start.dateTime.slice(11, 16),
        end: e.end.dateTime.slice(11, 16),
      });
    });
  }

  console.log(`Busy slots on ${TARGET_DATE}:`);
  allBusy.sort((a, b) => a.start.localeCompare(b.start));
  allBusy.forEach(b => {
    console.log(`${b.start} - ${b.end} | ${b.name} | ${b.email}`);
  });
}

getEvents();
