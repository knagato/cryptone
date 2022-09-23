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
        bool metadataFirstHalfInit;
        bool metadataSecondHalfInit;
    }

    struct InheritStruct {
        uint256 tokenId;
        uint256 maxSupply;
        uint256 totalSupply;
        uint256 generation;
        uint256 parentTokenId;
        bool metadataFirstHalfInit;
        bool metadataSecondHalfInit;
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
    error FirstHalfNotInitialized();
    error ThisHalfAlreadyInitialized();
}
