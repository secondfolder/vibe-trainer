import { PrismaClient } from '@prisma/client'
import hash from 'hash.js'
import { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const {text} = req.body

    const id = hash.sha256().update(text).digest('hex').substring(0,15)
  
    const prompt = await prisma.prompts.upsert({
      create: {
        id,
        save_count: 1,
        access_count: 0,
        text,
      },
      update: {
        save_count: {increment: 1}
      },
      where: {
        id,
      }
    })
  
    res.json(prompt)
  }
}