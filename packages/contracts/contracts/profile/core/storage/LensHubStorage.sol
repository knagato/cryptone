// SPDX-License-Identifier: MIT

pragma solidity 0.8.16;

import {DataTypes} from "../../libraries/DataTypes.sol";

abstract contract LensHubStorage {
    bytes32 internal constant SET_PROFILE_URI_WITH_SIG_TYPEHASH =
        keccak256(
            "SetProfileImageURIWithSig(uint256 profileId,string imageURI,uint256 nonce,uint256 deadline)"
        );
    // bytes32 internal constant POST_WITH_SIG_TYPEHASH =
    //     keccak256(
    //         "PostNewAudioWithSig(uint256 profileId,string audioURI,uint256 nonce,uint256 deadline)"
    //     );
    // bytes32 internal constant ON_SALE_WITH_SIG_TYPEHASH =
    //     keccak256(
    //         "PutOnSaleWithSig(uint256 profileId,uint256 audioId,uint256 amount,uint256 nonce,uint256 deadline)"
    //     );

    mapping(bytes32 => uint256) internal _profileIdByHandleHash;
    mapping(uint256 => DataTypes.ProfileStruct) internal _profileById;

    // mapping(uint256 => mapping(uint256 => DataTypes.AudioStruct))
    //     internal _audioByIdByProfile;

    mapping(address => uint256) internal _defaultProfileByAddress;

    uint256 internal _profileCounter;
    address internal _governance;
    address internal _emergencyAdmin;
}
