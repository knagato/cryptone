// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getImageSize } from 'next/dist/server/image-optimizer'
import Replicate, { Model } from 'replicate-js'
import { prisma } from "src/lib/prisma";

export type Image = {
  id: number,
  replicateId: string,
  imageUrl: string,
  prompt: string,
  jacketCID: string | null
}

type Data = {
  images: Image[]
}

const token = process.env.REPLICATE_TOKEN;
const replicate = token ? new Replicate({ token: process.env.REPLICATE_TOKEN }) : undefined;
let repModel: Model | undefined;

export async function getImages(limit: number = 100): Promise<Image[]> {
  const images = await prisma.image.findMany()
  return images
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const images = await getImages()
  switch (req.method) {
    case 'GET':
        const limit = parseInt(req.query.limit as string) || 100
        res.status(200).json({
          images: images.filter((_, i) => i < limit)
        })
        break
    case 'POST':
      // debug
      // curl -X POST -H "Content-Type: application/json" -d '{"prompt":"crows"}' localhost:3000/api/images
      const { prompt } = req.body
      console.log('prompt', prompt)

      repModel ||= await replicate?.models.get('replicate/hello-world');
      const prediction = await repModel?.predict({ text: prompt});
      // repModel ||= await replicate?.models.get('stability-ai/stable-diffusion');
      // const prediction = await repModel?.predict({prompt: prompt});
      console.log('prediction', prediction);
      res.status(200).json({
        images: images.filter((_, i) => i == 0)
      })
      break
    default:
      res.setHeader('Allow', ['GET', 'POST'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
