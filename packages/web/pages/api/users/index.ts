import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../src/lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
switch (req.method) {
    case 'GET':
      const users = await prisma.user.findMany()
      res.status(200).json({
        users
      })
      break
    default:
      res.setHeader('Allow', ['GET'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
