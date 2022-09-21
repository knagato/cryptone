// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

import "../node_modules/@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "../node_modules/@openzeppelin/contracts/utils/Strings.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../node_modules/@tableland/evm/contracts/ITablelandTables.sol";
import "./audio-libs/DataTypes.sol";
import "./audio-libs/Events.sol";
import "./audio-libs/Errors.sol";
import {CrypToneProfile} from "./CrypToneProfile.sol";

contract CrypToneAudio is ERC1155, Ownable {
    address internal profileContract;

    uint256 totalSupply = 0;

    mapping(address => mapping(uint256 => DataTypes.AudioStruct))
        internal audioByWorkIdByCreator;
    mapping(address => uint256) internal totalAudioSupplyByCreator;

    mapping(address => mapping(uint256 => DataTypes.InheritStruct))
        internal inheritByWorkIdByCreator;
    mapping(address => uint256) internal totalInheritSupplyByCreator;

    mapping(uint256 => DataTypes.RefStruct) internal refByTokenId;

    // Tableland
    string private _baseURIString =
        "https://testnet.tableland.network/query?s=";
    ITablelandTables private _tableland;
    string private _metadataTable;
    uint256 private _metadataTableId;
    string private _tablePrefix = "canvas";
    string private _chainName; // e.g. polygon-mumbai

    constructor(
        address _profileContract,
        address tableRegistry,
        string memory chainName
    ) ERC1155("") {
        if (_profileContract == address(0)) {
            revert Errors.InitParamsInvalid();
        }
        profileContract = _profileContract;
        _initTableland(tableRegistry, chainName);
    }

    function setProfileNFTContract(address newContract) external onlyOwner {
        profileContract = newContract;
        emit Events.ProfileContractChanged(newContract);
    }

    // createWork
    function createWork(uint256 parentTokenId) public returns (uint256) {
        return _createWork(msg.sender, parentTokenId);
    }

    function createWorkOnlyOwner(address creatorAddress, uint256 parentTokenId)
        public
        onlyOwner
        returns (uint256)
    {
        return _createWork(creatorAddress, parentTokenId);
    }

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

        _insertNewWork(
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
        _insertNewWork(
            tokenId,
            generation,
            encryptedAudioCID,
            encryptedSymmetricKey,
            previewAudioCID,
            jacketCID
        );
    }

    // mint
    // maybe, an argument 'tokenId' will be enough to refer to an audio data
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

    function _createWork(address creatorAddress, uint256 parentTokenId)
        private
        returns (uint256 newTokenId)
    {
        if (!_profileNFTExists(creatorAddress)) {
            revert Errors.ProfileNFTNotFound();
        }

        DataTypes.RefStruct memory parentRef = refByTokenId[parentTokenId];
        if (parentRef.exists) {
            _createInherit(creatorAddress, parentRef);
        } else {
            _createAudio(creatorAddress);
        }
        newTokenId = totalSupply;
        totalSupply++;
        return newTokenId;
    }

    function _createAudio(address creatorAddress) private {
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

    function _createInherit(
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

        _updateTableOnMint(tokenId, maxSupply, salesPrice);

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

        _updateTableOnMintBatch(ids, maxSupplies, salesPrices);
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

    /// ****************************
    /// *****TABLELAND FUNCTIONS*****
    /// ****************************

    function _initTableland(address tableRegistry, string memory chainName)
        private
    {
        _chainName = chainName;
        _tableland = ITablelandTables(tableRegistry);
        _metadataTableId = _tableland.createTable(
            address(this),
            string.concat(
                "CREATE TABLE ",
                _tablePrefix,
                "_",
                Strings.toString(block.chainid),
                "(chain text, contractAddress text, tokenId text, ",
                "maxSupply text, salesPrice text, totalSupply text, ",
                "generation int, encryptedAudioCID text, ",
                "encryptedSymmetricKey text, previewAudioCID text, jacketCID text);"
            )
        );

        _metadataTable = string.concat(
            _tablePrefix,
            "_",
            Strings.toString(block.chainid),
            "_",
            Strings.toString(_metadataTableId)
        );
    }

    function _insertNewWork(
        uint256 tokenId,
        uint256 generation,
        string calldata encryptedAudioCID,
        string calldata encryptedSymmetricKey,
        string calldata previewAudioCID,
        string calldata jacketCID
    ) private {
        // too long concat makes the hardhat compile faiied.
        string memory query = string.concat(
            "INSERT INTO ",
            _metadataTable,
            // " (chain, contractAddress, tokenId, ", // polygon-mumbai
            // "maxSupply, salesPrice, totalSupply, ",
            // "generation, encryptedAudioCID, ",
            // "encryptedSymmetricKey, previewAudioCID, jacketCID)",
            " VALUES ('",
            _chainName,
            "','",
            Strings.toHexString(address(this)),
            "','"
        );
        query = string.concat(
            query,
            Strings.toString(tokenId),
            "','0','0','0',",
            Strings.toString(generation), // generation
            ",'",
            encryptedAudioCID,
            "','"
        );
        query = string.concat(
            query,
            encryptedSymmetricKey,
            "','",
            previewAudioCID,
            "','",
            jacketCID,
            "');"
        );
        _tableland.runSQL(address(this), _metadataTableId, query);
    }

    function _updateTableOnMint(
        uint256 tokenId,
        uint256 maxSupply,
        uint256 salesPrice
    ) private {
        _tableland.runSQL(
            address(this),
            _metadataTableId,
            string.concat(
                "UPDATE ",
                _metadataTable,
                " SET maxSupply = '",
                Strings.toString(maxSupply),
                "', salesPrice = '",
                Strings.toString(salesPrice),
                "' WHERE tokenId = '",
                Strings.toString(tokenId),
                "';"
            )
        );
    }

    function _updateTableOnMintBatch(
        uint256[] memory tokenIds,
        uint256[] memory maxSupplies,
        uint256[] memory salesPrices
    ) private {
        string memory suppliesPhrase = "";
        string memory pricesPhrase = "";
        string memory idPhrase = "";
        for (uint256 i = 0; i < tokenIds.length; i++) {
            suppliesPhrase = string.concat(
                suppliesPhrase,
                "WHEN'",
                Strings.toString(tokenIds[i]),
                "'THEN'",
                Strings.toString(maxSupplies[i]),
                "'"
            );
            pricesPhrase = string.concat(
                pricesPhrase,
                "WHEN'",
                Strings.toString(tokenIds[i]),
                "'THEN'",
                Strings.toString(salesPrices[i]),
                "'"
            );
            idPhrase = string.concat(
                idPhrase,
                "'",
                Strings.toString(tokenIds[i]),
                "'"
            );
            // Query size is limited to a maximum of 35kb.
            uint256 strLength = bytes(suppliesPhrase).length +
                bytes(pricesPhrase).length +
                bytes(idPhrase).length;
            if (strLength > 34500) {
                // devide query
                _runUpdateTableOnMintBatch(
                    suppliesPhrase,
                    pricesPhrase,
                    idPhrase
                );
                suppliesPhrase = "";
                pricesPhrase = "";
                idPhrase = "";
            } else if (i < tokenIds.length - 1) {
                idPhrase = string.concat(idPhrase, ",");
            }
        }
        _runUpdateTableOnMintBatch(suppliesPhrase, pricesPhrase, idPhrase);
    }

    function _runUpdateTableOnMintBatch(
        string memory suppliesPhrase,
        string memory pricesPhrase,
        string memory idPhrase
    ) private {
        _tableland.runSQL(
            address(this),
            _metadataTableId,
            string.concat(
                "UPDATE ",
                _metadataTable,
                " SET maxSupply=CASE tokenId ",
                suppliesPhrase,
                "END,salesPrice=CASE tokenId ",
                pricesPhrase,
                "END WHERE tokenId IN(",
                idPhrase,
                ");"
            )
        );
    }
}
