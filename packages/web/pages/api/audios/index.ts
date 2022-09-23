import { File, IncomingForm } from "formidable";
import * as fs from "fs";
import { getToken } from "next-auth/jwt";
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "src/lib/prisma";
import { getOriginalAudioSignedUrl, putOriginalAudio } from "src/lib/s3";
import Lit from "src/lib/Lit";
import { UploadAudio } from "@prisma/client";
import { Web3Storage, File as Web3File } from 'web3.storage'
import MediaSplit from 'media-split'


const WEB3_STORAGE_KEY = process.env.WEB3_STORAGE_KEY
const web3Storage = WEB3_STORAGE_KEY
  ? new Web3Storage({ token: WEB3_STORAGE_KEY })
  : undefined;

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function getUploadAudios(creatorAddress: string, limit: number = 100): Promise<UploadAudio[]> {
  const audios = await prisma.uploadAudio.findMany( { where: { creatorAddress }, take: limit } )
  return audios
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token = await getToken({ req: req });
  const address = token?.sub ?? null;

  switch (req.method) {
    case "GET":
      if (!address) {
        return res.status(200).json({audios: []});
      }
      const audios = await getUploadAudios(address)
      res.status(200).json({
        audios: audios
      })
      break;
    case "POST":

      if (!address) {
        return res.status(401).end("401 Unauthorized");
      }
      const form = new IncomingForm({ keepExtensions: true });

      form.parse(req, async (err, fields, files) => {
        if (err) {
          res.status(500).send("Internal Server Error");
          return;
        }
        try {

        const title = fields.title as string;
        const description = fields.description as string | undefined;
        const originalAudio = files.originalAudio as File;
        const audioFilename = fields.audioFilename as string | undefined;

        const originalAudioBuf = fs.readFileSync(originalAudio.filepath);

        // const split = new MediaSplit({ input: originalAudio.filepath, sections: ['[00:00 - 00:15] preview'], output: '/tmp' });
        // const splitSections = await split.parse()
        // const previewAudioFilename = splitSections[0].name
        // const previewAudioBuf = fs.readFileSync('/tmp/preview.mp3')

        const originalAudioS3 = await putOriginalAudio({
          file: originalAudioBuf,
          creatorAddress: address,
          filenameWithExtention: audioFilename || originalAudio.newFilename,
          contentType: originalAudio.mimetype,
        });
        const originalAudioSignedUrl = await getOriginalAudioSignedUrl({ key: originalAudioS3.key });
        const { encryptedFile, symmetricKey } = await Lit.encryptFile(
          new Blob([originalAudioBuf])
        );

        // const previewAudioS3 = await putOriginalAudio({
        //   file: previewAudioBuf,
        //   creatorAddress: address,
        //   filenameWithExtention: previewAudioFilename,
        //   contentType: originalAudio.mimetype,
        // })
        // const previewAudioSignedUrl = await getOriginalAudioSignedUrl({ key: previewAudioS3.key });

        const encryptedAudioFile = new Web3File([encryptedFile], 'encryptedAudio', { type: '' })
        const encryptedAudioCID = await web3Storage?.put([encryptedAudioFile])

        // const previewAudioFile = new Web3File([previewAudioBuf], 'previewAudio', { type: 'audio/*' })
        // const previewAudioCID = await web3Storage?.put([previewAudioFile])

        const createUploadAudio = prisma.uploadAudio.create({
          data: {
            title: title,
            description: description,
            audioUrl: originalAudioSignedUrl,
            previewUrl: 'previewAudioSignedUrl',
            audioSize: originalAudio.size,
            encryptedAudioCID: encryptedAudioCID,
            symmetricKey: new TextDecoder().decode(symmetricKey),
            previewAudioCID: 'previewAudioCID',
            creatorAddress: address,
          },
        });
        const [uploadAudio] = await prisma.$transaction([createUploadAudio]);

        res.status(200).end(JSON.stringify({ id: uploadAudio.id }));
      } catch (err) {
        if (err instanceof Error) {
          res.status(500).end(err.message);
        } else {
          res.status(500).end("Internal Server Error");
        }
      }
        return;
      });

      break;
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
