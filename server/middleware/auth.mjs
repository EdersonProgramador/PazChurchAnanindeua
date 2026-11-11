import jwt from 'jsonwebtoken'
import { config } from '../config.mjs'
import { getDb } from '../db.mjs'

export async function authenticate(req, res, next) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Não autenticado' })
  }
  try {
    const payload = jwt.verify(header.slice(7), config.jwtSecret)
    const db = getDb()
    const user = await db.user.findUnique({
      where: { id: payload.sub },
      include: {
        role: { include: { permissions: { include: { permission: true } } } },
        function: true,
      },
    })
    if (!user?.active) return res.status(401).json({ error: 'Usuário inativo' })
    req.user = user
    req.permissions = new Set(user.role.permissions.map((rp) => rp.permission.code))
    next()
  } catch {
    return res.status(401).json({ error: 'Token inválido' })
  }
}

export function optionalAuth(req, _res, next) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) return next()
  authenticate(req, _res, next).catch(next)
}
