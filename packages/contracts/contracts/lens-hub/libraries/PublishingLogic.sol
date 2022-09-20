// SPDX-License-Identifier: MIT

pragma solidity 0.8.16;

import {DataTypes} from "./DataTypes.sol";
import {Errors} from "./Errors.sol";
import {Events} from "./Events.sol";
import {Constants} from "./Constants.sol";

library PublishingLogic {
    function createProfile(
        address to,
        string calldata tokenURI,
        uint256 profileId,
        mapping(uint256 => DataTypes.ProfileStruct) storage _profileById,
        mapping(address => uint256) storage _profileIdByAddress
    ) external {
        if (bytes(tokenURI).length > Constants.MAX_PROFILE_CONTENT_URI_LENGTH)
            revert Errors.ProfileURILengthInvalid();

        _profileById[profileId].tokenURI = tokenURI;
        _profileById[profileId].exists = true;
        _profileIdByAddress[to] = profileId;

        _emitProfileCreated(profileId, to, tokenURI);
    }

    function _emitProfileCreated(
        uint256 profileId,
        address to,
        string calldata tokenURI
    ) internal {
        emit Events.ProfileCreated(
            profileId,
            msg.sender, // Creator is always the msg sender
            to,
            tokenURI,
            block.timestamp
        );
    }
}
