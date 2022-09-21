// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

import "./DataTypes.sol";

library Events {
    event AudioCreated(
        uint256 tokenId,
        address owner,
        uint256 workId,
        uint256 generation
    );

    event AudioMinted(
        DataTypes.NFTType nftType,
        address owner,
        uint256 workId,
        uint256 amount
    );

    event ProfileContractChanged(address newContract);
}
