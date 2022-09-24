// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

abstract contract AudioDefine {
    enum WorkType {
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
        WorkType workType;
        address creatorAddress;
        uint256 workId;
        bool exists;
    }

    // error InitParamsInvalid();
    // error ProfileNFTNotFound();
    error UnknownWorkType();
    error ProfileIdInvalid();
    error NotTokenOwner();
    error MintWorkIdInvalid();
    error ProfileAddressInvalid();
    error MintBatchLengthInvalid();
    error FirstHalfNotInitialized();
    error ThisHalfAlreadyInitialized();

    event AudioCreated(
        uint256 tokenId,
        address owner,
        uint256 workId,
        uint256 generation
    );

    event AudioMinted(
        uint256 tokenId,
        uint256 amount,
        uint256 salesPrice
    );

    event AudioBatchMinted(
        uint256[] tokenIds,
        uint256[] amounts,
        uint256[] salesPrices
    );

    event ProfileContractChanged(address newContract);
}
