// SPDX-License-Identifier: MIT

pragma solidity 0.8.16;

import {DataTypes} from "./DataTypes.sol";
import {Errors} from "./Errors.sol";
import {Events} from "./Events.sol";
import {Constants} from "./Constants.sol";

library PublishingLogic {
    function createProfile(
        DataTypes.CreateProfileData calldata vars,
        uint256 profileId,
        mapping(uint256 => DataTypes.ProfileStruct) storage _profileById,
        mapping(address => uint256) storage _profileIdByAddress
    ) external {
        if (
            bytes(vars.profileURI).length >
            Constants.MAX_PROFILE_CONTENT_URI_LENGTH
        ) revert Errors.ProfileURILengthInvalid();

        _profileById[profileId].profileURI = vars.profileURI;
        _profileById[profileId].exists = true;
        _profileIdByAddress[vars.to] = profileId;

        _emitProfileCreated(profileId, vars);
    }

    function _emitProfileCreated(
        uint256 profileId,
        DataTypes.CreateProfileData calldata vars
    ) internal {
        emit Events.ProfileCreated(
            profileId,
            msg.sender, // Creator is always the msg sender
            vars.to,
            vars.profileURI,
            block.timestamp
        );
    }
}
