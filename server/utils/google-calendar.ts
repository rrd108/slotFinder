import { google } from 'googleapis'
import { join } from 'node:path'

const SCOPES = [
  'https://www.googleapis.com/auth/calendar.readonly',
  'https://www.googleapis.com/auth/calendar.events'
]

const keyFile = join(process.cwd(), 'webmania-383615-ef4510e17e0f.json')

let calendarClient: any = null

async function getCalendarClient() {
  if (calendarClient) return calendarClient

  const auth = new google.auth.GoogleAuth({
    keyFile,
    scopes: SCOPES
  })

  const authClient = await auth.getClient()
  calendarClient = google.calendar({ version: 'v3', auth: authClient })
  return calendarClient
}

export async function addCalendarToWatchlist(calendarId: string) {
  const calendar = await getCalendarClient()
  
  try {
    await calendar.calendarList.insert({
      requestBody: { id: calendarId }
    })
    return true
  } catch (e: any) {
    if (e.message?.includes('already exists')) return true
    throw e
  }
}

export async function getBusySlots(calendarIds: string[], date: string) {
  const calendar = await getCalendarClient()
  
  const start = `${date}T00:00:00+01:00`
  const end = `${date}T23:59:59+01:00`

  const allBusy: any[] = []

  for (const calId of calendarIds) {
    try {
      const res = await calendar.events.list({
        calendarId: calId,
        timeMin: start,
        timeMax: end,
        singleEvents: true,
        orderBy: 'startTime'
      })

      const events = res.data.items || []
      events.forEach((event: any) => {
        allBusy.push({
          calendarId: calId,
          start: event.start.dateTime || event.start.date,
          end: event.end.dateTime || event.end.date,
          summary: event.summary || '(nincs cím)'
        })
      })
    } catch (e) {
      console.error(`Error fetching calendar ${calId}:`, e)
    }
  }

  return allBusy.sort((a, b) => a.start.localeCompare(b.start))
}

export async function createCalendarEvent(
  calendarId: string,
  event: {
    summary: string
    start: string
    end: string
    attendees?: string[]
  }
) {
  const calendar = await getCalendarClient()

  const res = await calendar.events.insert({
    calendarId,
    requestBody: {
      summary: event.summary,
      start: { dateTime: event.start },
      end: { dateTime: event.end },
      attendees: event.attendees?.map(email => ({ email })),
      reminders: {
        useDefault: true
      }
    }
  })

  return res.data
}

export async function getAllUserCalendars() {
  const calendar = await getCalendarClient()
  
  const res = await calendar.calendarList.list()
  return res.data.items || []
}
