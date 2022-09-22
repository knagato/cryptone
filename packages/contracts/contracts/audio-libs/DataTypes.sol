// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

library DataTypes {
    enum NFTType {
        Audio,
        Inherit
    }

    struct AudioStruct {
        uint256 tokenId;
        uint256 maxSupply;
        uint256 totalSupply;
    }

    struct InheritStruct {
        uint256 tokenId;
        uint256 maxSupply;
        uint256 totalSupply;
        uint256 generation;
        uint256 parentTokenId;
    }

    struct RefStruct {
        NFTType nftType;
        address creatorAddress;
        uint256 workId;
        bool exists;
    }
}
