import dotenv from 'dotenv'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'

const root = resolve(process.cwd())
for (const file of ['.env.local', '.env']) {
  const path = resolve(root, file)
  if (existsSync(path)) dotenv.config({ path })
}

export const config = {
  port: Number(process.env.PORT || 3000),
  jwtSecret: process.env.JWT_SECRET || 'dev-paz-ananindeua-change-me',
  databaseUrl: process.env.DATABASE_URL,
  s3: {
    endpoint: process.env.AWS_ENDPOINT_URL_S3,
    region: process.env.AWS_REGION || 'us-east-2',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    assetsBucket: 'assets',
    uploadsBucket: 'uploads',
  },
  realtime: {
    url: process.env.NEON_REALTIME_URL,
    secret: process.env.NEON_REALTIME_SECRET,
  },
  church: {
    name: 'Paz Church Ananindeua',
    locale: 'Paz Church Metrópole - Ananindeua',
    address: 'Rodovia BR-316 KM 5, S/N',
    city: 'Guanabara, Ananindeua',
    state: 'PA',
    cep: '67110-140',
    facebook: 'https://www.facebook.com/pages/Paz%20Church%20Ananindeua/2017134335074716/',
    site: 'https://paz.church/belem/events/local/paz-church-metropole-ananindeua/',
  },
}
