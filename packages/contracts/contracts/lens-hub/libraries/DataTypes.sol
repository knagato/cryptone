// SPDX-License-Identifier: MIT

pragma solidity 0.8.16;

library DataTypes {
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
}
