import Database from 'better-sqlite3'
import { join } from 'node:path'

const dbPath = join(process.cwd(), 'data', 'users.db')
const db = new Database(dbPath)

export default defineEventHandler(async (event) => {
  const user = event.context.nuxtUsers?.user
  if (!user?.id) {
    throw createError({ statusCode: 401, message: 'Nincs bejelentkezve' })
  }

  const users = db.prepare(`
    SELECT id, name, email FROM users WHERE id != ? AND active = 1
  `).all(user.id) as { id: number; name: string; email: string }[]

  return users
})
