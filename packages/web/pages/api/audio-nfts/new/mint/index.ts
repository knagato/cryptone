import { ethers, Wallet } from "ethers";
import { NextApiRequest, NextApiResponse } from "next";

const provider = new ethers.providers.JsonRpcProvider(
    `https://polygon-mumbai.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`,
    80001);
const CONTRACT_OWNER_SECRET = process.env.CONTRACT_OWNER_SECRET;
const wallet = CONTRACT_OWNER_SECRET
    ? new Wallet(CONTRACT_OWNER_SECRET, provider)
    : null;

const audioAbi = require('src/abi/audio.abi.json');

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    switch (req.method) {
        case 'POST':
            if (!wallet || !process.env.AUDIO_CONTRACT_ADDRESS) {
                return res.status(500).send('Internal Server Error');
            }
            const tokenId = req.body.tokenId;

            const audioContract = new ethers.Contract(process.env.AUDIO_CONTRACT_ADDRESS, audioAbi, wallet)
            const ref = await audioContract.getReferenceToWork(tokenId);

            res.status(200).json({
                tokenId: tokenId,
                creatorAddress: ref.creatorAddress,
                workType: Number.parseInt(ref.workType),
                workId: Number.parseInt(ref.workId),
            })
            break;
        default:
            res.setHeader('Allow', ['POST'])
            res.status(405).end(`Method ${req.method} Not Allowed`)
    }
}