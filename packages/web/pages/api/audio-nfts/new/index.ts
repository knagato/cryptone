import { Image, Prisma, UploadAudio } from "@prisma/client";
import { prisma } from "src/lib/prisma";

import { ethers, Wallet } from "ethers";
import { NextApiRequest, NextApiResponse } from "next";
import Lit from "src/lib/Lit";

const provider = new ethers.providers.JsonRpcProvider(
    `https://polygon-mumbai.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`,
    80001);
const CONTRACT_OWNER_SECRET = process.env.CONTRACT_OWNER_SECRET;
const wallet = CONTRACT_OWNER_SECRET
    ? new Wallet(CONTRACT_OWNER_SECRET, provider)
    : null;

const audioAbi = require('src/abi/audio.abi.json');

async function getUploadAudio(id: number): Promise<UploadAudio | null> {
    return await prisma.uploadAudio.findFirst({ where: { id } })
}

async function getImage(id: number): Promise<Image | null> {
    return await prisma.image.findFirst({ where: { id } })
}

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
            const generation = req.body.generation;
            const audioData = await getUploadAudio(req.body.audioId);
            const imageData = await getImage(req.body.imageId)
            if (!audioData || !imageData) {
                return res.status(500).send('Internal Server Error');
            }

            const audioContract = new ethers.Contract(process.env.AUDIO_CONTRACT_ADDRESS, audioAbi, wallet)

            if (!audioData.symmetricKey) {
                return res.status(500).send('Internal Server Error');
            }

            // const litResult = await Lit.saveEncriptionKey(audioData.symmetricKey, tokenId);

            const tx1 = await audioContract.initMetadataFirstHalfOnlyOwner(
                tokenId,
                generation,
                audioData.title,
                audioData.description,
            )
            await tx1.wait();

            const tx2 = await audioContract.initMetadataSecondHalfOnlyOwner(
                tokenId,
                audioData.encryptedAudioCID,
                // litResult.encryptedSymmetricKey,
                "",
                audioData.previewAudioCID,
                imageData.jacketCID,
            )
            await tx2.wait();

            res.status(200).json({
                tokenId: tokenId,
                message: "hoge"
            })
            break;
        default:
            res.setHeader('Allow', ['POST'])
            res.status(405).end(`Method ${req.method} Not Allowed`)
    }
}