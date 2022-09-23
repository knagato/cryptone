import { File, IncomingForm } from "formidable";
import * as fs from "fs";
import { getToken } from "next-auth/jwt";
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "src/lib/prisma";
import { getOriginalAudioSignedUrl, putOriginalAudio } from "src/lib/s3";
import Lit from "src/lib/Lit";
import { UploadAudio } from "@prisma/client";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function getUploadAudios(limit: number = 100): Promise<UploadAudio[]> {
  const audios = await prisma.uploadAudio.findMany()
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
      const audios = await getUploadAudios()
      res.status(200).json({
        audios: audios
      })

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
        const title = fields.title as string;
        const description = fields.description as string | undefined;
        const originalAudio = files.originalAudio as File;

        const audioBuf = fs.readFileSync(originalAudio.filepath);

        const { url, key } = await putOriginalAudio({
          file: audioBuf,
          creatorAddress: "address",
          filenameWithExtention: originalAudio.newFilename,
          contentType: originalAudio.mimetype,
        });
        const sinedUrl = await getOriginalAudioSignedUrl({ key });
        const { encryptedFile, symmetricKey } = await Lit.encryptFile(
          new Blob([audioBuf])
        );

        const createUploadAudio = prisma.uploadAudio.create({
          data: {
            title: title,
            description: description,
            audioUrl: url,
            audioSize: originalAudio.size,
            encryptedAudioCID: "TODO",
            symmetricKey: new TextDecoder().decode(symmetricKey),
            previewAudioCID: "TODO",
          },
        });
        const [uploadAudio] = await prisma.$transaction([createUploadAudio]);

        res.status(200).end(JSON.stringify({ id: uploadAudio.id }));
        return;
      });

      break;
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
