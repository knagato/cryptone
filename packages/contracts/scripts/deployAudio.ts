import { ethers } from "hardhat";

async function main() {
    const currentTimestampInSeconds = Math.round(Date.now() / 1000);
    const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
    const unlockTime = currentTimestampInSeconds + ONE_YEAR_IN_SECS;

    const lockedAmount = ethers.utils.parseEther("1");

    const CrypToneAudio = await ethers.getContractFactory("CrypToneAudio");
    const audio = await CrypToneAudio.deploy("0x4b48841d4b32C4650E4ABc117A03FE8B51f38F68", "polygon-mumbai");

    await audio.deployed();
    console.log(`CrypTone with 1 ETH and unlock timestamp ${unlockTime} deployed to ${audio.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
