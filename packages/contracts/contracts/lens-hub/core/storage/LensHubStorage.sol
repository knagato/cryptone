// SPDX-License-Identifier: MIT

pragma solidity 0.8.16;

import {ProfileLib} from "../../libraries/ProfileLib.sol";

abstract contract LensHubStorage {
    bytes32 internal constant CREATE_PROFILE_WITH_SIG_TYPEHASH =
        keccak256(
            "CreateProfileWithSig(address to,string tokenURI,uint256 nonce,uint256 deadline)"
        );

    bytes32 internal constant SET_PROFILE_URI_WITH_SIG_TYPEHASH =
        keccak256(
            "SetProfileURIWithSig(uint256 profileId,string tokenURI,uint256 nonce,uint256 deadline)"
        );

    mapping(uint256 => ProfileLib.ProfileStruct) internal _profileById;
    mapping(address => uint256) internal _profileIdByAddress;

    uint256 internal _profileCounter;
    address internal _governance;
    address internal _emergencyAdmin;
}
