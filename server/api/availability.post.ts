import Database from 'better-sqlite3'
import { join } from 'node:path'

const dbPath = join(process.cwd(), 'data', 'users.db')
const db = new Database(dbPath)

export default defineEventHandler(async (event) => {
  const user = event.context.nuxtUsers?.user
  if (!user?.id) {
    throw createError({ statusCode: 401, message: 'Nincs bejelentkezve' })
  }

  const body = await readBody(event)
  const { day_of_week, start_time, end_time, is_recurring, specific_date } = body

  if (!start_time || !end_time) {
    throw createError({ statusCode: 400, message: 'Kezdő és befejező idő kötelező' })
  }

  const result = db.prepare(`
    INSERT INTO user_availability (user_id, day_of_week, start_time, end_time, is_recurring, specific_date)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(user.id, day_of_week ?? null, start_time, end_time, is_recurring ? 1 : 0, specific_date || null)

  return { id: result.lastInsertRowid }
})
