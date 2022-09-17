// SPDX-License-Identifier: MIT

pragma solidity 0.8.15;

import {DataTypes} from "../../libraries/DataTypes.sol";

/**
 * @title LensHubStorage
 * @author Lens Protocol
 *
 * @notice This is an abstract contract that *only* contains storage for the LensHub contract. This
 * *must* be inherited last (bar interfaces) in order to preserve the LensHub storage layout. Adding
 * storage variables should be done solely at the bottom of this contract.
 */
abstract contract LensHubStorage {
    bytes32 internal constant SET_PROFILE_IMAGE_URI_WITH_SIG_TYPEHASH =
        keccak256(
            "SetProfileImageURIWithSig(uint256 profileId,string imageURI,uint256 nonce,uint256 deadline)"
        );
    bytes32 internal constant POST_WITH_SIG_TYPEHASH =
        keccak256(
            "PostNewWorkWithSig(uint256 profileId,string workURI,uint256 nonce,uint256 deadline)"
        );
    bytes32 internal constant ON_SALE_WITH_SIG_TYPEHASH =
        keccak256(
            "PutOnSaleWithSig(uint256 profileId,uint256 workId,uint256 amount,uint256 nonce,uint256 deadline)"
        );

    mapping(bytes32 => uint256) internal _profileIdByHandleHash;
    mapping(uint256 => DataTypes.ProfileStruct) internal _profileById;

    mapping(uint256 => mapping(uint256 => DataTypes.PublicationStruct))
        internal _pubByIdByProfile;

    mapping(address => uint256) internal _defaultProfileByAddress;

    uint256 internal _profileCounter;
    address internal _governance;
    address internal _emergencyAdmin;
}
