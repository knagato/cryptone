import { ethers } from "hardhat";

async function main() {
    const CrypToneProfile = await ethers.getContractFactory("CrypToneProfile", {
        libraries: {
            ProfileLib: "0xC4faFA40fC1864e1E8483CC7859c6eE3f6AE2531",
        }
    });
    const profile = await CrypToneProfile.deploy();

    await profile.deployed();

    console.log(`deployed to ${profile.address}`);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
