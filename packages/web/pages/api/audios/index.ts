import { getToken } from "next-auth/jwt";
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "src/lib/prisma";

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

      const {
        title,
        description,
        audioUrl,
        audioSize,
        encryptedAudioCID,
        symmetricKey,
        previewAudioCID,
      } = req.body;

      const audio = await prisma.uploadAudio.create({
        data: {
          title,
          description,
          audioUrl,
          audioSize,
          encryptedAudioCID,
          symmetricKey,
          previewAudioCID,
        },
      });

      res.status(200).end(JSON.stringify({ id: audio.id }));
      break;
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
