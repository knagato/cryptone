// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

import "../node_modules/@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "./audio-libs/DataTypes.sol";
import "./audio-libs/Events.sol";
import "./audio-libs/Errors.sol";
import {CrypToneProfile} from "./CrypToneProfile.sol";

contract CrypToneAudio is ERC1155 {
    address internal immutable PROFILE_NFT_CONTRACT;

    uint256 totalSupply = 0;

    mapping(DataTypes.NFTType => mapping(address => mapping(uint256 => DataTypes.AudioStruct)))
        internal audioByWorkIdByProfileByNFTType;
    mapping(DataTypes.NFTType => mapping(address => uint256))
        internal workCountByProfileByNFTType;

    constructor(address profileNFTContract) ERC1155("") {
        if (profileNFTContract == address(0)) {
            revert Errors.InitParamsInvalid();
        }
        PROFILE_NFT_CONTRACT = profileNFTContract;
    }

    // tokenURI is expected IPFS CID
    function postWork(DataTypes.NFTType nftType, string memory tokenURI)
        external
        returns (uint256)
    {
        if (!_profileNFTExists(msg.sender)) {
            revert Errors.ProfileNFTNotFound();
        }
        uint256 newWorkId = workCountByProfileByNFTType[nftType][msg.sender];
        audioByWorkIdByProfileByNFTType[nftType][msg.sender][newWorkId]
            .tokenId = totalSupply;
        audioByWorkIdByProfileByNFTType[nftType][msg.sender][newWorkId]
            .tokenURI = tokenURI;
        audioByWorkIdByProfileByNFTType[nftType][msg.sender][newWorkId]
            .totalSupply = 0;

        workCountByProfileByNFTType[nftType][msg.sender]++;
        emit Events.AudioPosted(nftType, msg.sender, newWorkId, totalSupply);
        totalSupply++;
        return newWorkId;
    }

    function mint(
        DataTypes.NFTType nftType,
        uint256 workId,
        uint256 amount
    ) public {
        if (workId >= workCountByProfileByNFTType[nftType][msg.sender]) {
            revert Errors.MintWorkIdInvalid();
        }
        uint256 tokenId = audioByWorkIdByProfileByNFTType[nftType][msg.sender][
            workId
        ].tokenId;

        audioByWorkIdByProfileByNFTType[nftType][msg.sender][workId]
            .totalSupply += amount;

        _mint(msg.sender, tokenId, amount, "");
        // setApprovalForAll( , true); // approve to market
        emit Events.AudioMinted(nftType, msg.sender, workId, amount);
    }

    function mintBatch(
        DataTypes.NFTType[] memory types,
        uint256[] memory workIds,
        uint256[] memory amounts
    ) public {
        if (
            types.length != workIds.length || workIds.length != amounts.length
        ) {
            revert Errors.MintBatchLengthInvalid();
        }
        uint256[] memory ids = new uint256[](workIds.length);
        for (uint256 i = 0; i < workIds.length; i++) {
            if (
                workIds[i] >= workCountByProfileByNFTType[types[i]][msg.sender]
            ) {
                revert Errors.MintWorkIdInvalid();
            }
            ids[i] = audioByWorkIdByProfileByNFTType[types[i]][msg.sender][
                workIds[i]
            ].tokenId;

            audioByWorkIdByProfileByNFTType[types[i]][msg.sender][workIds[i]]
                .totalSupply += amounts[i];
        }
        _mintBatch(msg.sender, ids, amounts, "");
    }

    function _profileNFTExists(address profileAddress)
        internal
        view
        returns (bool)
    {
        if (profileAddress == address(0)) {
            revert Errors.ProfileAddressInvalid();
        }
        return
            CrypToneProfile(PROFILE_NFT_CONTRACT).profileExists(profileAddress);
    }
}
