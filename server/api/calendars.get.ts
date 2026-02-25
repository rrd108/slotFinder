import Database from 'better-sqlite3'
import { join } from 'node:path'

const dbPath = join(process.cwd(), 'data', 'users.db')
const db = new Database(dbPath)

export default defineEventHandler(async (event) => {
  const user = event.context.nuxtUsers?.user
  if (!user?.id) {
    throw createError({ statusCode: 401, message: 'Nincs bejelentkezve' })
  }

  const calendars = db.prepare(`
    SELECT * FROM user_calendars WHERE user_id = ? AND is_active = 1
  `).all(user.id)

  return calendars
})
