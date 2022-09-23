import { File, IncomingForm } from "formidable";
import * as fs from "fs";
import { getToken } from "next-auth/jwt";
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "src/lib/prisma";
import { getOriginalAudioSignedUrl, putOriginalAudio } from "src/lib/s3";
import Lit from "src/lib/Lit";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token = await getToken({ req: req });
  const address = token?.sub ?? null;

  switch (req.method) {
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
        const name = fields.name as string;
        const description = fields.description as string | undefined;
        const originalAudio = files.originalAudio as File;
        const jacket = files.jacket as File;

        const audioBuf = fs.readFileSync(originalAudio.filepath);
        const jacketBuf = fs.readFileSync(jacket.filepath);

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

        // TODO: store encryptedFile to IPFS
        // TODO: store jacket to IPFS

        const createUploadAudio = prisma.uploadAudio.create({
          data: {
            title: name,
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
