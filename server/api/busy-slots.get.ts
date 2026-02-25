import Database from 'better-sqlite3'
import { join } from 'node:path'
import { getBusySlots } from '../utils/google-calendar'

const dbPath = join(process.cwd(), 'data', 'users.db')
const db = new Database(dbPath)

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const date = query.date as string
  const userIds = query.userIds as string

  if (!date) {
    throw createError({ statusCode: 400, message: 'Dátum kötelező' })
  }

  const targetUserIds = userIds ? userIds.split(',').map(Number) : []

  const currentUser = event.context.nuxtUsers?.user
  const userCalendarMap = new Map<number, string[]>()

  if (targetUserIds.length === 0) {
    if (currentUser?.id) {
      const calendars = db.prepare(`
        SELECT calendar_id FROM user_calendars WHERE user_id = ? AND is_active = 1
      `).all(currentUser.id) as { calendar_id: string }[]
      userCalendarMap.set(currentUser.id, calendars.map(c => c.calendar_id))
    }
  } else {
    if (currentUser?.id) {
      const calendars = db.prepare(`
        SELECT calendar_id FROM user_calendars WHERE user_id = ? AND is_active = 1
      `).all(currentUser.id) as { calendar_id: string }[]
      userCalendarMap.set(currentUser.id, calendars.map(c => c.calendar_id))
    }
    for (const userId of targetUserIds) {
      const calendars = db.prepare(`
        SELECT calendar_id FROM user_calendars WHERE user_id = ? AND is_active = 1
      `).all(userId) as { calendar_id: string }[]
      userCalendarMap.set(userId, calendars.map(c => c.calendar_id))
    }
  }

  const results: any[] = []

  for (const [userId, calendarIds] of userCalendarMap) {
    if (calendarIds.length === 0) continue

    const busyFromGoogle = await getBusySlots(calendarIds, date)

    const customAvailability = db.prepare(`
      SELECT * FROM user_availability 
      WHERE user_id = ? 
      AND (
        (is_recurring = 1 AND day_of_week = ?)
        OR (specific_date = ?)
      )
    `).all(userId, new Date(date).getDay(), date) as any[]

    busyFromGoogle.forEach((slot: any) => {
      results.push({
        userId,
        type: 'google',
        start: slot.start,
        end: slot.end,
        summary: slot.summary
      })
    })

    customAvailability.forEach((av: any) => {
      const startDateTime = `${date}T${av.start_time}:00`
      const endDateTime = `${date}T${av.end_time}:00`
      results.push({
        userId,
        type: 'custom',
        start: startDateTime,
        end: endDateTime,
        summary: 'Egyedi nem elérhető'
      })
    })
  }

  return results
})
