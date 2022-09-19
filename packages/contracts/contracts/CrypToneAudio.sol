// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

import "../../../node_modules/@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
// import "../../../node_modules/@openzeppelin/contracts/token/ERC1155/extensions/ERC1155URIStorage.sol";
// import "../../../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "./CrypToneProfile.sol";

// contract CrypToneAudio is ERC1155URIStorage {
contract CrypToneAudio {
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

    // mapping(uint256 => mapping(uint256 => uint256))
    //     internal inheritAudioNFTByWorkIdByProfile;
    // mapping(uint256 => uint256) internal inheritAudioCountByProfile;

    error InitParamsInvalid();
    error ProfileNFTNotFound();
    error ProfileIdInvalid();
    error MintWorkIdInvalid();
    error ProfileAddressInvalid();

    constructor(address profileNFTContract) ERC1155("") {
        // constructor() ERC1155("") {
        if (profileNFTContract == address(0)) revert InitParamsInvalid();
        PROFILE_NFT_CONTRACT = profileNFTContract;
    }

    // tokenURI is expected IPFS CID
    function postWork(NFTType nftType, string memory tokenURI) internal {
        // TODO:if caller profileNFT does not exist, this function revert.
        if (!_profileNFTExists(msg.sender)) revert ProfileNFTNotFound();
        // if (nftType == NFTType.Audio) {
        uint256 newWorkId = audioCountByProfileByNFTType[nftType][msg.sender];

        audioByWorkIdByProfileByNFTType[nftType][msg.sender][newWorkId]
            .tokenId = tokenCount;
        audioByWorkIdByProfileByNFTType[nftType][msg.sender][newWorkId]
            .tokenURI = tokenURI;

        audioCountByProfileByNFTType[nftType][msg.sender]++;
        // } else if (nftType == NFTType.InheritAudio) {
        //     uint256 newWorkId = inheritAudioCountByProfile[msg.sender];
        //     inheritAudioNFTByWorkIdByProfile[msg.sender][newWorkId];
        //     inheritAudioCountByProfile[msg.sender]++;
        // }
        // _setURI(tokenCount, tokenURI);
        tokenCount++;
    }

    function mint(
        NFTType nftType,
        uint256 workId,
        uint256 amount
    ) public {
        // if (!_checkProfileId(msg.sender, profileId)) revert ProfileIdInvalid();
        if (workId >= audioCountByProfileByNFTType[msg.sender][nftType])
            revert MintWorkIdInvalid();

        uint256 tokenId = audioByWorkIdByProfileByNFTType[msg.sender][nftType][
            workId
        ];
        // if (nftType == NFTType.Audio) {
        //     tokenId = audioNFTByWorkIdByProfile[msg.sender][workId];
        // } else if (nftType == NFTType.InheritAudio) {
        //     tokenId = inheritAudioNFTByWorkIdByProfile[msg.sender][workId];
        // }

        _mint(msg.sender, tokenId, amount, "");
        // setApprovalForAll( , true); // approve to market
    }

    function _profileNFTExists(address profileAddress)
        internal
        pure
        returns (bool)
    {
        if (profileAddress == address(0)) revert ProfileAddressInvalid();

        return
            CrypToneProfile(PROFILE_NFT_CONTRACT).profileExists(profileAddress);
        // return profileId == fetchedId;
    }
}
