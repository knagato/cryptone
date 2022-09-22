import { NextApiRequest, NextApiResponse } from 'next'
import {
  formidable,
  Fields as FormidableFields,
  Files as FormidableFiles
} from "formidable";
import fs from "fs"
import { NFTStorage, Blob } from "nft.storage";

const debug = false;

export const config = {
  api: {
    bodyParser: false
  }
}

type ParsedData = {
  err: any,
  fields: FormidableFields,
  files: FormidableFiles
}

const NFT_STORAGE_KEY = process.env.NFT_STORAGE_KEY
const nftStorage = NFT_STORAGE_KEY
  ? new NFTStorage({ token: NFT_STORAGE_KEY })
  : undefined;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'POST':
      const data: ParsedData = await new Promise((resolve, reject) => {
        formidable().parse(req, (err, fields, files) => {
          if (err) {
            reject({ err })
          }
          resolve({ err, fields, files })
        })
      })
      if (data.err) {
        return res.status(500).send(undefined);
      }

      const audio = data.files.audio
      const jacket = data.files.jacket
      if (!Array.isArray(audio) && !Array.isArray(jacket)) {
        let audioBuf = fs.readFileSync(audio.filepath)
        let jacketBuf = fs.readFileSync(jacket.filepath)

        const metadata = debug
          ? {
            dummy: "This is a dummy data. Your posted data is not saved on IPFS."
          }
          : await nftStorage?.store({
            image: new Blob([jacketBuf], { type: "image/*" }),
            name: "my-audio",
            description: "This is my audio",
            properties: {
              audio: new Blob([audioBuf], { type: "audio/*" }),
            },
          });
        console.log(metadata);
        res.status(200).json({
          message: "Success!",
          metadata: metadata,
        });
      }
      break
    default:
      res.setHeader('Allow', ['POST'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}