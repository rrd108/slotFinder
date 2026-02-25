const { google } = require('googleapis');

async function getCalendars() {
  const auth = new google.auth.GoogleAuth({
    keyFile: './webmania-383615-ef4510e17e0f.json',
    scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
  });

  const authClient = await auth.getClient();
  const calendar = google.calendar({ version: 'v3', auth: authClient });

  const calList = await calendar.calendarList.list();
  
  calList.data.items.forEach(c => {
    console.log(`ID: ${c.id}`);
    console.log(`  Summary: ${c.summary}`);
    console.log(`  Description: ${c.description}`);
    console.log(`  TimeZone: ${c.timeZone}`);
    console.log(`  SummaryOverride: ${c.summaryOverride}`);
    console.log(`  Location: ${c.location}`);
    console.log('');
  });
}

getCalendars();
