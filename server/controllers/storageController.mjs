import { config } from '../config.mjs'
import { uploadObject, storageConfigured } from '../services/storageService.mjs'
import { randomUUID } from 'node:crypto'

export async function uploadAsset(req, res) {
  if (!storageConfigured()) return res.status(503).json({ error: 'Object Storage não configurado' })
  if (!req.file) return res.status(400).json({ error: 'Arquivo obrigatório' })
  const ext = req.file.originalname.split('.').pop() || 'bin'
  const key = `branding/${randomUUID()}.${ext}`
  try {
    const url = await uploadObject(config.s3.assetsBucket, key, req.file.buffer, req.file.mimetype)
    res.status(201).json({ url, key, bucket: config.s3.assetsBucket })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}

export async function storageHealth(_req, res) {
  res.json({ ok: storageConfigured() })
}
