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
    case "GET":
      const { address: _address } = req.query;
      if (typeof _address !== "string") {
        res.status(400).end("Bad Request.");
        return;
      }
      const altars = await prisma.altar.findMany({
        where: {
          creator: {
            address: _address,
          },
        },
        include: { template: true },
      });

      res.status(200).end(JSON.stringify({ data: altars }));
      break;
    case "POST":
      if (!address) {
        res.status(401).end("Not Authorized");
        return;
      }
      const { title, description, templateId } = req.body;

      const altar = await prisma.altar.create({
        data: {
          template: {
            connect: {
              id: templateId,
            },
          },
          title,
          description,
          creator: {
            connect: {
              address: address,
            },
          },
          arrangementData: {},
        },
      });

      res.status(200).end(JSON.stringify({ id: altar.id }));
      break;
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
