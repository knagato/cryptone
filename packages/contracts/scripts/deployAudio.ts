import { ethers } from "hardhat";

async function main() {
    const CrypToneAudio = await ethers.getContractFactory("CrypToneAudio");
    const audio = await CrypToneAudio.deploy("0x4b48841d4b32C4650E4ABc117A03FE8B51f38F68", "polygon-mumbai");

    await audio.deployed();
    console.log(`deployed to ${audio.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
