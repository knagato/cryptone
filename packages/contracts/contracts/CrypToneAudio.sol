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
    }
    uint256 tokenCount = 0;

    mapping(NFTType => mapping(address => mapping(uint256 => AudioStruct)))
        internal audioByWorkIdByProfileByNFTType;
    mapping(NFTType => mapping(address => uint256))
        internal audioCountByProfileByNFTType;

    error InitParamsInvalid();
    error ProfileNFTNotFound();
    error ProfileIdInvalid();
    error MintWorkIdInvalid();
    error ProfileAddressInvalid();

    constructor(address profileNFTContract) ERC1155("") {
        if (profileNFTContract == address(0)) {
            revert InitParamsInvalid();
        }
        PROFILE_NFT_CONTRACT = profileNFTContract;
    }

    // tokenURI is expected IPFS CID
    function postWork(NFTType nftType, string memory tokenURI) internal {
        if (!_profileNFTExists(msg.sender)) {
            revert ProfileNFTNotFound();
        }
        uint256 newWorkId = audioCountByProfileByNFTType[nftType][msg.sender];
        audioByWorkIdByProfileByNFTType[nftType][msg.sender][newWorkId]
            .tokenId = tokenCount;
        audioByWorkIdByProfileByNFTType[nftType][msg.sender][newWorkId]
            .tokenURI = tokenURI;

        audioCountByProfileByNFTType[nftType][msg.sender]++;
        tokenCount++;
    }

    function mint(
        NFTType nftType,
        uint256 workId,
        uint256 amount
    ) public {
        if (workId >= audioCountByProfileByNFTType[nftType][msg.sender]) {
            revert MintWorkIdInvalid();
        }
        uint256 tokenId = audioByWorkIdByProfileByNFTType[nftType][msg.sender][
            workId
        ].tokenId;
        _mint(msg.sender, tokenId, amount, "");
        // setApprovalForAll( , true); // approve to market
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
