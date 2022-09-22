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
    uint256 totalWorkCount = 0;
    // audio
    mapping(address => mapping(uint256 => DataTypes.AudioStruct))
        internal _audioByWorkIdByCreator;
    mapping(address => uint256) internal _totalAudioCountByCreator;
    // inherit
    mapping(address => mapping(uint256 => DataTypes.InheritStruct))
        internal _inheritByWorkIdByCreator;
    mapping(address => uint256) internal _totalInheritCountByCreator;
    // reference
    mapping(uint256 => DataTypes.RefStruct) internal _refByTokenId;

    constructor(address tableRegistry, string memory chainName)
        ERC1155("")
        TablelandManager(tableRegistry, chainName)
    {}

    // postNewWork
    function postNewWork(uint256 parentTokenId)
        public
        returns (uint256 newTokenId)
    {
        return _postNewWork(msg.sender, parentTokenId);
    }

    function postNewWorkOnlyOwner(address creatorAddress, uint256 parentTokenId)
        public
        onlyOwner
        returns (uint256 newTokenId)
    {
        return _postNewWork(creatorAddress, parentTokenId);
    }

    // setMetadata
    function setMetadata(
        uint256 tokenId,
        string calldata encryptedAudioCID,
        string calldata encryptedSymmetricKey,
        string calldata previewAudioCID,
        string calldata jacketCID
    ) public {
        if (_refByTokenId[tokenId].creatorAddress != msg.sender)
            revert Errors.NotTokenOwner();
        // TODO:if the record exist, use not UPDATE but INSERT
        super._insertNewWork(
            tokenId,
            _getGeneration(tokenId),
            encryptedAudioCID,
            encryptedSymmetricKey,
            previewAudioCID,
            jacketCID
        );
    }

    function setMetadataOnlyOwner(
        uint256 tokenId,
        string calldata encryptedAudioCID,
        string calldata encryptedSymmetricKey,
        string calldata previewAudioCID,
        string calldata jacketCID
    ) public onlyOwner {
        // TODO:if the record exist, use not UPDATE but INSERT
        super._insertNewWork(
            tokenId,
            _getGeneration(tokenId),
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
        uint256[] memory ids = _beforeMintBatch(
            msg.sender,
            types,
            workIds,
            amounts,
            salesPrices
        );
        _mintBatch(msg.sender, ids, amounts, "");
        super._updateTableOnMintBatch(ids, salesPrices);
    }

    function mintBatchOnlyOwner(
        address creatorAddress,
        DataTypes.NFTType[] calldata types,
        uint256[] calldata workIds,
        uint256[] calldata amounts,
        uint256[] calldata salesPrices
    ) public onlyOwner {
        uint256[] memory ids = _beforeMintBatch(
            creatorAddress,
            types,
            workIds,
            amounts,
            salesPrices
        );
        _mintBatch(creatorAddress, ids, amounts, "");
        super._updateTableOnMintBatch(ids, salesPrices);
    }

    // safeTransferFrom
    function safeTransferFrom(
        address from,
        address to,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public override {
        require(
            from == _msgSender() || isApprovedForAll(from, _msgSender()),
            "ERC1155: caller is not token owner nor approved"
        );
        _safeTransferFrom(from, to, id, amount, data);

        DataTypes.RefStruct memory ref = _refByTokenId[id];
        if (ref.nftType == DataTypes.NFTType.Audio) {
            _audioByWorkIdByCreator[ref.creatorAddress][ref.workId]
                .totalSupply += amount;
        } else if (ref.nftType == DataTypes.NFTType.Inherit) {
            _inheritByWorkIdByCreator[ref.creatorAddress][ref.workId]
                .totalSupply += amount;
        } else {
            revert Errors.UnknownNFTType();
        }
    }

    // getter
    function getCreatorWorkCount(
        address creatorAddress,
        DataTypes.NFTType nftType
    ) public view returns (uint256 count) {
        if (nftType == DataTypes.NFTType.Audio) {
            return _totalAudioCountByCreator[creatorAddress];
        } else if (nftType == DataTypes.NFTType.Inherit) {
            return _totalInheritCountByCreator[creatorAddress];
        } else {
            revert Errors.UnknownNFTType();
        }
    }

    function getAudioData(address creatorAddress, uint256 workId)
        public
        view
        returns (DataTypes.AudioStruct memory)
    {
        return _audioByWorkIdByCreator[creatorAddress][workId];
    }

    function getInheritData(address creatorAddress, uint256 workId)
        public
        view
        returns (DataTypes.InheritStruct memory)
    {
        return _inheritByWorkIdByCreator[creatorAddress][workId];
    }

    function getReferenceToWork(uint256 tokenId)
        public
        view
        returns (DataTypes.RefStruct memory)
    {
        return _refByTokenId[tokenId];
    }

    /// ****************************
    /// *****PRIVATE FUNCTIONS*****
    /// ****************************

    // _postNewWork
    function _postNewWork(address creatorAddress, uint256 parentTokenId)
        private
        returns (uint256 newTokenId)
    {
        DataTypes.RefStruct memory parentRef = _refByTokenId[parentTokenId];
        if (parentRef.exists) {
            _postNewInherit(creatorAddress, parentRef);
        } else {
            _postNewAudio(creatorAddress);
        }
        newTokenId = totalWorkCount;
        totalWorkCount++;
        return newTokenId;
    }

    function _postNewAudio(address creatorAddress) private {
        // audio
        uint256 newWorkId = _totalAudioCountByCreator[creatorAddress];
        _audioByWorkIdByCreator[creatorAddress][newWorkId]
            .tokenId = totalWorkCount;

        _totalAudioCountByCreator[creatorAddress]++;

        _refByTokenId[totalWorkCount] = DataTypes.RefStruct(
            DataTypes.NFTType.Audio,
            creatorAddress,
            newWorkId,
            true
        );

        emit Events.AudioCreated(totalWorkCount, creatorAddress, newWorkId, 0);
    }

    function _postNewInherit(
        address creatorAddress,
        DataTypes.RefStruct memory parentRef
    ) private {
        // inherit audio
        uint256 newWorkId = _totalInheritCountByCreator[creatorAddress];
        _inheritByWorkIdByCreator[creatorAddress][newWorkId]
            .tokenId = totalWorkCount;

        uint256 generation = _inheritByWorkIdByCreator[
            parentRef.creatorAddress
        ][parentRef.workId].generation + 1;
        _inheritByWorkIdByCreator[creatorAddress][newWorkId]
            .generation = generation;

        _totalInheritCountByCreator[creatorAddress]++;

        _refByTokenId[totalWorkCount] = DataTypes.RefStruct(
            DataTypes.NFTType.Inherit,
            creatorAddress,
            newWorkId,
            true
        );

        emit Events.AudioCreated(
            totalWorkCount,
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
        if (nftType == DataTypes.NFTType.Audio) {
            tokenId = _beforeMintAudio(creatorAddress, workId, amount);
        } else if (nftType == DataTypes.NFTType.Inherit) {
            tokenId = _beforeMintInherit(creatorAddress, workId, amount);
        } else {
            revert Errors.UnknownNFTType();
        }

        _mint(creatorAddress, tokenId, amount, "");
        // setApprovalForAll( , true); // approve to market

        super._updateTableOnMint(tokenId, salesPrice);

        emit Events.AudioMinted(nftType, creatorAddress, workId, amount);
    }

    function _beforeMintAudio(
        address creatorAddress,
        uint256 workId,
        uint256 amount
    ) private returns (uint256 tokenId) {
        if (workId >= _totalAudioCountByCreator[creatorAddress]) {
            revert Errors.MintWorkIdInvalid();
        }
        tokenId = _audioByWorkIdByCreator[creatorAddress][workId].tokenId;
        _audioByWorkIdByCreator[creatorAddress][workId].maxSupply += amount;
        return tokenId;
    }

    function _beforeMintInherit(
        address creatorAddress,
        uint256 workId,
        uint256 amount
    ) private returns (uint256 tokenId) {
        if (workId >= _totalInheritCountByCreator[creatorAddress]) {
            revert Errors.MintWorkIdInvalid();
        }
        tokenId = _inheritByWorkIdByCreator[creatorAddress][workId].tokenId;
        _inheritByWorkIdByCreator[creatorAddress][workId].maxSupply += amount;
        return tokenId;
    }

    // _beforeMintBatch
    function _beforeMintBatch(
        address creatorAddress,
        DataTypes.NFTType[] calldata types,
        uint256[] calldata workIds,
        uint256[] calldata amounts,
        uint256[] calldata salesPrices
    ) private returns (uint256[] memory) {
        if (
            types.length != workIds.length || workIds.length != amounts.length
        ) {
            revert Errors.MintBatchLengthInvalid();
        }
        uint256[] memory ids = new uint256[](workIds.length);
        for (uint256 i = 0; i < workIds.length; i++) {
            if (types[i] == DataTypes.NFTType.Audio) {
                ids[i] = _beforeMintBatchAudio(
                    creatorAddress,
                    workIds[i],
                    amounts[i]
                );
            } else if (types[i] == DataTypes.NFTType.Inherit) {
                ids[i] = _beforeMintBatchInherit(
                    creatorAddress,
                    workIds[i],
                    amounts[i]
                );
            } else {
                revert Errors.UnknownNFTType();
            }
        }
        return ids;
    }

    function _beforeMintBatchAudio(
        address creatorAddress,
        uint256 workId,
        uint256 amount
    ) private returns (uint256 tokenId) {
        if (workId >= _totalAudioCountByCreator[creatorAddress]) {
            revert Errors.MintWorkIdInvalid();
        }
        tokenId = _audioByWorkIdByCreator[creatorAddress][workId].tokenId;
        _audioByWorkIdByCreator[creatorAddress][workId].maxSupply += amount;
        return tokenId;
    }

    function _beforeMintBatchInherit(
        address creatorAddress,
        uint256 workId,
        uint256 amount
    ) private returns (uint256 tokenId) {
        if (workId >= _totalInheritCountByCreator[creatorAddress]) {
            revert Errors.MintWorkIdInvalid();
        }
        tokenId = _inheritByWorkIdByCreator[creatorAddress][workId].tokenId;
        _inheritByWorkIdByCreator[creatorAddress][workId].maxSupply += amount;
        return tokenId;
    }

    function _getGeneration(uint256 tokenId)
        private
        view
        returns (uint256 generation)
    {
        if (_refByTokenId[tokenId].nftType == DataTypes.NFTType.Audio) {
            generation = 0;
        } else if (
            _refByTokenId[tokenId].nftType == DataTypes.NFTType.Inherit
        ) {
            generation = _inheritByWorkIdByCreator[
                _refByTokenId[tokenId].creatorAddress
            ][_refByTokenId[tokenId].workId].generation;
        } else {
            revert Errors.UnknownNFTType();
        }
        return generation;
    }
}
