import { PrismaClient } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const id = Array.isArray(req.query.id) ? req.query.id[0] : req.query.id
    const prompt = await prisma.prompts.update({
      data: {
        access_count: {increment: 1}
      },
      where: {
        id,
      }
    })
  
    res.json(prompt)
  }
}