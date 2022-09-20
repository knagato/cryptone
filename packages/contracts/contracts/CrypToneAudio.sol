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

    mapping(address => mapping(uint256 => DataTypes.InheritAudioStruct))
        internal inheritAudioByWorkIdByCreator;
    mapping(address => uint256) internal totalInheritAudioSupplyByCreator;

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

    // postWork
    function postWork(
        uint256 parentTokenId,
        string calldata encryptedAudioCID,
        string calldata encryptedSymmetricKey,
        string calldata previewAudioCID,
        string calldata jacketCID
    ) public returns (uint256) {
        return
            _postWork(
                msg.sender,
                parentTokenId,
                encryptedAudioCID,
                encryptedSymmetricKey,
                previewAudioCID,
                jacketCID
            );
    }

    function postWorkOnlyOwner(
        address creatorAddress,
        uint256 parentTokenId,
        string calldata encryptedAudioCID,
        string calldata encryptedSymmetricKey,
        string calldata previewAudioCID,
        string calldata jacketCID
    ) public onlyOwner returns (uint256) {
        return
            _postWork(
                creatorAddress,
                parentTokenId,
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

    function _postWork(
        address creatorAddress,
        uint256 parentTokenId,
        string calldata encryptedAudioCID,
        string calldata encryptedSymmetricKey,
        string calldata previewAudioCID,
        string calldata jacketCID
    ) private returns (uint256) {
        if (!_profileNFTExists(creatorAddress)) {
            revert Errors.ProfileNFTNotFound();
        }

        uint256 newWorkId;
        uint256 generation;
        DataTypes.NFTType nftType;

        DataTypes.RefStruct memory parentRef = refByTokenId[parentTokenId];
        if (!parentRef.exists) {
            (newWorkId, generation, nftType) = _audioPost(creatorAddress);
        } else {
            (newWorkId, generation, nftType, parentRef) = _inheritAudioPost(
                creatorAddress
            );
        }

        refByTokenId[totalSupply] = DataTypes.RefStruct(
            creatorAddress,
            newWorkId,
            true
        );

        _insertNewWork(
            generation,
            encryptedAudioCID,
            encryptedSymmetricKey,
            previewAudioCID,
            jacketCID
        );

        emit Events.AudioPosted(
            nftType,
            creatorAddress,
            newWorkId,
            totalSupply
        );
        totalSupply++;
        return newWorkId;
    }

    function _audioPost(address creatorAddress)
        private
        returns (
            uint256 newWorkId,
            uint256 generation,
            DataTypes.NFTType nftType
        )
    {
        // audio
        newWorkId = totalAudioSupplyByCreator[creatorAddress];
        audioByWorkIdByCreator[creatorAddress][newWorkId].tokenId = totalSupply;

        generation = 0;
        audioByWorkIdByCreator[creatorAddress][newWorkId]
            .generation = generation;

        nftType = DataTypes.NFTType.Audio;

        totalAudioSupplyByCreator[creatorAddress]++;

        return (newWorkId, generation, nftType);
    }

    function _inheritAudioPost(address creatorAddress)
        private
        returns (
            uint256 newWorkId,
            uint256 generation,
            DataTypes.NFTType nftType,
            DataTypes.RefStruct memory parentRef
        )
    {
        // inherit audio
        newWorkId = totalInheritAudioSupplyByCreator[creatorAddress];
        inheritAudioByWorkIdByCreator[creatorAddress][newWorkId]
            .tokenId = totalSupply;

        generation =
            inheritAudioByWorkIdByCreator[parentRef.creatorAddress][
                parentRef.workId
            ].generation +
            1;
        inheritAudioByWorkIdByCreator[creatorAddress][newWorkId]
            .generation = generation;

        nftType = DataTypes.NFTType.InheritAudio;

        totalInheritAudioSupplyByCreator[creatorAddress]++;

        return (newWorkId, generation, nftType, parentRef);
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
            if (workId >= totalAudioSupplyByCreator[creatorAddress]) {
                revert Errors.MintWorkIdInvalid();
            }
            tokenId = audioByWorkIdByCreator[creatorAddress][workId].tokenId;
            audioByWorkIdByCreator[creatorAddress][workId].maxSupply += amount;
            // for tableland
            maxSupply = audioByWorkIdByCreator[creatorAddress][workId]
                .maxSupply;
        } else if (nftType == DataTypes.NFTType.InheritAudio) {
            if (workId >= totalInheritAudioSupplyByCreator[creatorAddress]) {
                revert Errors.MintWorkIdInvalid();
            }
            tokenId = inheritAudioByWorkIdByCreator[creatorAddress][workId]
                .tokenId;
            inheritAudioByWorkIdByCreator[creatorAddress][workId]
                .maxSupply += amount;
            // for tableland
            maxSupply = inheritAudioByWorkIdByCreator[creatorAddress][workId]
                .maxSupply;
        } else {
            revert Errors.UnknownNFTType();
        }

        _mint(creatorAddress, tokenId, amount, "");
        // setApprovalForAll( , true); // approve to market

        _updateOnMint(tokenId, maxSupply, salesPrice);

        emit Events.AudioMinted(nftType, creatorAddress, workId, amount);
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
                if (workIds[i] >= totalAudioSupplyByCreator[creatorAddress]) {
                    revert Errors.MintWorkIdInvalid();
                }
                ids[i] = audioByWorkIdByCreator[creatorAddress][workIds[i]]
                    .tokenId;

                audioByWorkIdByCreator[creatorAddress][workIds[i]]
                    .maxSupply += amounts[i];

                // for tableland
                maxSupplies[i] = audioByWorkIdByCreator[creatorAddress][
                    workIds[i]
                ].maxSupply;
            } else if (types[i] == DataTypes.NFTType.InheritAudio) {
                if (
                    workIds[i] >=
                    totalInheritAudioSupplyByCreator[creatorAddress]
                ) {
                    revert Errors.MintWorkIdInvalid();
                }
                ids[i] = inheritAudioByWorkIdByCreator[creatorAddress][
                    workIds[i]
                ].tokenId;

                inheritAudioByWorkIdByCreator[creatorAddress][workIds[i]]
                    .maxSupply += amounts[i];

                // for tableland
                maxSupplies[i] = inheritAudioByWorkIdByCreator[creatorAddress][
                    workIds[i]
                ].maxSupply;
            } else {
                revert Errors.UnknownNFTType();
            }
        }
        _mintBatch(creatorAddress, ids, amounts, "");

        _updateOnMintBatch(ids, maxSupplies, salesPrices);
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
            Strings.toString(totalSupply),
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

    function _updateOnMint(
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

    function _updateOnMintBatch(
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
                _runUpdateOnMintBatch(suppliesPhrase, pricesPhrase, idPhrase);
                suppliesPhrase = "";
                pricesPhrase = "";
                idPhrase = "";
            } else if (i < tokenIds.length - 1) {
                idPhrase = string.concat(idPhrase, ",");
            }
        }
        _runUpdateOnMintBatch(suppliesPhrase, pricesPhrase, idPhrase);
    }

    function _runUpdateOnMintBatch(
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
