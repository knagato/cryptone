// SPDX-License-Identifier: MIT

pragma solidity 0.8.16;

import {DataTypes} from "../libraries/DataTypes.sol";

interface ILensNFTBase {
    function burn(uint256 tokenId) external;

    function burnWithSig(
        uint256 tokenId,
        DataTypes.EIP712Signature calldata sig
    ) external;
}
