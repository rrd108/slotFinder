# Google Calendar Reader

Minimal Node.js script to read Google Calendar events using a service account.

## Setup

### 1. Create a Google Service Account

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or use existing)
3. Go to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **Service Account**
5. Fill in details and create the service account
6. Go to the **Keys** tab → **Add Key** → **Create new key** → **JSON**
7. Save the JSON file to this folder (e.g., `service-account.json`)

### 2. Enable Google Calendar API

1. Go to **APIs & Services** → **Library**
2. Search for "Google Calendar API" and enable it

### 3. Share Your Calendar with the Service Account

1. Go to [Google Calendar](https://calendar.google.com/)
2. Click the settings icon (⚙️) next to the calendar you want to share
3. Click **Share with specific people**
4. Add the service account email from your JSON file:
   ```
   your-service-account@project.iam.gserviceaccount.com
   ```
5. Set permission to **See all event details**

### 4. Run the Script

```bash
npm install
```

On first run, the script will discover your calendars. Run with a date:

```bash
node index.js 2026-02-25
```

Without a date, it shows today's events.

## Adding New Calendars

Google Service Accounts don't auto-discover newly shared calendars. To add one:

1. Get the **Calendar ID** from Calendar Settings (bottom of the page)
2. Edit `CALENDAR_CONTACTS` in `index.js`:
   ```javascript
   const CALENDAR_CONTACTS = {
     'calendar-id@group.calendar.google.com': { name: 'John', email: 'john@example.com' },
   };
   ```
3. The script will automatically include it on next run

## Output

The script shows busy slots with calendar owner info:

```
Calendars (3):
  - rrd@1108.cc: Radharadhya Das (rrd@1108.cc)
  - 1108.cc_g4hha1ln9lar7jib60hes5nf54@group.calendar.google.com: Csala (you@decide.com)
  - rrd108@gmail.com: Radharadya dasa (rrd108@gmail.com)

Busy slots on 2026-02-25:
09:00 - 11:00 | Radharadhya Das | rrd@1108.cc
12:00 - 13:00 | Radharadhya Das | rrd@1108.cc
13:00 - 15:00 | Radharadya dasa | rrd108@gmail.com
```

## Troubleshooting

### No calendars appear

If no calendars appear on first run, you need to add them manually. The script needs broader permissions once:

```javascript
scopes: [
  'https://www.googleapis.com/auth/calendar.readonly',
  'https://www.googleapis.com/auth/calendar'
]
```

After the first run, switch back to readonly scope.
