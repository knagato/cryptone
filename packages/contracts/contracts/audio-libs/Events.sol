// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

import "./DataTypes.sol";

library Events {
    event AudioPosted(
        DataTypes.NFTType nftType,
        address owner,
        uint256 workId,
        uint256 tokenId
    );

    event AudioMinted(
        DataTypes.NFTType nftType,
        address owner,
        uint256 workId,
        uint256 amount
    );

    event ProfileContractChanged(
        address newContract
    );
}
