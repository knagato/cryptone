// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

import {ILensHub} from "./lens-hub/interfaces/ILensHub.sol";
import {ProfileLib} from "./lens-hub/libraries/ProfileLib.sol";
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

    event BaseInitialized(string name, string symbol, uint256 timestamp);

    event StateSet(
        address indexed caller,
        ProfileLib.ProtocolState indexed prevState,
        ProfileLib.ProtocolState indexed newState,
        uint256 timestamp
    );

    event GovernanceSet(
        address indexed caller,
        address indexed prevGovernance,
        address indexed newGovernance,
        uint256 timestamp
    );

    event EmergencyAdminSet(
        address indexed caller,
        address indexed oldEmergencyAdmin,
        address indexed newEmergencyAdmin,
        uint256 timestamp
    );

    event ProfileCreated(
        uint256 indexed profileId,
        address indexed creator,
        address indexed to,
        string contentURI,
        uint256 timestamp
    );

    event ProfileURISet(
        uint256 indexed profileId,
        string contentURI,
        uint256 timestamp
    );

    constructor() {}

    /// @inheritdoc ILensHub
    function initialize(
        string calldata name,
        string calldata symbol,
        address newGovernance
    ) external override initializer {
        super._initialize(name, symbol);
        _setState(ProfileLib.ProtocolState.Paused);
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
        emit ProfileLib.EmergencyAdminSet(
            msg.sender,
            prevEmergencyAdmin,
            newEmergencyAdmin,
            block.timestamp
        );
    }

    /// @inheritdoc ILensHub
    function setState(ProfileLib.ProtocolState newState) external override {
        if (msg.sender == _emergencyAdmin) {
            if (newState == ProfileLib.ProtocolState.Unpaused)
                revert ProfileLib.EmergencyAdminCannotUnpause();
            _validateNotPaused();
        } else if (msg.sender != _governance) {
            revert ProfileLib.NotGovernanceOrEmergencyAdmin();
        }
        _setState(newState);
    }

    /// *********************************
    /// *****PROFILE OWNER FUNCTIONS*****
    /// *********************************

    function createProfile(string calldata tokenURI)
        external
        whenNotPaused
        returns (uint256)
    {
        if (_profileIdByAddress[msg.sender] > 0)
            revert ProfileLib.ProfileAlreadyExists();

        unchecked {
            uint256 profileId = ++_profileCounter;
            _mint(msg.sender, profileId);
            ProfileLib.createProfile(
                msg.sender,
                tokenURI,
                profileId,
                _profileById,
                _profileIdByAddress
            );
            return profileId;
        }
    }

    function createProfileOnlyGov(address to, string calldata tokenURI)
        external
        whenNotPaused
        onlyGov
        returns (uint256)
    {
        if (_profileIdByAddress[to] > 0)
            revert ProfileLib.ProfileAlreadyExists();

        unchecked {
            uint256 profileId = ++_profileCounter;
            _mint(to, profileId);
            ProfileLib.createProfile(
                to,
                tokenURI,
                profileId,
                _profileById,
                _profileIdByAddress
            );
            return profileId;
        }
    }

    function setProfileURI(string calldata tokenURI) external whenNotPaused {
        _setProfileURI(msg.sender, tokenURI);
    }

    function setProfileURIOnlyGov(
        address profileAddress,
        string calldata tokenURI
    ) external whenNotPaused onlyGov {
        _setProfileURI(profileAddress, tokenURI);
    }

    // function burn() public whenNotPaused {
    //     uint256 profileId = _profileIdByAddress[msg.sender];
    //     if (profileId == 0) revert ProfileLib.ProfileNotFound();

    //     super.burn(profileId);
    //     _clearHandleHash(profileId);
    // }

    function getProfileId(address wallet) external view returns (uint256) {
        return _profileIdByAddress[wallet];
    }

    /// @inheritdoc ILensHub
    function getProfile(uint256 profileId)
        external
        view
        override
        returns (ProfileLib.ProfileStruct memory)
    {
        return _profileById[profileId];
    }

    function profileExists(address wallet) external view returns (bool) {
        return _profileById[_profileIdByAddress[wallet]].exists;
    }

    function profileURI(uint256 profileId) public view returns (string memory) {
        return _profileById[profileId].tokenURI;
    }

    /// @inheritdoc ILensHub
    function getGovernance() external view override returns (address) {
        return _governance;
    }

    /// ****************************
    /// *****INTERNAL FUNCTIONS*****
    /// ****************************

    function _setGovernance(address newGovernance) internal {
        address prevGovernance = _governance;
        _governance = newGovernance;
        emit ProfileLib.GovernanceSet(
            msg.sender,
            prevGovernance,
            newGovernance,
            block.timestamp
        );
    }

    function _setProfileURI(address profileAddress, string calldata tokenURI)
        internal
    {
        uint256 profileId = _profileIdByAddress[profileAddress];
        if (profileId == 0) revert ProfileLib.ProfileNotFound();

        if (bytes(tokenURI).length > ProfileLib.MAX_PROFILE_CONTENT_URI_LENGTH)
            revert ProfileLib.ProfileURILengthInvalid();
        _profileById[profileId].tokenURI = tokenURI;
        emit ProfileLib.ProfileURISet(profileId, tokenURI, block.timestamp);
    }

    function _validateCallerIsProfileOwner(uint256 profileId) internal view {
        if (msg.sender != ownerOf(profileId))
            revert ProfileLib.NotProfileOwner();
    }

    function _validateCallerIsGovernance() internal view {
        if (msg.sender != _governance) revert ProfileLib.NotGovernance();
    }

    function getRevision() internal pure virtual override returns (uint256) {
        return REVISION;
    }
}
