export function requireGestao(req, res, next) {
  if (
    req.permissions?.has('lifegroup.manage') ||
    req.permissions?.has('content.manage')
  ) {
    return next()
  }
  return res.status(403).json({ error: 'Permissão negada', code: 'gestao' })
}

export function requireContent(req, res, next) {
  if (!req.permissions?.has('content.manage')) {
    return res.status(403).json({ error: 'Permissão negada', code: 'content.manage' })
  }
  next()
}

export function requireLifeGroup(req, res, next) {
  if (!req.permissions?.has('lifegroup.manage')) {
    return res.status(403).json({ error: 'Permissão negada', code: 'lifegroup.manage' })
  }
  next()
}
