// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol"; 
import "@openzeppelin/contracts/access/Ownable.sol";
import "./audio-interfaces/AudioDefine.sol";
import "./audio-interfaces/TablelandManager.sol";

contract CrypToneAudio is ERC1155, Ownable, TablelandManager, AudioDefine {
    uint256 totalWorkCount = 0;

    // audio
    mapping(address => mapping(uint256 => AudioStruct))
        internal _audioByWorkIdByCreator;
    mapping(address => uint256) internal _totalAudioCountByCreator;

    // inherit
    mapping(address => mapping(uint256 => InheritStruct))
        internal _inheritByWorkIdByCreator;
    mapping(address => uint256) internal _totalInheritCountByCreator;

    // reference
    mapping(uint256 => RefStruct) internal _refByTokenId;

    // children
    mapping(uint256 => uint256[]) internal _childrenByTokenId;

    constructor(address tableRegistry, string memory chainName)
        ERC1155("")
        TablelandManager(tableRegistry, chainName)
    {
        super._setURI(super._getTemplateURI());
    }

    // postNewAudio
    function postNewAudio() public {
        _postNewAudio(msg.sender);
    }

    function postNewAudioOnlyOwner(address creatorAddress) public onlyOwner {
        _postNewAudio(creatorAddress);
    }

    // postNewInherit
    function postNewInherit(uint256 parentTokenId) public {
        _postNewInherit(msg.sender, parentTokenId);
    }

    function postNewInheritOnlyOwner(
        address creatorAddress,
        uint256 parentTokenId
    ) public onlyOwner {
        _postNewInherit(creatorAddress, parentTokenId);
    }

    // initMetadata
    function initMetadataFirstHalf(
        uint256 tokenId,
        uint256 generation,
        string calldata title,
        string calldata description
    ) public {
        if (_refByTokenId[tokenId].creatorAddress != msg.sender)
            revert NotTokenOwner();
        if (_checkMetadataFirstHalfInit(tokenId))
            revert ThisHalfAlreadyInitialized();

        super._initMetadataFirstHalf(tokenId, generation, title, description);
        _completeInitFirstHalfOfMetadata(tokenId);
    }

    /// use this after initMetadataFirstHalf
    function initMetadataSecondHalf(
        uint256 tokenId,
        string calldata encryptedAudioCID,
        string calldata encryptedSymmetricKey,
        string calldata previewAudioCID,
        string calldata jacketCID
    ) public {
        if (_refByTokenId[tokenId].creatorAddress != msg.sender)
            revert NotTokenOwner();
        if (_checkMetadataSecondHalfInit(tokenId))
            revert ThisHalfAlreadyInitialized();
        if (!_checkMetadataFirstHalfInit(tokenId))
            revert FirstHalfNotInitialized();

        super._initMetadataSecondHalf(
            tokenId,
            encryptedAudioCID,
            encryptedSymmetricKey,
            previewAudioCID,
            jacketCID
        );
        _completeInitSecondHalfOfMetadata(tokenId);
    }

    function initMetadataFirstHalfOnlyOwner(
        uint256 tokenId,
        uint256 generation,
        string calldata title,
        string calldata description
    ) public onlyOwner {
        if (_checkMetadataFirstHalfInit(tokenId))
            revert ThisHalfAlreadyInitialized();

        super._initMetadataFirstHalf(tokenId, generation, title, description);
        _completeInitFirstHalfOfMetadata(tokenId);
    }

    /// use this after initMetadataFirstHalf
    function initMetadataSecondHalfOnlyOwner(
        uint256 tokenId,
        string calldata encryptedAudioCID,
        string calldata encryptedSymmetricKey,
        string calldata previewAudioCID,
        string calldata jacketCID
    ) public onlyOwner {
        if (_checkMetadataSecondHalfInit(tokenId))
            revert ThisHalfAlreadyInitialized();
        if (!_checkMetadataFirstHalfInit(tokenId))
            revert FirstHalfNotInitialized();

        super._initMetadataSecondHalf(
            tokenId,
            encryptedAudioCID,
            encryptedSymmetricKey,
            previewAudioCID,
            jacketCID
        );
        _completeInitSecondHalfOfMetadata(tokenId);
    }

    // mint
    function mint(
        WorkType workType,
        uint256 workId,
        uint256 amount,
        uint256 salesPrice
    ) public {
        uint256 tokenId = _beforeMint(msg.sender, workType, workId, amount);
        super._updateTableOnMint(tokenId, salesPrice);
        _mint(msg.sender, tokenId, amount, "");
        // setApprovalForAll( , true); // approve to market
        emit AudioMinted(tokenId, amount, salesPrice);
    }

    function mintOnlyOwner(
        address creatorAddress,
        WorkType workType,
        uint256 workId,
        uint256 amount,
        uint256 salesPrice
    ) public onlyOwner {
        uint256 tokenId = _beforeMint(creatorAddress, workType, workId, amount);
        super._updateTableOnMint(tokenId, salesPrice);
        _mint(creatorAddress, tokenId, amount, "");
        // setApprovalForAll( , true); // approve to market
        emit AudioMinted(tokenId, amount, salesPrice);
    }

    // mintBatch
    function mintBatch(
        WorkType[] calldata types,
        uint256[] calldata workIds,
        uint256[] calldata amounts,
        uint256[] calldata salesPrices
    ) public {
        if (
            types.length != workIds.length ||
            workIds.length != amounts.length ||
            amounts.length != salesPrices.length
        ) {
            revert MintBatchLengthInvalid();
        }
        uint256[] memory tokenIds = _beforeMintBatch(
            msg.sender,
            types,
            workIds,
            amounts
        );
        super._updateTableOnMintBatch(tokenIds, salesPrices);
        _mintBatch(msg.sender, tokenIds, amounts, "");
        emit AudioBatchMinted(tokenIds, amounts, salesPrices);
    }

    function mintBatchOnlyOwner(
        address creatorAddress,
        WorkType[] calldata types,
        uint256[] calldata workIds,
        uint256[] calldata amounts,
        uint256[] calldata salesPrices
    ) public onlyOwner {
        uint256[] memory ids = _beforeMintBatch(
            creatorAddress,
            types,
            workIds,
            amounts
        );
        super._updateTableOnMintBatch(ids, salesPrices);
        _mintBatch(creatorAddress, ids, amounts, "");
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
        RefStruct memory ref = _refByTokenId[id];
        if (ref.workType == WorkType.Audio) {
            _audioByWorkIdByCreator[ref.creatorAddress][ref.workId]
                .totalSupply += amount;
        } else if (ref.workType == WorkType.Inherit) {
            _inheritByWorkIdByCreator[ref.creatorAddress][ref.workId]
                .totalSupply += amount;
        } else {
            revert UnknownWorkType();
        }
        _safeTransferFrom(from, to, id, amount, data);
    }

    // getter
    function getCreatorWorkCount(address creatorAddress, WorkType workType)
        public
        view
        returns (uint256 count)
    {
        if (workType == WorkType.Audio) {
            return _totalAudioCountByCreator[creatorAddress];
        } else if (workType == WorkType.Inherit) {
            return _totalInheritCountByCreator[creatorAddress];
        } else {
            revert UnknownWorkType();
        }
    }

    function getAudioData(address creatorAddress, uint256 workId)
        public
        view
        returns (AudioStruct memory)
    {
        return _audioByWorkIdByCreator[creatorAddress][workId];
    }

    function getInheritData(address creatorAddress, uint256 workId)
        public
        view
        returns (InheritStruct memory)
    {
        return _inheritByWorkIdByCreator[creatorAddress][workId];
    }

    function getReferenceToWork(uint256 tokenId)
        public
        view
        returns (RefStruct memory)
    {
        return _refByTokenId[tokenId];
    }

    function getChildren(uint256 tokenId)
        public
        view
        returns (uint256[] memory)
    {
        return _childrenByTokenId[tokenId];
    }

    /// ****************************
    /// *****PRIVATE FUNCTIONS*****
    /// ****************************

    // _postNewWork
    function _postNewAudio(address creatorAddress) private {
        // audio
        uint256 newWorkId = _totalAudioCountByCreator[creatorAddress];
        _audioByWorkIdByCreator[creatorAddress][newWorkId]
            .tokenId = totalWorkCount;

        _totalAudioCountByCreator[creatorAddress]++;

        _refByTokenId[totalWorkCount] = RefStruct(
            WorkType.Audio,
            creatorAddress,
            newWorkId,
            true
        );

        emit AudioCreated(totalWorkCount, creatorAddress, newWorkId, 0);
        totalWorkCount++;
    }

    function _postNewInherit(address creatorAddress, uint256 parentTokenId)
        private
    {
        // inherit audio
        uint256 newWorkId = _totalInheritCountByCreator[creatorAddress];
        _inheritByWorkIdByCreator[creatorAddress][newWorkId]
            .tokenId = totalWorkCount;

        RefStruct memory parentRef = _refByTokenId[parentTokenId];
        uint256 generation = _inheritByWorkIdByCreator[
            parentRef.creatorAddress
        ][parentRef.workId].generation + 1;
        _inheritByWorkIdByCreator[creatorAddress][newWorkId]
            .generation = generation;

        _childrenByTokenId[parentTokenId].push(totalWorkCount);

        _totalInheritCountByCreator[creatorAddress]++;

        _refByTokenId[totalWorkCount] = RefStruct(
            WorkType.Inherit,
            creatorAddress,
            newWorkId,
            true
        );

        emit AudioCreated(
            totalWorkCount,
            creatorAddress,
            newWorkId,
            generation
        );
        totalWorkCount++;
    }

    // initialize metadata
    function _checkMetadataFirstHalfInit(uint256 tokenId)
        private
        view
        returns (bool)
    {
        RefStruct memory ref = _refByTokenId[tokenId];
        if (ref.workType == WorkType.Audio) {
            return
                _audioByWorkIdByCreator[ref.creatorAddress][ref.workId]
                    .metadataFirstHalfInit;
        } else if (ref.workType == WorkType.Inherit) {
            return
                _inheritByWorkIdByCreator[ref.creatorAddress][ref.workId]
                    .metadataFirstHalfInit;
        } else {
            revert UnknownWorkType();
        }
    }

    function _checkMetadataSecondHalfInit(uint256 tokenId)
        private
        view
        returns (bool)
    {
        RefStruct memory ref = _refByTokenId[tokenId];
        if (ref.workType == WorkType.Audio) {
            return
                _audioByWorkIdByCreator[ref.creatorAddress][ref.workId]
                    .metadataSecondHalfInit;
        } else if (ref.workType == WorkType.Inherit) {
            return
                _inheritByWorkIdByCreator[ref.creatorAddress][ref.workId]
                    .metadataSecondHalfInit;
        } else {
            revert UnknownWorkType();
        }
    }

    function _completeInitFirstHalfOfMetadata(uint256 tokenId) private {
        RefStruct memory ref = _refByTokenId[tokenId];
        if (ref.workType == WorkType.Audio) {
            _audioByWorkIdByCreator[ref.creatorAddress][ref.workId]
                .metadataFirstHalfInit = true;
        } else if (ref.workType == WorkType.Inherit) {
            _inheritByWorkIdByCreator[ref.creatorAddress][ref.workId]
                .metadataFirstHalfInit = true;
        } else {
            revert UnknownWorkType();
        }
    }

    function _completeInitSecondHalfOfMetadata(uint256 tokenId) private {
        RefStruct memory ref = _refByTokenId[tokenId];
        if (ref.workType == WorkType.Audio) {
            _audioByWorkIdByCreator[ref.creatorAddress][ref.workId]
                .metadataSecondHalfInit = true;
        } else if (ref.workType == WorkType.Inherit) {
            _inheritByWorkIdByCreator[ref.creatorAddress][ref.workId]
                .metadataSecondHalfInit = true;
        } else {
            revert UnknownWorkType();
        }
    }

    // _beforeMint
    function _beforeMint(
        address creatorAddress,
        WorkType workType,
        uint256 workId,
        uint256 amount
    ) private returns (uint256 tokenId) {
        if (workType == WorkType.Audio) {
            tokenId = _beforeMintAudio(creatorAddress, workId, amount);
        } else if (workType == WorkType.Inherit) {
            tokenId = _beforeMintInherit(creatorAddress, workId, amount);
        } else {
            revert UnknownWorkType();
        }
        return tokenId;
    }

    function _beforeMintAudio(
        address creatorAddress,
        uint256 workId,
        uint256 amount
    ) private returns (uint256 tokenId) {
        if (workId >= _totalAudioCountByCreator[creatorAddress]) {
            revert MintWorkIdInvalid();
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
            revert MintWorkIdInvalid();
        }
        tokenId = _inheritByWorkIdByCreator[creatorAddress][workId].tokenId;
        _inheritByWorkIdByCreator[creatorAddress][workId].maxSupply += amount;
        return tokenId;
    }

    // _beforeMintBatch
    function _beforeMintBatch(
        address creatorAddress,
        WorkType[] calldata types,
        uint256[] calldata workIds,
        uint256[] calldata amounts
    ) private returns (uint256[] memory) {
        uint256[] memory ids = new uint256[](workIds.length);
        for (uint256 i = 0; i < workIds.length; i++) {
            if (types[i] == WorkType.Audio) {
                ids[i] = _beforeMintBatchAudio(
                    creatorAddress,
                    workIds[i],
                    amounts[i]
                );
            } else if (types[i] == WorkType.Inherit) {
                ids[i] = _beforeMintBatchInherit(
                    creatorAddress,
                    workIds[i],
                    amounts[i]
                );
            } else {
                revert UnknownWorkType();
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
            revert MintWorkIdInvalid();
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
            revert MintWorkIdInvalid();
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
        if (_refByTokenId[tokenId].workType == WorkType.Audio) {
            generation = 0;
        } else if (_refByTokenId[tokenId].workType == WorkType.Inherit) {
            generation = _inheritByWorkIdByCreator[
                _refByTokenId[tokenId].creatorAddress
            ][_refByTokenId[tokenId].workId].generation;
        } else {
            revert UnknownWorkType();
        }
        return generation;
    }
}
