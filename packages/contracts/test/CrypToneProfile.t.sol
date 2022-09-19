// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.16;

import "../lib/forge-std/src/Test.sol";
import "../lib/forge-std/src/Vm.sol";
import "../contracts/CrypToneProfile.sol";
import "../contracts/lens-hub/libraries/DataTypes.sol";

contract CrypToneProfileTest is Test {
    CrypToneProfile profileContract;
    address governance;
    address emergency;
    address user;

    function setUp() public returns (address) {
        governance = address(this);
        emergency = address(0);
        // user = msg.sender;

        profileContract = new CrypToneProfile();
        profileContract.initialize("CrypToneProfile", "CTP", governance);
        profileContract.setEmergencyAdmin(emergency);
        profileContract.setState(DataTypes.ProtocolState.Unpaused);
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

    event ProfEv(DataTypes.ProfileStruct profile);

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
        assertEq(firstProfile.profileURI, "example.com");
    }
}
