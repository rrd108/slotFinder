import Database from 'better-sqlite3'
import { join } from 'node:path'
import { addCalendarToWatchlist } from '../utils/google-calendar'

const dbPath = join(process.cwd(), 'data', 'users.db')
const db = new Database(dbPath)

export default defineEventHandler(async (event) => {
  const user = event.context.nuxtUsers?.user
  if (!user?.id) {
    throw createError({ statusCode: 401, message: 'Nincs bejelentkezve' })
  }

  const body = await readBody(event)
  const { calendar_id, calendar_name } = body

  if (!calendar_id) {
    throw createError({ statusCode: 400, message: 'Calendar ID kötelező' })
  }

  const result = db.prepare(`
    INSERT INTO user_calendars (user_id, calendar_id, calendar_name)
    VALUES (?, ?, ?)
  `).run(user.id, calendar_id, calendar_name || null)

  return { id: result.lastInsertRowid, calendar_id, calendar_name }
})
