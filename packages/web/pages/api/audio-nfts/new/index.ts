import { ethers, Wallet } from "ethers";
import { NextApiRequest, NextApiResponse } from "next";

const provider = new ethers.providers.JsonRpcProvider(
    `https://polygon-mumbai.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
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
        case 'GET':
            if (!wallet || !process.env.AUDIO_CONTRACT_ADDRESS) {
                return res.status(500).send('Internal Server Error');
            }
            const audioContract = new ethers.Contract(process.env.AUDIO_CONTRACT_ADDRESS, audioAbi, wallet)

            const audioCreatedEvent = audioContract.filters["AudioCreated"]
            provider.once("block", () => {
                audioContract.on(audioCreatedEvent(), async (tokenId: Number, creatorAddress: string, workId: Number, generation: Number) => {
                    const tx1 = await audioContract.initMetadataFirstHalfOnlyOwner(
                        tokenId,
                        generation,
                        "title", // title,
                        "description", // description
                    )
                    await tx1.wait();
                    const tx2 = await audioContract.initMetadataSecondHalfOnlyOwner(
                        tokenId,
                        'encryptedAudioCID', // encryptedAudioCID,
                        'encryptedSymmetricKey', // encryptedSymmetricKey,
                        'previewAudioCID', // previewAudioCID,
                        'jacketCID', // jacketCID,
                    )
                    await tx2.wait();
                })
            })

            // TODO:request user sign
            const isAudioCreatorMyself = () => true; // TODO
            const tx = isAudioCreatorMyself()
                ? await audioContract.postNewAudio()
                : await audioContract.postNewInherit(/*parentId*/)

            res.status(200).json({
                tokenId: 'hoge'
            })
            break;
        default:
            res.setHeader('Allow', ['GET'])
            res.status(405).end(`Method ${req.method} Not Allowed`)
    }
}