// SPDX-License-Identifier: MIT

pragma solidity 0.8.16;

library DataTypes {
    enum ProtocolState {
        Unpaused,
        PublishingPaused,
        Paused
    }

    struct EIP712Signature {
        uint8 v;
        bytes32 r;
        bytes32 s;
        uint256 deadline;
    }

    struct ProfileStruct {
        uint256 tokenId;
        string tokenURI;
        bool exists;
    }

    struct CreateProfileData {
        address to;
        string tokenURI;
    }

    struct CreateProfileWithSigData {
        address to;
        string tokenURI;
        EIP712Signature sig;
    }

    struct SetProfileURIWithSigData {
        uint256 profileId;
        string tokenURI;
        EIP712Signature sig;
    }

    struct SetProfileMetadataWithSigData {
        uint256 profileId;
        string metadata;
        EIP712Signature sig;
    }
}
