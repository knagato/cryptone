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
    address user;

    event ProfEv(DataTypes.ProfileStruct profile);

    function setUp() public returns (address) {
        governance = address(this);
        emergency = address(0);
        // user = msg.sender;

        profileContract = new CrypToneProfile();
        profileContract.initialize("CrypToneProfile", "CTP", governance);
        profileContract.setEmergencyAdmin(emergency);
        profileContract.setState(DataTypes.ProtocolState.Unpaused);

        audioContract = new CrypToneAudio(address(profileContract));
    }

    function testGovernance() public {
        assertEq(profileContract.getGovernance(), governance);
        profileContract.setGovernance(address(0));
        assertEq(profileContract.getGovernance(), address(0));
    }

    function testState() public {
        assertEq(uint256(profileContract.getState()), 0);
        profileContract.setState(DataTypes.ProtocolState.Paused);
        assertEq(uint256(profileContract.getState()), 2);
    }

    function testCreateProfile() public {
        DataTypes.CreateProfileData memory myProfile = DataTypes
            .CreateProfileData(governance, "example.com");
        uint256 firstId = 1;

        // profileContract.setState(DataTypes.ProtocolState.Paused);
        // Vm.expectRevert(profileContract.createProfile(myProfile));
        profileContract.setState(DataTypes.ProtocolState.Unpaused);
        assertEq(profileContract.createProfile(myProfile), firstId);

        DataTypes.ProfileStruct memory firstProfile = profileContract
            .getProfile(firstId);
        emit ProfEv(firstProfile);
        assertEq(firstProfile.tokenURI, "example.com");

        // assertEq(profileContract.createProfile(myProfile), ++firstId);
    }

    function testMintAudio() public {
        DataTypes.CreateProfileData memory myProfile = DataTypes
            .CreateProfileData(governance, "example.com");
        uint256 firstId = 1;

        profileContract.setState(DataTypes.ProtocolState.Unpaused);
        assertEq(profileContract.createProfile(myProfile), firstId);

        uint256 work1 = audioContract.postWork(
            AudioTypes.NFTType.Audio,
            "example1.example1"
        );
        uint256 work2 = audioContract.postWork(
            AudioTypes.NFTType.Audio,
            "example2.example2"
        );
        uint256 work3 = audioContract.postWork(
            AudioTypes.NFTType.InheritAudio,
            "example3.example3"
        );

        audioContract.mint(AudioTypes.NFTType.Audio, work2, 250);
    }
}
