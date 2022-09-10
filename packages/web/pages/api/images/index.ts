// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import Replicate, { Model } from 'replicate-js'

type Image = {
  id: string,
  url: string,
  prompt: string
}

type Data = {
  images: Image[]
}

const dummyImages: Image[] = [
  { id: 'rdjp5iduprg7fljmjxtsi4k6xi', url: 'https://replicate.com/api/models/stability-ai/stable-diffusion/files/caf6d90a-0bf6-444f-b244-62663ca7a1ec/out-0.png', prompt: 'crows' },
  { id: 'z32ygtk7xnemjpulylfglramaa', url: 'https://replicate.com/api/models/stability-ai/stable-diffusion/files/d3db96b0-4314-491c-bcdb-1528bea0ba30/out-0.png', prompt: 'electric sheep, neon, synthwave' }
]

const token = process.env.REPLICATE_TOKEN;
const replicate = token ? new Replicate({ token: process.env.REPLICATE_TOKEN }) : undefined;
let repModel: Model | undefined;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
switch (req.method) {
    case 'GET':
      const limit = parseInt(req.query.limit as string) || 100
      res.status(200).json({
        images: dummyImages.filter((_, i) => i < limit)
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
        images: dummyImages.filter((_, i) => i == 0)
      })
      break
    default:
      res.setHeader('Allow', ['GET', 'POST'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
