// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

import "../node_modules/@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "./audio-libs/DataTypes.sol";
import "./audio-libs/Events.sol";
import "./audio-libs/Errors.sol";
import "./audio-libs/TablelandManager.sol";
import {CrypToneProfile} from "./CrypToneProfile.sol";

contract CrypToneAudio is ERC1155, Ownable, TablelandManager {
    address internal profileContract;

    uint256 totalSupply = 0;

    mapping(address => mapping(uint256 => DataTypes.AudioStruct))
        internal audioByWorkIdByCreator;
    mapping(address => uint256) internal totalAudioSupplyByCreator;

    mapping(address => mapping(uint256 => DataTypes.InheritStruct))
        internal inheritByWorkIdByCreator;
    mapping(address => uint256) internal totalInheritSupplyByCreator;

    mapping(uint256 => DataTypes.RefStruct) internal refByTokenId;

    constructor(
        address _profileContract,
        address tableRegistry,
        string memory chainName
    ) ERC1155("") TablelandManager(tableRegistry, chainName) {
        if (_profileContract == address(0)) {
            revert Errors.InitParamsInvalid();
        }
        profileContract = _profileContract;
    }

    function setProfileNFTContract(address newContract) external onlyOwner {
        profileContract = newContract;
        emit Events.ProfileContractChanged(newContract);
    }

    // postNewWork
    function postNewWork(uint256 parentTokenId) public returns (uint256) {
        return _postNewWork(msg.sender, parentTokenId);
    }

    function postNewWorkOnlyOwner(address creatorAddress, uint256 parentTokenId)
        public
        onlyOwner
        returns (uint256)
    {
        return _postNewWork(creatorAddress, parentTokenId);
    }

    // setMetadata
    function setMetadata(
        uint256 tokenId,
        uint256 generation,
        string calldata encryptedAudioCID,
        string calldata encryptedSymmetricKey,
        string calldata previewAudioCID,
        string calldata jacketCID
    ) public {
        if (refByTokenId[tokenId].creatorAddress != msg.sender)
            revert Errors.NotTokenOwner();

        super._insertNewWork(
            tokenId,
            generation,
            encryptedAudioCID,
            encryptedSymmetricKey,
            previewAudioCID,
            jacketCID
        );
    }

    function setMetadataOnlyOwner(
        uint256 tokenId,
        uint256 generation,
        string calldata encryptedAudioCID,
        string calldata encryptedSymmetricKey,
        string calldata previewAudioCID,
        string calldata jacketCID
    ) public onlyOwner {
        super._insertNewWork(
            tokenId,
            generation,
            encryptedAudioCID,
            encryptedSymmetricKey,
            previewAudioCID,
            jacketCID
        );
    }

    // mint
    function mint(
        DataTypes.NFTType nftType,
        uint256 workId,
        uint256 amount,
        uint256 salesPrice
    ) public {
        _beforeMint(msg.sender, nftType, workId, amount, salesPrice);
    }

    function mintOnlyOwner(
        address creatorAddress,
        DataTypes.NFTType nftType,
        uint256 workId,
        uint256 amount,
        uint256 salesPrice
    ) public onlyOwner {
        _beforeMint(creatorAddress, nftType, workId, amount, salesPrice);
    }

    // mintBatch
    function mintBatch(
        DataTypes.NFTType[] calldata types,
        uint256[] calldata workIds,
        uint256[] calldata amounts,
        uint256[] calldata salesPrices
    ) public {
        _beforeMintBatch(msg.sender, types, workIds, amounts, salesPrices);
    }

    function mintBatchOnlyOwner(
        address creatorAddress,
        DataTypes.NFTType[] calldata types,
        uint256[] calldata workIds,
        uint256[] calldata amounts,
        uint256[] calldata salesPrices
    ) public onlyOwner {
        _beforeMintBatch(creatorAddress, types, workIds, amounts, salesPrices);
    }

    /// ****************************
    /// *****PRIVATE FUNCTIONS*****
    /// ****************************

    // _postNewWork
    function _postNewWork(address creatorAddress, uint256 parentTokenId)
        private
        returns (uint256 newTokenId)
    {
        if (!_profileNFTExists(creatorAddress)) {
            revert Errors.ProfileNFTNotFound();
        }

        DataTypes.RefStruct memory parentRef = refByTokenId[parentTokenId];
        if (parentRef.exists) {
            _postNewInherit(creatorAddress, parentRef);
        } else {
            _postNewAudio(creatorAddress);
        }
        newTokenId = totalSupply;
        totalSupply++;
        return newTokenId;
    }

    function _postNewAudio(address creatorAddress) private {
        // audio
        uint256 newWorkId = totalAudioSupplyByCreator[creatorAddress];
        audioByWorkIdByCreator[creatorAddress][newWorkId].tokenId = totalSupply;

        uint256 generation = 0;
        audioByWorkIdByCreator[creatorAddress][newWorkId]
            .generation = generation;

        totalAudioSupplyByCreator[creatorAddress]++;

        refByTokenId[totalSupply] = DataTypes.RefStruct(
            DataTypes.NFTType.Audio,
            creatorAddress,
            newWorkId,
            true
        );

        emit Events.AudioCreated(
            totalSupply,
            creatorAddress,
            newWorkId,
            generation
        );
    }

    function _postNewInherit(
        address creatorAddress,
        DataTypes.RefStruct memory parentRef
    ) private {
        // inherit audio
        uint256 newWorkId = totalInheritSupplyByCreator[creatorAddress];
        inheritByWorkIdByCreator[creatorAddress][newWorkId]
            .tokenId = totalSupply;

        uint256 generation = inheritByWorkIdByCreator[parentRef.creatorAddress][
            parentRef.workId
        ].generation + 1;
        inheritByWorkIdByCreator[creatorAddress][newWorkId]
            .generation = generation;

        totalInheritSupplyByCreator[creatorAddress]++;

        refByTokenId[totalSupply] = DataTypes.RefStruct(
            DataTypes.NFTType.Inherit,
            creatorAddress,
            newWorkId,
            true
        );

        emit Events.AudioCreated(
            totalSupply,
            creatorAddress,
            newWorkId,
            generation
        );
    }

    // _beforeMint
    function _beforeMint(
        address creatorAddress,
        DataTypes.NFTType nftType,
        uint256 workId,
        uint256 amount,
        uint256 salesPrice
    ) private {
        uint256 tokenId;
        uint256 maxSupply;
        if (nftType == DataTypes.NFTType.Audio) {
            (tokenId, maxSupply) = _beforeMintAudio(
                creatorAddress,
                workId,
                amount
            );
        } else if (nftType == DataTypes.NFTType.Inherit) {
            (tokenId, maxSupply) = _beforeMintInherit(
                creatorAddress,
                workId,
                amount
            );
        } else {
            revert Errors.UnknownNFTType();
        }

        _mint(creatorAddress, tokenId, amount, "");
        // setApprovalForAll( , true); // approve to market

        super._updateTableOnMint(tokenId, maxSupply, salesPrice);

        emit Events.AudioMinted(nftType, creatorAddress, workId, amount);
    }

    function _beforeMintAudio(
        address creatorAddress,
        uint256 workId,
        uint256 amount
    ) private returns (uint256 tokenId, uint256 maxSupply) {
        if (workId >= totalAudioSupplyByCreator[creatorAddress]) {
            revert Errors.MintWorkIdInvalid();
        }
        tokenId = audioByWorkIdByCreator[creatorAddress][workId].tokenId;
        audioByWorkIdByCreator[creatorAddress][workId].maxSupply += amount;
        // for tableland
        maxSupply = audioByWorkIdByCreator[creatorAddress][workId].maxSupply;
        return (tokenId, maxSupply);
    }

    function _beforeMintInherit(
        address creatorAddress,
        uint256 workId,
        uint256 amount
    ) private returns (uint256 tokenId, uint256 maxSupply) {
        if (workId >= totalInheritSupplyByCreator[creatorAddress]) {
            revert Errors.MintWorkIdInvalid();
        }
        tokenId = inheritByWorkIdByCreator[creatorAddress][workId].tokenId;
        inheritByWorkIdByCreator[creatorAddress][workId].maxSupply += amount;
        // for tableland
        maxSupply = inheritByWorkIdByCreator[creatorAddress][workId].maxSupply;
        return (tokenId, maxSupply);
    }

    // _beforeMintBatch
    function _beforeMintBatch(
        address creatorAddress,
        DataTypes.NFTType[] calldata types,
        uint256[] calldata workIds,
        uint256[] calldata amounts,
        uint256[] calldata salesPrices
    ) private {
        if (
            types.length != workIds.length || workIds.length != amounts.length
        ) {
            revert Errors.MintBatchLengthInvalid();
        }
        uint256[] memory ids = new uint256[](workIds.length);
        uint256[] memory maxSupplies = new uint256[](workIds.length);
        for (uint256 i = 0; i < workIds.length; i++) {
            if (types[i] == DataTypes.NFTType.Audio) {
                (ids[i], maxSupplies[i]) = _beforeMintBatchAudio(
                    creatorAddress,
                    workIds[i],
                    amounts[i]
                );
            } else if (types[i] == DataTypes.NFTType.Inherit) {
                (ids[i], maxSupplies[i]) = _beforeMintBatchInherit(
                    creatorAddress,
                    workIds[i],
                    amounts[i]
                );
            } else {
                revert Errors.UnknownNFTType();
            }
        }
        _mintBatch(creatorAddress, ids, amounts, "");

        super._updateTableOnMintBatch(ids, maxSupplies, salesPrices);
    }

    function _beforeMintBatchAudio(
        address creatorAddress,
        uint256 workId,
        uint256 amount
    ) private returns (uint256 tokenId, uint256 maxSupply) {
        if (workId >= totalAudioSupplyByCreator[creatorAddress]) {
            revert Errors.MintWorkIdInvalid();
        }
        tokenId = audioByWorkIdByCreator[creatorAddress][workId].tokenId;
        audioByWorkIdByCreator[creatorAddress][workId].maxSupply += amount;
        // for tableland
        maxSupply = audioByWorkIdByCreator[creatorAddress][workId].maxSupply;
        return (tokenId, maxSupply);
    }

    function _beforeMintBatchInherit(
        address creatorAddress,
        uint256 workId,
        uint256 amount
    ) private returns (uint256 tokenId, uint256 maxSupply) {
        if (workId >= totalInheritSupplyByCreator[creatorAddress]) {
            revert Errors.MintWorkIdInvalid();
        }
        tokenId = inheritByWorkIdByCreator[creatorAddress][workId].tokenId;
        inheritByWorkIdByCreator[creatorAddress][workId].maxSupply += amount;
        // for tableland
        maxSupply = inheritByWorkIdByCreator[creatorAddress][workId].maxSupply;
        return (tokenId, maxSupply);
    }

    function _profileNFTExists(address profileAddress)
        internal
        view
        returns (bool)
    {
        if (profileAddress == address(0)) {
            revert Errors.ProfileAddressInvalid();
        }
        return CrypToneProfile(profileContract).profileExists(profileAddress);
    }
}
