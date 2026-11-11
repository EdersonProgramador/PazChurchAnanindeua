import './config.mjs'
import cors from 'cors'
import express from 'express'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { config } from './config.mjs'
import { apiRouter } from './routes/api.mjs'

const app = express()
const root = process.cwd()
const dist = resolve(root, 'dist')

app.use(cors())
app.use(express.json({ limit: '2mb' }))

app.get('/health', (_req, res) => res.json({ ok: true, service: 'paz-church-ananindeua' }))
app.use('/api/v1', apiRouter)

if (existsSync(dist)) {
  app.use(express.static(dist))
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) return next()
    res.sendFile(resolve(dist, 'index.html'))
  })
}

app.listen(config.port, '0.0.0.0', () => {
  console.log(`Paz Church Ananindeua API em http://0.0.0.0:${config.port}`)
})
