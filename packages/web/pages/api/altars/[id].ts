import { getToken } from "next-auth/jwt";
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "src/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token = await getToken({ req: req });
  const address = token?.sub ?? null;

  const { id } = req.query;
  if (typeof id !== "string") {
    res.status(400).end("Bad Request.");
    return;
  }
  const altar = await prisma.altar.findUniqueOrThrow({
    where: {
      id: parseInt(id),
    },
    include: { creator: true, template: true },
  });

  switch (req.method) {
    case "GET":
      res.status(200).end(JSON.stringify({ data: altar }));
      break;
    case "PUT":
      if (!address) {
        res.status(401).end("Not Authorized");
        return;
      }
      if (altar.creator.address !== address) {
        res.status(401).end("Access Denied");
        return;
      }
      const { arrangementData } = req.body;
      console.log(arrangementData)

      const updateAltar = await prisma.altar.update({
        where: { id: altar.id },
        data: {
          arrangementData,
        },
      });

      res.status(200).end(JSON.stringify({ data: updateAltar }));
      break;
    default:
      res.setHeader("Allow", ["GET", "PUT"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
