// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

library DataTypes {
    enum NFTType {
        Audio,
        InheritAudio
    }

    struct AudioStruct {
        uint256 tokenId;
        address creatorAddress;
        uint256 generation;
        string tokenURI;
        uint256 maxSupply;
    }

    struct InheritAudioStruct {
        uint256 tokenId;
        address creatorAddress;
        uint256 generation;
        string tokenURI;
        uint256 parentTokenId;
        uint256 maxSupply;
    }
}
