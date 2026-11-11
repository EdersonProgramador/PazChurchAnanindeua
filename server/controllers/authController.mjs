import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { config } from '../config.mjs'
import { getDb } from '../db.mjs'

export async function login(req, res) {
  const { email, password } = req.body ?? {}
  if (!email || !password) return res.status(400).json({ error: 'Email e senha obrigatórios' })
  const db = getDb()
  const user = await db.user.findUnique({
    where: { email: String(email).toLowerCase() },
    include: {
      role: { include: { permissions: { include: { permission: true } } } },
      function: true,
    },
  })
  if (!user?.active) return res.status(401).json({ error: 'Credenciais inválidas' })
  const ok = await bcrypt.compare(password, user.passwordHash)
  if (!ok) return res.status(401).json({ error: 'Credenciais inválidas' })
  const permissions = user.role.permissions.map((rp) => rp.permission.code)
  const token = jwt.sign({ sub: user.id, role: user.role.slug }, config.jwtSecret, { expiresIn: '7d' })
  res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      function: user.function,
      permissions,
    },
  })
}

export function me(req, res) {
  const { passwordHash: _, ...safe } = req.user
  res.json({
    user: {
      ...safe,
      permissions: [...req.permissions],
    },
  })
}
