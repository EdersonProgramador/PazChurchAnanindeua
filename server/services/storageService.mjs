import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { config } from '../config.mjs'

let client

function getClient() {
  if (!client && config.s3.endpoint && config.s3.accessKeyId && config.s3.secretAccessKey) {
    client = new S3Client({
      region: config.s3.region,
      endpoint: config.s3.endpoint,
      forcePathStyle: true,
      credentials: {
        accessKeyId: config.s3.accessKeyId,
        secretAccessKey: config.s3.secretAccessKey,
      },
    })
  }
  return client
}

export function storageConfigured() {
  return Boolean(getClient())
}

export function publicObjectUrl(bucket, key) {
  if (!config.s3.endpoint) return null
  const base = config.s3.endpoint.replace(/\/$/, '')
  return `${base}/${bucket}/${key}`
}

export async function uploadObject(bucket, key, body, contentType) {
  const s3 = getClient()
  if (!s3) throw new Error('Object Storage não configurado')
  await s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
    }),
  )
  return publicObjectUrl(bucket, key)
}
