// SPDX-License-Identifier: MIT

pragma solidity 0.8.15;

import {DataTypes} from "./DataTypes.sol";
import {Errors} from "./Errors.sol";
import {Events} from "./Events.sol";
import {Constants} from "./Constants.sol";

/**
 * @title PublishingLogic
 * @author Lens Protocol
 *
 * @notice This is the library that contains the logic for profile creation & publication.
 *
 * @dev The functions are external, so they are called from the hub via `delegateCall` under the hood. Furthermore,
 * expected events are emitted from this library instead of from the hub to alleviate code size concerns.
 */
library PublishingLogic {
    /**
     * @notice Executes the logic to create a profile with the given parameters to the given address.
     *
     * @param vars The CreateProfileData struct containing the following parameters:
     *      to: The address receiving the profile.
     *      handle: The handle to set for the profile, must be unique and non-empty.
     *      imageURI: The URI to set for the profile image.
     * @param profileId The profile ID to associate with this profile NFT (token ID).
     * @param _profileIdByHandleHash The storage reference to the mapping of profile IDs by handle hash.
     * @param _profileById The storage reference to the mapping of profile structs by IDs.
     */
    function createProfile(
        DataTypes.CreateProfileData calldata vars,
        uint256 profileId,
        mapping(bytes32 => uint256) storage _profileIdByHandleHash,
        mapping(uint256 => DataTypes.ProfileStruct) storage _profileById
    ) external {
        _validateHandle(vars.handle);

        if (
            bytes(vars.imageURI).length > Constants.MAX_PROFILE_IMAGE_URI_LENGTH
        ) revert Errors.ProfileImageURILengthInvalid();

        bytes32 handleHash = keccak256(bytes(vars.handle));

        if (_profileIdByHandleHash[handleHash] != 0)
            revert Errors.HandleTaken();

        _profileIdByHandleHash[handleHash] = profileId;
        _profileById[profileId].handle = vars.handle;
        _profileById[profileId].imageURI = vars.imageURI;

        _emitProfileCreated(profileId, vars);
    }

    /**
     * @notice Creates a post publication mapped to the given profile.
     *
     * @dev To avoid a stack too deep error, reference parameters are passed in memory rather than calldata.
     *
     * @param profileId The profile ID to associate this publication to.
     * @param contentURI The URI to set for this publication.
     * @param pubId The publication ID to associate with this publication.
     * @param _pubByIdByProfile The storage reference to the mapping of publications by publication ID by profile ID.
     */
    function createPost(
        uint256 profileId,
        string memory contentURI,
        uint256 pubId,
        mapping(uint256 => mapping(uint256 => DataTypes.PublicationStruct))
            storage _pubByIdByProfile
    ) external {
        _pubByIdByProfile[profileId][pubId].contentURI = contentURI;

        emit Events.PostCreated(profileId, pubId, contentURI, block.timestamp);
    }

    function _emitProfileCreated(
        uint256 profileId,
        DataTypes.CreateProfileData calldata vars
    ) internal {
        emit Events.ProfileCreated(
            profileId,
            msg.sender, // Creator is always the msg sender
            vars.to,
            vars.handle,
            vars.imageURI,
            block.timestamp
        );
    }

    function _validateHandle(string calldata handle) private pure {
        bytes memory byteHandle = bytes(handle);
        if (
            byteHandle.length == 0 ||
            byteHandle.length > Constants.MAX_HANDLE_LENGTH
        ) revert Errors.HandleLengthInvalid();

        uint256 byteHandleLength = byteHandle.length;
        for (uint256 i = 0; i < byteHandleLength; ) {
            if (
                (byteHandle[i] < "0" ||
                    byteHandle[i] > "z" ||
                    (byteHandle[i] > "9" && byteHandle[i] < "a")) &&
                byteHandle[i] != "." &&
                byteHandle[i] != "-" &&
                byteHandle[i] != "_"
            ) revert Errors.HandleContainsInvalidCharacters();
            unchecked {
                ++i;
            }
        }
    }
}
