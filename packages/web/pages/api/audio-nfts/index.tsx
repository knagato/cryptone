import { getToken } from "next-auth/jwt";
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "src/lib/prisma";

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
    case "GET":
      if (!address) {
        return res.status(401).end("401 Unauthorized");
      }

      const audioNFTs = await prisma.audioNFT.findMany({
        where: {
          balanceOfAudioNFT: {
            balance: {
              lt: 0,
            },
          },
        },
      });

      res.status(200).end(JSON.stringify({ data: audioNFTs }));
      break;
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
