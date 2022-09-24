import { ethers } from "hardhat";

async function main() {
    const currentTimestampInSeconds = Math.round(Date.now() / 1000);
    const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
    const unlockTime = currentTimestampInSeconds + ONE_YEAR_IN_SECS;

    const lockedAmount = ethers.utils.parseEther("1");

    const CrypToneProfile = await ethers.getContractFactory("ProfileLib");
    const profile = await CrypToneProfile.deploy();

    await profile.deployed();

    console.log(`CrypTone with 1 ETH and unlock timestamp ${unlockTime} deployed to ${profile.address}`);

    const CrypToneAudio = await ethers.getContractFactory("AudioLib");
    const audio = await CrypToneAudio.deploy();

    await audio.deployed();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});