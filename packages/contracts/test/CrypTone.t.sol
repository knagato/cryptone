// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.16;

import "../lib/forge-std/src/Test.sol";
import "../lib/forge-std/src/Vm.sol";
import {CrypToneProfile} from "../contracts/CrypToneProfile.sol";
import {CrypToneAudio, DataTypes as AudioTypes} from "../contracts/CrypToneAudio.sol";
import "../contracts/lens-hub/libraries/DataTypes.sol";

contract CrypToneTest is Test {
    CrypToneProfile profileContract;
    CrypToneAudio audioContract;

    address governance;
    address emergency;
    address user1 = ;
    address user2 = ;

    address tableRegistry = 0x4b48841d4b32C4650E4ABc117A03FE8B51f38F68;
    string chainName = "polygon-mumbai";

    event ProfEv(DataTypes.ProfileStruct profile);

    function setUp() public returns (address) {
        governance = address(this);
        emergency = user1;

        profileContract = new CrypToneProfile();
        profileContract.initialize("CrypToneProfile", "CTP", governance);
        profileContract.setEmergencyAdmin(emergency);
        profileContract.setState(DataTypes.ProtocolState.Unpaused);

        audioContract = new CrypToneAudio(tableRegistry, chainName);
    }

    function testGovernance() public {
        assertEq(profileContract.getGovernance(), governance);
        profileContract.setGovernance(user1);
        assertEq(profileContract.getGovernance(), user1);
    }

    function testState() public {
        assertEq(uint256(profileContract.getState()), 0);
        profileContract.setState(DataTypes.ProtocolState.Paused);
        assertEq(uint256(profileContract.getState()), 2);
    }

    function testCreateProfile() public {
        profileContract.setState(DataTypes.ProtocolState.Unpaused);
        uint256 firstProfileId = profileContract.createProfileOnlyGov(
            user1,
            "example.com"
        );
        assertEq(firstProfileId, 1);
        uint256 secondProfileId = profileContract.createProfileOnlyGov(
            user2,
            "example.com/blob"
        );
        assertEq(secondProfileId, 2);

        DataTypes.ProfileStruct memory firstProfile = profileContract
            .getProfile(firstProfileId);
        emit ProfEv(firstProfile);
        assertEq(firstProfile.tokenURI, "example.com");
    }

    function testMintAudio() public {
        profileContract.setState(DataTypes.ProtocolState.Unpaused);
        uint256 firstProfileId = profileContract.createProfileOnlyGov(
            user1,
            "example.com"
        );

        uint256 firstTokenId = audioContract.postNewWorkOnlyOwner(user1, 0);
        assertEq(firstTokenId, 1);
        audioContract.setMetadata(
            firstTokenId,
            "enaucid-1",
            "ensymkey-1",
            "pvaucid-1",
            "jackcid-1"
        );

        uint256 secondTokenId = audioContract.postNewWorkOnlyOwner(user1, 0);
        assertEq(secondTokenId, 1);
        audioContract.setMetadata(
            secondTokenId,
            "enaucid-2",
            "ensymkey-2",
            "pvaucid-2",
            "jackcid-2"
        );

        uint256 thirdTokenId = audioContract.postNewWorkOnlyOwner(user1, 1);
        assertEq(thirdTokenId, 1);
        audioContract.setMetadata(
            thirdTokenId,
            "enaucid-3",
            "ensymkey-3",
            "pvaucid-3",
            "jackcid-3"
        );

        audioContract.mintOnlyOwner(
            user1,
            AudioTypes.NFTType.Audio,
            secondTokenId,
            250,
            1000
        );
    }
}
