import Database from 'better-sqlite3'
import { join } from 'node:path'

const dbPath = join(process.cwd(), 'data', 'users.db')
const db = new Database(dbPath)

export default defineEventHandler(async (event) => {
  const user = event.context.nuxtUsers?.user
  if (!user?.id) {
    throw createError({ statusCode: 401, message: 'Nincs bejelentkezve' })
  }

  const id = getRouterParam(event, 'id')

  db.prepare(`
    DELETE FROM user_availability WHERE id = ? AND user_id = ?
  `).run(id, user.id)

  return { success: true }
})
