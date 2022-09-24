// SPDX-License-Identifier: MIT

pragma solidity 0.8.16;

library ProfileLib {
    uint8 internal constant MAX_HANDLE_LENGTH = 31;
    uint16 internal constant MAX_PROFILE_CONTENT_URI_LENGTH = 6000;

    enum ProtocolState {
        Unpaused,
        PublishingPaused,
        Paused
    }

    struct ProfileStruct {
        uint256 tokenId;
        string tokenURI;
        bool exists;
    }

    error CannotInitImplementation();
    error Initialized();
    error SignatureExpired();
    error SignatureInvalid();
    error NotOwnerOrApproved();
    error NotGovernance();
    error NotGovernanceOrEmergencyAdmin();
    error EmergencyAdminCannotUnpause();
    error NotProfileOwner();
    error ProfileURILengthInvalid();

    error ProfileAlreadyExists();
    error ProfileNotFound();
    error NotSenderAddress();

    // MultiState ProfileLib
    error Paused();

    event BaseInitialized(string name, string symbol, uint256 timestamp);

    event StateSet(
        address indexed caller,
        ProtocolState indexed prevState,
        ProtocolState indexed newState,
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

    function createProfile(
        address to,
        string calldata tokenURI,
        uint256 profileId,
        mapping(uint256 => ProfileStruct) storage _profileById,
        mapping(address => uint256) storage _profileIdByAddress
    ) external {
        if (bytes(tokenURI).length > MAX_PROFILE_CONTENT_URI_LENGTH)
            revert ProfileURILengthInvalid();

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
        emit ProfileCreated(
            profileId,
            msg.sender, // Creator is always the msg sender
            to,
            tokenURI,
            block.timestamp
        );
    }
}
