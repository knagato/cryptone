import { ethers } from "hardhat";

async function main() {
    const CrypToneProfile = await ethers.getContractFactory("CrypToneProfile", {
        libraries: {
            ProfileLib: "0xbA4Bf14C4859c908fCDB38c9Fa693ef74DB85307",
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
