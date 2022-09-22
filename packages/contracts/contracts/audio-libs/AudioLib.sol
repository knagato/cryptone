// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

library AudioLib {
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

    error InitParamsInvalid();
    error ProfileNFTNotFound();
    error UnknownNFTType();
    error ProfileIdInvalid();
    error NotTokenOwner();
    error MintWorkIdInvalid();
    error ProfileAddressInvalid();
    error MintBatchLengthInvalid();

    event AudioCreated(
        uint256 tokenId,
        address owner,
        uint256 workId,
        uint256 generation
    );

    event AudioMinted(
        AudioLib.NFTType nftType,
        address owner,
        uint256 workId,
        uint256 amount
    );

    event ProfileContractChanged(address newContract);
}
