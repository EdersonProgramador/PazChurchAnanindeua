export function requirePermission(code) {
  return (req, res, next) => {
    if (!req.permissions?.has(code)) {
      return res.status(403).json({ error: 'Permissão negada', code })
    }
    next()
  }
}
