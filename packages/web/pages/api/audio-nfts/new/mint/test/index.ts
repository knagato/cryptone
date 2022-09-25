import { wallet } from "@rainbow-me/rainbowkit";
import { ethers } from "ethers";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    switch (req.method) {
        case 'GET':
            console.log("hoge")
            res.status(200).json({
                message: "please sign to this message"
            })
            break;
        default:
            res.setHeader('Allow', ['GET'])
            res.status(405).end(`Method ${req.method} Not Allowed`)
    }
}