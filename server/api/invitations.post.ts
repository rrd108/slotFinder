import Database from 'better-sqlite3'
import { join } from 'node:path'
import { createCalendarEvent } from '../utils/google-calendar'

const dbPath = join(process.cwd(), 'data', 'users.db')
const db = new Database(dbPath)

export default defineEventHandler(async (event) => {
  const user = event.context.nuxtUsers?.user
  if (!user?.id) {
    throw createError({ statusCode: 401, message: 'Nincs bejelentkezve' })
  }

  const body = await readBody(event)
  const { title, start_time, end_time, attendee_ids, calendar_id } = body

  if (!title || !start_time || !end_time || !attendee_ids || !calendar_id) {
    throw createError({ statusCode: 400, message: 'Hiányzó adatok' })
  }

  const attendeeEmails = db.prepare(`
    SELECT email FROM users WHERE id IN (${attendee_ids.join(',')})
  `).all() as { email: string }[]

  let googleEventId = null
  try {
    const eventResult = await createCalendarEvent(calendar_id, {
      summary: title,
      start: start_time,
      end: end_time,
      attendees: attendeeEmails.map(a => a.email)
    })
    googleEventId = eventResult.id
  } catch (e) {
    console.error('Error creating Google Calendar event:', e)
  }

  const result = db.prepare(`
    INSERT INTO invitations (organizer_id, title, start_time, end_time, attendee_ids, google_event_id, status)
    VALUES (?, ?, ?, ?, ?, ?, 'sent')
  `).run(user.id, title, start_time, end_time, JSON.stringify(attendee_ids), googleEventId)

  return { id: result.lastInsertRowid, success: true }
})
