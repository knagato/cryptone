// SPDX-License-Identifier: MIT

pragma solidity 0.8.16;

library DataTypes {
    enum ProtocolState {
        Unpaused,
        PublishingPaused,
        Paused
    }

    // enum PubType {
    //     PostAudio,
    //     Nonexistent,
    //     Unknown
    // }

    struct EIP712Signature {
        uint8 v;
        bytes32 r;
        bytes32 s;
        uint256 deadline;
    }

    struct ProfileStruct {
        // uint256 audioCount;
        string handle;
        string contentURI;
        // address audioNFTContract;
        bool exists;
    }

    // struct AudioStruct {
    //     uint256 profileIdPointed;
    //     uint256 audioIdPointed;
    //     string contentURI;
    // }

    struct CreateProfileData {
        address to;
        string handle;
        string contentURI;
    }

    struct SetDefaultProfileWithSigData {
        address wallet;
        uint256 profileId;
        EIP712Signature sig;
    }

    struct SetProfileContentURIWithSigData {
        uint256 profileId;
        string contentURI;
        EIP712Signature sig;
    }

    // struct PostData {
    //     uint256 profileId;
    //     string audioURI;
    // }

    // struct PostWithSigData {
    //     uint256 profileId;
    //     string audioURI;
    //     EIP712Signature sig;
    // }

    // struct OnSaleData {
    //     uint256 profileId;
    //     uint256 audioId;
    //     uint256 amount;
    // }

    // struct OnSaleWithSigData {
    //     uint256 profileId;
    //     uint256 audioId;
    //     uint256 amount;
    //     EIP712Signature sig;
    // }

    struct SetProfileMetadataWithSigData {
        uint256 profileId;
        string metadata;
        EIP712Signature sig;
    }
}
