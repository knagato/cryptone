// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

library DataTypes {
    enum NFTType {
        Audio,
        InheritAudio
    }

    struct AudioStruct {
        uint256 tokenId;
        string tokenURI;
        uint256 totalSupply;
    }
}
