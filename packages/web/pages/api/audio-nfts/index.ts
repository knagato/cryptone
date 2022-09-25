import { getToken } from "next-auth/jwt";
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "src/lib/prisma";
import { getOriginalAudioSignedUrl } from "src/lib/s3";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token = await getToken({ req: req });
  const address = token?.sub ?? null;

  switch (req.method) {
    case "GET":
      if (!address) {
        return res.status(401).end("401 Unauthorized");
      }

      const audioNFTs = await prisma.audioNFT.findMany({
        where: {
          balanceOfAudioNFT: {
            userAddress: address,
            balance: {
              gt: 0,
            },
          },
        },
      });

      const ret = [];

      let originalAudioUrl = null;
      let previewAudioUrl = null;
      for (const audioNFT of audioNFTs) {
        const uploadAudio = await prisma.uploadAudio.findFirstOrThrow({
          where: {
            previewAudioCID: audioNFT.previewAudioCID,
          },
        });
        previewAudioUrl = uploadAudio.previewUrl;
        if (address === audioNFT.creatorAddress) {
          const { pathname } = new URL(uploadAudio.audioUrl);
          originalAudioUrl = await getOriginalAudioSignedUrl({ key: pathname });
        }
        ret.push({ ...audioNFT, originalAudioUrl, previewAudioUrl });
      }

      res.status(200).end(JSON.stringify({ data: ret }));
      break;
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
