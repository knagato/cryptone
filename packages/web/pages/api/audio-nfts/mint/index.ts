import { ethers, Wallet } from "ethers";
import { NextApiRequest, NextApiResponse } from "next";

const provider = new ethers.providers.JsonRpcProvider(
    `https://polygon-mumbai.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
    80001);
const CONTRACT_OWNER_SECRET = process.env.CONTRACT_OWNER_SECRET;
const wallet = CONTRACT_OWNER_SECRET
    ? new Wallet(CONTRACT_OWNER_SECRET, provider)
    : null;

const audioAbi = require('./audio.abi.json');

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    switch (req.method) {
        case 'GET':
            if (!wallet || !process.env.AUDIO_CONTRACT_ADDRESS) {
                return res.status(500).send('Internal Server Error');
            }
            const audioContract = new ethers.Contract(process.env.AUDIO_CONTRACT_ADDRESS, audioAbi, wallet)

            const audioCreatedEvent = audioContract.filters["AudioMinted"]
            provider.once("block", () => {
                audioContract.on(audioCreatedEvent(), async (tokenId: Number, amount: Number, salesPrice: Number) => {
                    // complete!!
                })
            })

            const ref = await audioContract.getReferenceToWork(0 /*tokenId*/);
            const exchangedSalesPrice = /*salesPrice * */ 100000;
            const tx = await audioContract.mint(ref.creatorAddress, ref.workType, ref.workId, 100/*amount*/, exchangedSalesPrice/*salesPrice*/);
            await tx.wait();

            res.status(200).json({
                tokenId: 'hoge'
            })
            break;
        default:
            res.setHeader('Allow', ['GET'])
            res.status(405).end(`Method ${req.method} Not Allowed`)
    }
}