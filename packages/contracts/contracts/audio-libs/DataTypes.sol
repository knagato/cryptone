// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

library DataTypes {
    enum NFTType {
        Audio,
        Inherit
    }

    struct AudioStruct {
        uint256 tokenId;
        address creatorAddress;
        uint256 generation;
        uint256 maxSupply;
    }

    struct InheritStruct {
        uint256 tokenId;
        address creatorAddress;
        uint256 generation;
        uint256 parentTokenId;
        uint256 maxSupply;
    }

    struct RefStruct {
        NFTType nftType;
        address creatorAddress;
        uint256 workId;
        bool exists;
    }
}
