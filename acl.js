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
  const calendars = calList.data.items.map(c => ({ id: c.id, name: c.summary }));

  // Get ACLs to find owners
  for (const cal of calendars) {
    try {
      const acl = await calendar.acl.list({ calendarId: cal.id });
      const owner = acl.data.items?.find(r => r.role === 'owner');
      console.log(`${cal.id}`);
      console.log(`  Name: ${cal.name}`);
      console.log(`  Owner scope: ${JSON.stringify(owner?.scope)}`);
    } catch (e) {
      console.log(`${cal.id}: ${cal.name} - no ACL access`);
    }
  }
}

getEvents();
