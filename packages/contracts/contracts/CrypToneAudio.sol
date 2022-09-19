// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

import "../node_modules/@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "./CrypToneProfile.sol";

contract CrypToneAudio is ERC1155 {
    address internal immutable PROFILE_NFT_CONTRACT;

    enum NFTType {
        Audio,
        InheritAudio
    }

    struct AudioStruct {
        uint256 tokenId;
        string tokenURI;
        uint256 supplyAmount;
    }
    uint256 tokenCount = 0;

    mapping(NFTType => mapping(address => mapping(uint256 => AudioStruct)))
        internal audioByWorkIdByProfileByNFTType;
    mapping(NFTType => mapping(address => uint256))
        internal workCountByProfileByNFTType;

    event AudioPosted(
        NFTType nftType,
        address owner,
        uint256 workId,
        uint256 tokenId
    );
    event AudioMinted(
        NFTType nftType,
        address owner,
        uint256 workId,
        uint256 amount
    );

    error InitParamsInvalid();
    error ProfileNFTNotFound();
    error ProfileIdInvalid();
    error MintWorkIdInvalid();
    error ProfileAddressInvalid();
    error MintBatchLengthInvalid();

    constructor(address profileNFTContract) ERC1155("") {
        if (profileNFTContract == address(0)) {
            revert InitParamsInvalid();
        }
        PROFILE_NFT_CONTRACT = profileNFTContract;
    }

    // tokenURI is expected IPFS CID
    function postWork(NFTType nftType, string memory tokenURI)
        external
        returns (uint256)
    {
        if (!_profileNFTExists(msg.sender)) {
            revert ProfileNFTNotFound();
        }
        uint256 newWorkId = workCountByProfileByNFTType[nftType][msg.sender];
        audioByWorkIdByProfileByNFTType[nftType][msg.sender][newWorkId]
            .tokenId = tokenCount;
        audioByWorkIdByProfileByNFTType[nftType][msg.sender][newWorkId]
            .tokenURI = tokenURI;
        audioByWorkIdByProfileByNFTType[nftType][msg.sender][newWorkId]
            .supplyAmount = 0; 

        workCountByProfileByNFTType[nftType][msg.sender]++;
        emit AudioPosted(nftType, msg.sender, newWorkId, tokenCount);
        tokenCount++;
        return newWorkId;
    }

    function mint(
        NFTType nftType,
        uint256 workId,
        uint256 amount
    ) public {
        if (workId >= workCountByProfileByNFTType[nftType][msg.sender]) {
            revert MintWorkIdInvalid();
        }
        uint256 tokenId = audioByWorkIdByProfileByNFTType[nftType][msg.sender][
            workId
        ].tokenId;

        audioByWorkIdByProfileByNFTType[nftType][msg.sender][workId]
            .supplyAmount += amount;

        _mint(msg.sender, tokenId, amount, "");
        // setApprovalForAll( , true); // approve to market
        emit AudioMinted(nftType, msg.sender, workId, amount);
    }

    function mintBatch(
        NFTType[] memory types,
        uint256[] memory workIds,
        uint256[] memory amounts
    ) public {
        if (types.length != workIds.length || workIds.length != amounts.length) {
            revert MintBatchLengthInvalid();
        }
        uint256[] memory ids = new uint256[](workIds.length);
        for (uint256 i = 0; i < workIds.length; i++) {
            if (workIds[i] >= workCountByProfileByNFTType[types[i]][msg.sender]) {
                revert MintWorkIdInvalid();
            }
            ids[i] = audioByWorkIdByProfileByNFTType[types[i]][msg.sender][workIds[i]].tokenId;

            audioByWorkIdByProfileByNFTType[types[i]][msg.sender][workIds[i]]
                .supplyAmount += amounts[i];
        }
        _mintBatch(msg.sender, ids, amounts, "");
    }

    function _profileNFTExists(address profileAddress)
        internal
        view
        returns (bool)
    {
        if (profileAddress == address(0)) {
            revert ProfileAddressInvalid();
        }
        return
            CrypToneProfile(PROFILE_NFT_CONTRACT).profileExists(profileAddress);
    }
}
