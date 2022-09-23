// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from "src/lib/prisma";

export async function getUploadAudios(limit: number = 100) {
  const uploadAudios = await prisma.uploadAudio.findMany()
  return uploadAudios
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
switch (req.method) {
    case 'GET':
      const limit = parseInt(req.query.limit as string) || 100
      const uploadAudios = await getUploadAudios(limit)
      res.status(200).json({
        uploadAudios: uploadAudios
      })
      break
    default:
      res.setHeader('Allow', ['GET'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
