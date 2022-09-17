// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

import {ILensHub} from "./interfaces/ILensHub.sol";
import {Events} from "./libraries/Events.sol";
import {Constants} from "./libraries/Constants.sol";
import {DataTypes} from "./libraries/DataTypes.sol";
import {Errors} from "./libraries/Errors.sol";
import {PublishingLogic} from "./libraries/PublishingLogic.sol";
import {ProfileTokenURILogic} from "./libraries/ProfileTokenURILogic.sol";
import {LensNFTBase} from "./core/base/LensNFTBase.sol";
import {LensMultiState} from "./core/base/LensMultiState.sol";
import {LensHubStorage} from "./core/storage/LensHubStorage.sol";
import {VersionedInitializable} from "./upgradeability/VersionedInitializable.sol";

contract CrypTone is
    LensNFTBase,
    VersionedInitializable,
    LensMultiState,
    LensHubStorage,
    ILensHub
{
    uint256 internal constant REVISION = 1;

    address internal immutable AUDIO_NFT_IMPL;

    modifier onlyGov() {
        _validateCallerIsGovernance();
        _;
    }

    constructor(address audioNFTImpl) {
        if (audioNFTImpl == address(0)) revert Errors.InitParamsInvalid();
        AUDIO_NFT_IMPL = audioNFTImpl;
    }

    /// @inheritdoc ILensHub
    function initialize(
        string calldata name,
        string calldata symbol,
        address newGovernance
    ) external override initializer {
        super._initialize(name, symbol);
        _setState(DataTypes.ProtocolState.Paused);
        _setGovernance(newGovernance);
    }

    /// ***********************
    /// *****GOV FUNCTIONS*****
    /// ***********************

    /// @inheritdoc ILensHub
    function setGovernance(address newGovernance) external override onlyGov {
        _setGovernance(newGovernance);
    }

    /// @inheritdoc ILensHub
    function setEmergencyAdmin(address newEmergencyAdmin)
        external
        override
        onlyGov
    {
        address prevEmergencyAdmin = _emergencyAdmin;
        _emergencyAdmin = newEmergencyAdmin;
        emit Events.EmergencyAdminSet(
            msg.sender,
            prevEmergencyAdmin,
            newEmergencyAdmin,
            block.timestamp
        );
    }

    /// @inheritdoc ILensHub
    function setState(DataTypes.ProtocolState newState) external override {
        if (msg.sender == _emergencyAdmin) {
            if (newState == DataTypes.ProtocolState.Unpaused)
                revert Errors.EmergencyAdminCannotUnpause();
            _validateNotPaused();
        } else if (msg.sender != _governance) {
            revert Errors.NotGovernanceOrEmergencyAdmin();
        }
        _setState(newState);
    }

    function createProfile(DataTypes.CreateProfileData calldata vars)
        external
        override
        whenNotPaused
        returns (uint256)
    {
        unchecked {
            uint256 profileId = ++_profileCounter;
            _mint(vars.to, profileId);
            PublishingLogic.createProfile(
                vars,
                profileId,
                _profileIdByHandleHash,
                _profileById
            );
            return profileId;
        }
    }

    /// @inheritdoc ILensHub
    function setProfileImageURI(uint256 profileId, string calldata imageURI)
        external
        override
        whenNotPaused
    {
        _validateCallerIsProfileOwner(profileId);
        _setProfileImageURI(profileId, imageURI);
    }

    /// @inheritdoc ILensHub
    function setProfileImageURIWithSig(
        DataTypes.SetProfileImageURIWithSigData calldata vars
    ) external override whenNotPaused {
        address owner = ownerOf(vars.profileId);
        unchecked {
            _validateRecoveredAddress(
                _calculateDigest(
                    keccak256(
                        abi.encode(
                            SET_PROFILE_IMAGE_URI_WITH_SIG_TYPEHASH,
                            vars.profileId,
                            keccak256(bytes(vars.imageURI)),
                            sigNonces[owner]++,
                            vars.sig.deadline
                        )
                    )
                ),
                owner,
                vars.sig
            );
        }
        _setProfileImageURI(vars.profileId, vars.imageURI);
    }

    function postNewAudio(DataTypes.PostData calldata vars)
        external
        whenPublishingEnabled
        returns (uint256)
    {
        _validateCallerIsProfileOwner(vars.profileId);
        return _postNewAudio(vars.profileId, vars.audioURI);
    }

    function postNewAudioWithSig(DataTypes.PostWithSigData calldata vars)
        external
        whenPublishingEnabled
        returns (uint256)
    {
        address owner = ownerOf(vars.profileId);
        unchecked {
            _validateRecoveredAddress(
                _calculateDigest(
                    keccak256(
                        abi.encode(
                            POST_WITH_SIG_TYPEHASH,
                            vars.profileId,
                            keccak256(bytes(vars.audioURI)),
                            sigNonces[owner]++,
                            vars.sig.deadline
                        )
                    )
                ),
                owner,
                vars.sig
            );
        }
        return _postNewAudio(vars.profileId, vars.audioURI);
    }

    function putOnSale(DataTypes.OnSaleData calldata vars)
        external
        whenPublishingEnabled
    {
        _validateCallerIsProfileOwner(vars.profileId);
        _putOnSale(vars.profileId, vars.audioId, vars.amount);
    }

    function putOnSaleWithSig(DataTypes.OnSaleWithSigData calldata vars)
        external
        whenPublishingEnabled
    {
        address owner = ownerOf(vars.profileId);
        unchecked {
            _validateRecoveredAddress(
                _calculateDigest(
                    keccak256(
                        abi.encode(
                            ON_SALE_WITH_SIG_TYPEHASH,
                            vars.profileId,
                            vars.audioId,
                            vars.amount,
                            sigNonces[owner]++,
                            vars.sig.deadline
                        )
                    )
                ),
                owner,
                vars.sig
            );
        }
        return _putOnSale(vars.profileId, vars.audioId, vars.amount);
    }

    function burn(uint256 tokenId) public override whenNotPaused {
        super.burn(tokenId);
        _clearHandleHash(tokenId);
    }

    function burnWithSig(
        uint256 tokenId,
        DataTypes.EIP712Signature calldata sig
    ) public override whenNotPaused {
        super.burnWithSig(tokenId, sig);
        _clearHandleHash(tokenId);
    }

    /// @inheritdoc ILensHub
    function defaultProfile(address wallet)
        external
        view
        override
        returns (uint256)
    {
        return _defaultProfileByAddress[wallet];
    }

    /// @inheritdoc ILensHub
    function getGovernance() external view override returns (address) {
        return _governance;
    }

    function getAudioCount(uint256 profileId) external view returns (uint256) {
        return _profileById[profileId].audioCount;
    }

    /// @inheritdoc ILensHub
    function getHandle(uint256 profileId)
        external
        view
        override
        returns (string memory)
    {
        return _profileById[profileId].handle;
    }

    function getAudioPointer(uint256 profileId, uint256 audioId)
        external
        view
        returns (uint256, uint256)
    {
        uint256 profileIdPointed = _audioByIdByProfile[profileId][audioId]
            .profileIdPointed;
        uint256 audioIdPointed = _audioByIdByProfile[profileId][audioId]
            .audioIdPointed;
        return (profileIdPointed, audioIdPointed);
    }

    function getContentURI(uint256 profileId, uint256 audioId)
        external
        view
        returns (string memory)
    {
        return _audioByIdByProfile[profileId][audioId].contentURI;
    }

    /// @inheritdoc ILensHub
    function getProfileIdByHandle(string calldata handle)
        external
        view
        returns (uint256)
    {
        bytes32 handleHash = keccak256(bytes(handle));
        return _profileIdByHandleHash[handleHash];
    }

    /// @inheritdoc ILensHub
    function getProfile(uint256 profileId)
        external
        view
        override
        returns (DataTypes.ProfileStruct memory)
    {
        return _profileById[profileId];
    }

    function getAudio(uint256 profileId, uint256 audioId)
        external
        view
        returns (DataTypes.AudioStruct memory)
    {
        return _audioByIdByProfile[profileId][audioId];
    }

    function getAudioType(uint256 profileId, uint256 audioId)
        external
        view
        returns (DataTypes.PubType)
    {
        if (audioId == 0 || _profileById[profileId].audioCount < audioId) {
            return DataTypes.PubType.Nonexistent;
            // } else if (
            //     _audioByIdByProfile[profileId][audioId].collectModule == address(0)
            // ) {
            //     return DataTypes.PubType.Mirror;
        } else if (
            _audioByIdByProfile[profileId][audioId].profileIdPointed == 0
        ) {
            return DataTypes.PubType.Post;
        } else {
            return DataTypes.PubType.Unknown;
        }
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override
        returns (string memory)
    {
        return
            ProfileTokenURILogic.getProfileTokenURI(
                tokenId,
                ownerOf(tokenId),
                _profileById[tokenId].handle,
                _profileById[tokenId].imageURI
            );
    }

    /// ****************************
    /// *****INTERNAL FUNCTIONS*****
    /// ****************************

    function _setGovernance(address newGovernance) internal {
        address prevGovernance = _governance;
        _governance = newGovernance;
        emit Events.GovernanceSet(
            msg.sender,
            prevGovernance,
            newGovernance,
            block.timestamp
        );
    }

    function _postNewAudio(uint256 profileId, string memory contentURI)
        internal
        returns (uint256)
    {
        unchecked {
            uint256 audioId = ++_profileById[profileId].audioCount;
            PublishingLogic.postNewAudio(
                profileId,
                contentURI,
                audioId,
                AUDIO_NFT_IMPL,
                _audioByIdByProfile,
                _profileById
            );
            return audioId;
        }
    }

    function _putOnSale(
        uint256 profileId,
        uint256 audioId,
        uint256 amount
    ) internal {
        if (_profileById[profileId].audioCount < audioId) {
            revert Errors.AudioIdInvalid();
        }

        PublishingLogic.putOnSale(profileId, audioId, amount, _profileById);
    }

    function _setProfileImageURI(uint256 profileId, string calldata imageURI)
        internal
    {
        if (bytes(imageURI).length > Constants.MAX_PROFILE_IMAGE_URI_LENGTH)
            revert Errors.ProfileImageURILengthInvalid();
        _profileById[profileId].imageURI = imageURI;
        emit Events.ProfileImageURISet(profileId, imageURI, block.timestamp);
    }

    function _clearHandleHash(uint256 profileId) internal {
        bytes32 handleHash = keccak256(bytes(_profileById[profileId].handle));
        _profileIdByHandleHash[handleHash] = 0;
    }

    // Trade ProfileNFT??
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override whenNotPaused {
        if (_defaultProfileByAddress[from] == tokenId) {
            _defaultProfileByAddress[from] = 0;
        }

        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _validateCallerIsProfileOwner(uint256 profileId) internal view {
        if (msg.sender != ownerOf(profileId)) revert Errors.NotProfileOwner();
    }

    function _validateCallerIsGovernance() internal view {
        if (msg.sender != _governance) revert Errors.NotGovernance();
    }

    function getRevision() internal pure virtual override returns (uint256) {
        return REVISION;
    }
}
