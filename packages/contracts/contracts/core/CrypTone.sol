// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

import {ILensHub} from "../interfaces/ILensHub.sol";
import {Events} from "../libraries/Events.sol";
import {Constants} from "../libraries/Constants.sol";
import {DataTypes} from "../libraries/DataTypes.sol";
import {Errors} from "../libraries/Errors.sol";
import {PublishingLogic} from "../libraries/PublishingLogic.sol";
import {ProfileTokenURILogic} from "../libraries/ProfileTokenURILogic.sol";
import {LensNFTBase} from "./base/LensNFTBase.sol";
import {LensMultiState} from "./base/LensMultiState.sol";
import {LensHubStorage} from "./storage/LensHubStorage.sol";
import {VersionedInitializable} from "../upgradeability/VersionedInitializable.sol";

contract CrypTone is
    LensNFTBase,
    VersionedInitializable,
    LensMultiState,
    LensHubStorage,
    ILensHub
{
    uint256 internal constant REVISION = 1;

    address internal immutable AUDIO_NFT_IMPL;

    /**
     * @dev This modifier reverts if the caller is not the configured governance address.
     */
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

    function postNewWork(DataTypes.PostData calldata vars)
        external
        whenPublishingEnabled
        returns (uint256)
    {
        _validateCallerIsProfileOwner(vars.profileId);
        return _postNewWork(vars.profileId, vars.workURI);
    }

    function postNewWorkWithSig(DataTypes.PostWithSigData calldata vars)
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
                            keccak256(bytes(vars.workURI)),
                            sigNonces[owner]++,
                            vars.sig.deadline
                        )
                    )
                ),
                owner,
                vars.sig
            );
        }
        return _postNewWork(vars.profileId, vars.workURI);
    }

    function putOnSale(DataTypes.OnSaleData calldata vars)
        external
        whenPublishingEnabled
    {
        _validateCallerIsProfileOwner(vars.profileId);
        _putOnSale(vars.profileId, vars.workId, vars.amount);
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
                            vars.workId,
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
        return _putOnSale(vars.profileId, vars.workId, vars.amount);
    }

    /**
     * @notice Burns a profile, this maintains the profile data struct, but deletes the
     * handle hash to profile ID mapping value.
     *
     * NOTE: This overrides the LensNFTBase contract's `burn()` function and calls it to fully burn
     * the NFT.
     */
    function burn(uint256 tokenId) public override whenNotPaused {
        super.burn(tokenId);
        _clearHandleHash(tokenId);
    }

    /**
     * @notice Burns a profile with a signature, this maintains the profile data struct, but deletes the
     * handle hash to profile ID mapping value.
     *
     * NOTE: This overrides the LensNFTBase contract's `burnWithSig()` function and calls it to fully burn
     * the NFT.
     */
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

    function getWorkCount(uint256 profileId) external view returns (uint256) {
        return _profileById[profileId].workCount;
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

    function getWorkPointer(uint256 profileId, uint256 workId)
        external
        view
        returns (uint256, uint256)
    {
        uint256 profileIdPointed = _workByIdByProfile[profileId][workId]
            .profileIdPointed;
        uint256 workIdPointed = _workByIdByProfile[profileId][workId]
            .workIdPointed;
        return (profileIdPointed, workIdPointed);
    }

    function getContentURI(uint256 profileId, uint256 workId)
        external
        view
        returns (string memory)
    {
        return _workByIdByProfile[profileId][workId].contentURI;
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

    function getWork(uint256 profileId, uint256 workId)
        external
        view
        returns (DataTypes.WorkStruct memory)
    {
        return _workByIdByProfile[profileId][workId];
    }

    function getWorkType(uint256 profileId, uint256 workId)
        external
        view
        returns (DataTypes.PubType)
    {
        if (workId == 0 || _profileById[profileId].workCount < workId) {
            return DataTypes.PubType.Nonexistent;
            // } else if (
            //     _workByIdByProfile[profileId][workId].collectModule == address(0)
            // ) {
            //     return DataTypes.PubType.Mirror;
        } else if (
            _workByIdByProfile[profileId][workId].profileIdPointed == 0
        ) {
            return DataTypes.PubType.Post;
        } else {
            return DataTypes.PubType.Unknown;
        }
    }

    /**
     * @dev Overrides the ERC721 tokenURI function to return the associated URI with a given profile.
     */
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

    function _postNewWork(uint256 profileId, string memory contentURI)
        internal
        returns (uint256)
    {
        unchecked {
            uint256 workId = ++_profileById[profileId].workCount;
            PublishingLogic.postNewWork(
                profileId,
                contentURI,
                workId,
                AUDIO_NFT_IMPL,
                _workByIdByProfile,
                _profileById
            );
            return workId;
        }
    }

    function _putOnSale(
        uint256 profileId,
        uint256 workId,
        uint256 amount
    ) internal {
        if (_profileById[profileId].workCount < workId) {
            revert Errors.WorkIdInvalid();
        }

        PublishingLogic.putOnSale(profileId, workId, amount, _profileById);
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
        // if (_dispatcherByProfile[tokenId] != address(0)) {
        //     _setDispatcher(tokenId, address(0));
        // }

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
