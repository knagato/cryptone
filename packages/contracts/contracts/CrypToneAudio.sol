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

    mapping(address => mapping(uint256 => DataTypes.AudioStruct))
        internal audioByWorkIdByCreator;
    mapping(address => uint256) internal totalAudioSupplyByCreator;

    mapping(address => mapping(uint256 => DataTypes.InheritAudioStruct))
        internal inheritAudioByWorkIdByCreator;
    mapping(address => uint256) internal totalInheritAudioSupplyByCreator;

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

        uint256 newWorkId;
        if (nftType == DataTypes.NFTType.Audio) {
            newWorkId = totalAudioSupplyByCreator[msg.sender];
            audioByWorkIdByCreator[msg.sender][newWorkId].tokenId = totalSupply;
            audioByWorkIdByCreator[msg.sender][newWorkId].tokenURI = tokenURI;
            audioByWorkIdByCreator[msg.sender][newWorkId].maxSupply = 0;

            totalAudioSupplyByCreator[msg.sender]++;
            emit Events.AudioPosted(
                nftType,
                msg.sender,
                newWorkId,
                totalSupply
            );
        } else if (nftType == DataTypes.NFTType.InheritAudio) {
            newWorkId = totalInheritAudioSupplyByCreator[msg.sender];
            inheritAudioByWorkIdByCreator[msg.sender][newWorkId]
                .tokenId = totalSupply;
            inheritAudioByWorkIdByCreator[msg.sender][newWorkId] 
                .tokenURI = tokenURI;
            inheritAudioByWorkIdByCreator[msg.sender][newWorkId].maxSupply = 0;

            totalInheritAudioSupplyByCreator[msg.sender]++;
            emit Events.AudioPosted(
                nftType,
                msg.sender,
                newWorkId,
                totalSupply
            );
        } else {
            revert Errors.UnknownNFTType();
        }

        totalSupply++;
        return newWorkId;
    }

    function mint(
        DataTypes.NFTType nftType,
        uint256 workId,
        uint256 amount
    ) public {
        uint256 tokenId;
        if (nftType == DataTypes.NFTType.Audio) {
            if (workId >= totalAudioSupplyByCreator[msg.sender]) {
                revert Errors.MintWorkIdInvalid();
            }
            tokenId = audioByWorkIdByCreator[msg.sender][workId].tokenId;
            audioByWorkIdByCreator[msg.sender][workId].maxSupply += amount;
        } else if (nftType == DataTypes.NFTType.InheritAudio) {
            if (workId >= totalInheritAudioSupplyByCreator[msg.sender]) {
                revert Errors.MintWorkIdInvalid();
            }
            tokenId = inheritAudioByWorkIdByCreator[msg.sender][workId].tokenId;
            inheritAudioByWorkIdByCreator[msg.sender][workId]
                .maxSupply += amount;
        } else {
            revert Errors.UnknownNFTType();
        }

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
            if (types[i] == DataTypes.NFTType.Audio) {
                if (workIds[i] >= totalAudioSupplyByCreator[msg.sender]) {
                    revert Errors.MintWorkIdInvalid();
                }
                ids[i] = audioByWorkIdByCreator[msg.sender][workIds[i]].tokenId;

                audioByWorkIdByCreator[msg.sender][workIds[i]]
                    .maxSupply += amounts[i];
            } else if (types[i] == DataTypes.NFTType.InheritAudio) {
                if (
                    workIds[i] >= totalInheritAudioSupplyByCreator[msg.sender]
                ) {
                    revert Errors.MintWorkIdInvalid();
                }
                ids[i] = inheritAudioByWorkIdByCreator[msg.sender][workIds[i]]
                    .tokenId;

                inheritAudioByWorkIdByCreator[msg.sender][workIds[i]]
                    .maxSupply += amounts[i];
            } else {
                revert Errors.UnknownNFTType();
            }
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
