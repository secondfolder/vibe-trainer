import { PrismaClient } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const prompt = await prisma.prompts.update({
      data: {
        access_count: {increment: 1}
      },
      where: {
        id: req.query.id?.[0],
      }
    })
  
    res.json(prompt)
  }
}