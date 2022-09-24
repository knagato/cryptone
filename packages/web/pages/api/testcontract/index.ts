import * as dotenv from "dotenv";

import { ethers, Wallet } from "ethers"
import { NextApiRequest, NextApiResponse } from "next";

dotenv.config();

const provider = new ethers.providers.JsonRpcProvider(process.env.ALCHEMY_API_URL, 80001);
const wallet = typeof process.env.OWNER_PRIVATE_KEY === "string"
    ? new Wallet(process.env.OWNER_PRIVATE_KEY, provider)
    : null;

console.log(wallet?.getAddress())

const profileAddress = "0xAaAD7BFCd09740575694CC44CD55CBE3cE91a846";
const profileAbi = require("./profile.abi.json");

const audioAddress = "0xad5e5FfDB352769854D7E55E3d793F3237F46104";
const audioAbi = require('./audio.abi.json');

// const ttt4Address = "0x4fec977dBaD824324109C58cA20A1aad20678EB8";
// const ttt4Abi = require('./tttrt4.abi.json')

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    switch (req.method) {
        case 'GET':
            if (!wallet) {
                return res.status(500).send('Internal Server Error');
            }
            const profileContract = new ethers.Contract(profileAddress, profileAbi, wallet);
            const audioContract = new ethers.Contract(audioAddress, audioAbi, wallet);



            // // profile test

            // // const tx_ = await profileContract.initialize("CrypToneProfile", "CTP", wallet.getAddress());
            // // await tx_.wait();

            // // const gov = await profileContract.getGovernance();
            // // const walletAddress = await wallet.getAddress();
            // // console.log(gov);
            // // // console.log(walletAddress)
            // // // if (gov !== walletAddress) {
            // // //     console.error("set gov error");
            // // // }
            // // let tx1 = await profileContract.setState(0);
            // // await tx1.wait();

            // const filters = audioContract.filters["ProfileCreated"]
            // provider.once("block", () => {
            //     audioContract.on(filters(), (profileId: Number, creator: string, to: string, contentURI: string, timestamp: Number) => {
            //         console.log(`profileId:${profileId}, creator:${creator}, contentURI:${contentURI}, timestamp:${timestamp}`)
            //     })
            // })

            // let tx1 = await profileContract.createProfileOnlyGov(process.env.TORUTO_ADDRESS, 'https://example.com');
            // await tx1.wait();

            // // // await profileContract.createProfileOnlyGov(process.env.TORUTO_ADDRESS, 'https://example.com');

            // // tx1 = await profileContract.setProfileURIOnlyGov(process.env.TORUTO_ADDRESS, 'https://something.com')
            // // await tx1.wait();

            // // tx1 = await profileContract.createProfileOnlyGov(process.env.TORUTO_SUB, 'https://google.co.jp');
            // // await tx1.wait();

            // const myProfileId = await profileContract.getProfileId(process.env.TORUTO_ADDRESS);
            // const myProfile = await profileContract.getProfile(myProfileId);
            // console.log(myProfileId, myProfile);

            // const subProfileId = await profileContract.getProfileId(process.env.TORUTO_SUB);
            // const subProfileURI = await profileContract.profileURI(subProfileId);
            // console.log(subProfileId, subProfileURI);

            // console.log(await profileContract.profileExists(process.env.TORUTO_ADDRESS));
            // console.log(await profileContract.profileExists(process.env.TORUTO_SUB));



            const filters = audioContract.filters["AudioCreated"]
            provider.once("block", () => {
                audioContract.on(filters(), async (tokenId: Number, creatorAddress: string, workId: Number, generation: Number) => {
                    console.log(`tokenId:${tokenId}, creatorAddress:${creatorAddress}, workId:${workId}, generation:${generation}`)
                    await audioContract.initMetadataFirstHalfOnlyOwner(tokenId, 0, "my_audio_01", "This is my first audio.");
                    await audioContract.initMetadataSecondHalfOnlyOwner(tokenId, "encryptedmyaudio01", "encryptedsymmetrickey01", "previewaudio01", "jacket01");
                })

            })

            // await audioContract.postNewAudioOnlyOwner(process.env.TORUTO_ADDRESS)

            console.log(await audioContract.getTableName());

            await audioContract.postNewAudioOnlyOwner(process.env.TORUTO_ADDRESS)
            // await audioContract.postNewInheritOnlyOwner(process.env.TORUTO_ADDRESS, 0)
            // await audioContract.postNewInheritOnlyOwner(process.env.TORUTO_SUB, 0)
            // await audioContract.postNewInheritOnlyOwner(process.env.TORUTO_SUB, 0)

            const workCount = await audioContract.getCreatorWorkCount(process.env.TORUTO_ADDRESS, 0);
            console.log(workCount)
            for (let i = 0; i < workCount; i++) {
                const data = await audioContract.getAudioData(process.env.TORUTO_ADDRESS, i);
                console.log(data);
            }

            // console.log(await audioContract.getAudioData(process.env.TORUTO_ADDRESS, 0));
            // console.log(await audioContract.getAudioData(process.env.TORUTO_ADDRESS, 1));

            const filters2 = audioContract.filters["AudioMinted"]
            provider.once("block", () => {
                audioContract.on(filters2(), (nftType: Number, creatorAddress: string, workId: Number, amount: Number/*, salesPrice: Number*/) => {
                    console.log(`nftType:${nftType}, creatorAddress:${creatorAddress}, workId:${workId}, amount:${amount}`/*, salesPrice:${salesPrice}`*/)
                })
            })

            const ref = audioContract.getReferenceToWork(0);
            await audioContract.mintOnlyOwner(process.env.TORUTO_ADDRESS, 0, 0, 100, 2000);
            // await audioContract.mintOnlyOwner(process.env.TORUTO_ADDRESS, 0, 1, 100, 2000);

            const d1 = await audioContract.getAudioData(process.env.TORUTO_ADDRESS, 0);
            console.log(d1);

            const uri = await audioContract.uri(0);
            console.log(uri);

            // console.log(audioContract.AudioDefine.WorkType.Audio);
            const d = await audioContract.getAudioData(process.env.TORUTO_ADDRESS, 0);
            console.log(d);
            const d2 = await audioContract.getReferenceToWork(0);
            console.log(d2)


            res.status(200).json({
                tokenId: 'hoge'
            })
            break
        default:
            res.setHeader('Allow', ['GET'])
            res.status(405).end(`Method ${req.method} Not Allowed`)
    }
}
