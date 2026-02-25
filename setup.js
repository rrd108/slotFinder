const { google } = require('googleapis');

async function setup() {
  const auth = new google.auth.GoogleAuth({
    keyFile: './webmania-383615-ef4510e17e0f.json',
    scopes: [
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/calendar.readonly'
    ],
  });

  const authClient = await auth.getClient();
  const calendar = google.calendar({ version: 'v3', auth: authClient });

  const newCalId = 'rrd108@gmail.com';

  try {
    await calendar.calendarList.insert({ requestBody: { id: newCalId } });
    console.log(`Added: ${newCalId}`);
  } catch (e) {
    console.log(`Error or already exists: ${e.message}`);
  }

  const calList = await calendar.calendarList.list();
  console.log('Current calendars:', calList.data.items.map(c => c.id));
}

setup();
