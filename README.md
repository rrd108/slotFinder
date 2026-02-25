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
node index.js
```

## Usage

The script automatically discovers all calendars shared with the service account.

To query a specific date, edit `targetDate` in `index.js`:

```javascript
const targetDate = '2026-02-28';
```

## Troubleshooting

If no calendars appear on first run, the script needs to add them to its watchlist. This requires broader permissions. Run once with:

```javascript
scopes: [
  'https://www.googleapis.com/auth/calendar.readonly',
  'https://www.googleapis.com/auth/calendar'
]
```

After the first run, you can switch back to readonly scope.
