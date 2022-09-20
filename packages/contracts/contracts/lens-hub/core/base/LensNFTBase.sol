// SPDX-License-Identifier: MIT

pragma solidity 0.8.16;

import {ILensNFTBase} from "../../interfaces/ILensNFTBase.sol";
import {Errors} from "../../libraries/Errors.sol";
import {DataTypes} from "../../libraries/DataTypes.sol";
import {Events} from "../../libraries/Events.sol";
import {ERC721Time} from "./ERC721Time.sol";
import {ERC721Enumerable} from "./ERC721Enumerable.sol";

abstract contract LensNFTBase is ERC721Enumerable, ILensNFTBase {
    bytes32 internal constant EIP712_REVISION_HASH = keccak256("1");

    bytes32 internal constant BURN_WITH_SIG_TYPEHASH =
        keccak256(
            "BurnWithSig(uint256 tokenId,uint256 nonce,uint256 deadline)"
        );
    bytes32 internal constant EIP712_DOMAIN_TYPEHASH =
        keccak256(
            "EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"
        );

    mapping(address => uint256) public sigNonces;

    function _initialize(string calldata name, string calldata symbol)
        internal
    {
        ERC721Time.__ERC721_Init(name, symbol);

        emit Events.BaseInitialized(name, symbol, block.timestamp);
    }

    /// @inheritdoc ILensNFTBase
    function burn(uint256 tokenId) public virtual override {
        if (!_isApprovedOrOwner(msg.sender, tokenId))
            revert Errors.NotOwnerOrApproved();
        _burn(tokenId);
    }
}
