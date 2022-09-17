// SPDX-License-Identifier: MIT

pragma solidity 0.8.16;

import {DataTypes} from "./DataTypes.sol";
import {Errors} from "./Errors.sol";
import {Events} from "./Events.sol";
import {Constants} from "./Constants.sol";
import {AudioNFT} from "../AudioNFT.sol";

library PublishingLogic {
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

    function postNewAudio(
        uint256 profileId,
        string memory contentURI,
        uint256 audioId,
        address audioNFTImpl,
        mapping(uint256 => mapping(uint256 => DataTypes.AudioStruct))
            storage _audioByIdByProfile,
        mapping(uint256 => DataTypes.ProfileStruct) storage _profileById
    ) external {
        // _audioByIdByProfile[profileId][audioId].contentURI = contentURI;
        address audioNFT = _profileById[profileId].audioNFTContract;
        if (audioNFT == address(0)) {
            audioNFT = _deployAudioNFT(profileId, audioNFTImpl);
            _profileById[profileId].audioNFTContract = audioNFT;
        }
        AudioNFT(audioNFT).addNewType(audioId, contentURI);

        // kottigawa nimo hozon
        _audioByIdByProfile[profileId][audioId].profileIdPointed = profileId;
        _audioByIdByProfile[profileId][audioId].audioIdPointed = audioId;
        _audioByIdByProfile[profileId][audioId].contentURI = contentURI;

        emit Events.PostCreated(
            profileId,
            audioId,
            contentURI,
            block.timestamp
        );
    }

    function putOnSale(
        uint256 profileId,
        uint256 audioId,
        uint256 amount,
        mapping(uint256 => DataTypes.ProfileStruct) storage _profileById
    ) external {
        if (_profileById[profileId].audioCount < audioId) {
            revert Errors.AudioIdInvalid();
        }
        address audioNFT = _profileById[profileId].audioNFTContract;
        if (audioNFT == address(0)) {
            revert Errors.AudioNFTInvalid();
        }

        AudioNFT(audioNFT).mint(audioId, amount);
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

    function _deployAudioNFT(uint256 profileId, address audioNFTImpl)
        private
        returns (address)
    {}
}
