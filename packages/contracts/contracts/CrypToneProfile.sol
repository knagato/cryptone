// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

import {ILensHub} from "./lens-hub/interfaces/ILensHub.sol";
import {Events} from "./lens-hub/libraries/Events.sol";
import {Constants} from "./lens-hub/libraries/Constants.sol";
import {DataTypes} from "./lens-hub/libraries/DataTypes.sol";
import {Errors} from "./lens-hub/libraries/Errors.sol";
import {PublishingLogic} from "./lens-hub/libraries/PublishingLogic.sol";
import {LensNFTBase} from "./lens-hub/core/base/LensNFTBase.sol";
import {LensMultiState} from "./lens-hub/core/base/LensMultiState.sol";
import {LensHubStorage} from "./lens-hub/core/storage/LensHubStorage.sol";
import {VersionedInitializable} from "./lens-hub/upgradeability/VersionedInitializable.sol";

contract CrypToneProfile is
    LensNFTBase,
    VersionedInitializable,
    LensMultiState,
    LensHubStorage,
    ILensHub
{
    uint256 internal constant REVISION = 1;

    modifier onlyGov() {
        _validateCallerIsGovernance();
        _;
    }

    constructor() {}

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

    /// *********************************
    /// *****PROFILE OWNER FUNCTIONS*****
    /// *********************************

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

    function setProfileURI(uint256 profileId, string calldata profileURI)
        external
        whenNotPaused
    {
        _validateCallerIsProfileOwner(profileId);
        _setProfileURI(profileId, profileURI);
    }

    function setProfileURIWithSig(
        DataTypes.SetProfileURIWithSigData calldata vars
    ) external whenNotPaused {
        address owner = ownerOf(vars.profileId);
        unchecked {
            _validateRecoveredAddress(
                _calculateDigest(
                    keccak256(
                        abi.encode(
                            SET_PROFILE_URI_WITH_SIG_TYPEHASH,
                            vars.profileId,
                            keccak256(bytes(vars.profileURI)),
                            sigNonces[owner]++,
                            vars.sig.deadline
                        )
                    )
                ),
                owner,
                vars.sig
            );
        }
        _setProfileURI(vars.profileId, vars.profileURI);
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

    function profileExists(address wallet) external view returns (bool) {
        return _profileById[_defaultProfileByAddress[wallet]].exists;
    }

    /// @inheritdoc ILensHub
    function getGovernance() external view override returns (address) {
        return _governance;
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

    function profileURI(uint256 tokenId) public view returns (string memory) {
        return _profileById[tokenId].profileURI;
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

    function _setProfileURI(uint256 profileId, string calldata profileURI)
        internal
    {
        if (bytes(profileURI).length > Constants.MAX_PROFILE_CONTENT_URI_LENGTH)
            revert Errors.ProfileURILengthInvalid();
        _profileById[profileId].profileURI = profileURI;
        emit Events.ProfileURISet(profileId, profileURI, block.timestamp);
    }

    function _clearHandleHash(uint256 profileId) internal {
        bytes32 handleHash = keccak256(bytes(_profileById[profileId].handle));
        _profileIdByHandleHash[handleHash] = 0;
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
