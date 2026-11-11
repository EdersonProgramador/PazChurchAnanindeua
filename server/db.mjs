import { PrismaClient } from '@prisma/client'

/** @type {PrismaClient | undefined} */
let prisma

export function getDb() {
  if (!prisma) prisma = new PrismaClient()
  return prisma
}
