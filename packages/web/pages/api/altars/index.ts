import { getToken } from "next-auth/jwt";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token = await getToken({ req: req });
  const address = token?.sub ?? null;

  switch (req.method) {
    case "GET":
      if (!address) {
        return res.status(401);
      }
      console.log(address);

      // ...ceate altar

      res.status(200).end("This is altar");
      break;
    case "POST":
      if (!address) {
        return res.status(401);
      }
      console.log(address);

      // ...ceate altar

      res.status(200).end("Altar created!!");
      break;
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
