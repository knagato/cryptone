// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

import "../node_modules/@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "../node_modules/@openzeppelin/contracts/utils/Strings.sol";
import "../node_modules/@tableland/evm/contracts/ITablelandTables.sol";
import "./audio-libs/DataTypes.sol";
import "./audio-libs/Events.sol";
import "./audio-libs/Errors.sol";
import {CrypToneProfile} from "./CrypToneProfile.sol";

contract CrypToneAudio is ERC1155 {
    address internal immutable PROFILE_NFT_CONTRACT; // TODO:setter only owner

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
    string private _chainName; // ex:polygon-mumbai

    constructor(
        address profileNFTContract,
        address tableRegistry,
        string memory chainName
    ) ERC1155("") {
        if (profileNFTContract == address(0)) {
            revert Errors.InitParamsInvalid();
        }
        PROFILE_NFT_CONTRACT = profileNFTContract;
        _initTableland(tableRegistry, chainName);
    }

    // tokenURI is expected IPFS CID
    function postWork(
        uint256 parentTokenId,
        string calldata encryptedAudioCID,
        string calldata encryptedSymmetricKey,
        string calldata previewAudioCID,
        string calldata jacketCID
    ) external returns (uint256) {
        if (!_profileNFTExists(msg.sender)) {
            revert Errors.ProfileNFTNotFound();
        }

        uint256 newWorkId;
        uint256 generation;
        DataTypes.NFTType nftType;

        DataTypes.RefStruct memory parentRef = refByTokenId[parentTokenId];
        if (!parentRef.exists) {
            // audio
            newWorkId = totalAudioSupplyByCreator[msg.sender];
            audioByWorkIdByCreator[msg.sender][newWorkId].tokenId = totalSupply;

            generation = 0;
            audioByWorkIdByCreator[msg.sender][newWorkId]
                .generation = generation;

            nftType = DataTypes.NFTType.Audio;

            totalAudioSupplyByCreator[msg.sender]++;
        } else {
            // inherit audio
            newWorkId = totalInheritAudioSupplyByCreator[msg.sender];
            inheritAudioByWorkIdByCreator[msg.sender][newWorkId]
                .tokenId = totalSupply;

            generation = inheritAudioByWorkIdByCreator[parentRef.creatorAddress][parentRef.workId]
                .generation + 1;
            inheritAudioByWorkIdByCreator[msg.sender][newWorkId]
                .generation = generation;

            nftType = DataTypes.NFTType.InheritAudio;

            totalInheritAudioSupplyByCreator[msg.sender]++;
        }

        refByTokenId[totalSupply] = DataTypes.RefStruct(
            msg.sender,
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

        emit Events.AudioPosted(nftType, msg.sender, newWorkId, totalSupply);
        totalSupply++;
        return newWorkId;
    }

    // maybe, an argument 'tokenId' will be enough to refer to an audio data
    function mint(
        DataTypes.NFTType nftType,
        uint256 workId,
        uint256 amount,
        uint256 salesPrice
    ) public {
        uint256 tokenId;
        uint256 maxSupply;
        if (nftType == DataTypes.NFTType.Audio) {
            if (workId >= totalAudioSupplyByCreator[msg.sender]) {
                revert Errors.MintWorkIdInvalid();
            }
            tokenId = audioByWorkIdByCreator[msg.sender][workId].tokenId;
            audioByWorkIdByCreator[msg.sender][workId].maxSupply += amount;
            // for tableland
            maxSupply = audioByWorkIdByCreator[msg.sender][workId].maxSupply;
        } else if (nftType == DataTypes.NFTType.InheritAudio) {
            if (workId >= totalInheritAudioSupplyByCreator[msg.sender]) {
                revert Errors.MintWorkIdInvalid();
            }
            tokenId = inheritAudioByWorkIdByCreator[msg.sender][workId].tokenId;
            inheritAudioByWorkIdByCreator[msg.sender][workId]
                .maxSupply += amount;
            // for tableland
            maxSupply = inheritAudioByWorkIdByCreator[msg.sender][workId]
                .maxSupply;
        } else {
            revert Errors.UnknownNFTType();
        }

        _mint(msg.sender, tokenId, amount, "");
        // setApprovalForAll( , true); // approve to market

        _updateOnMint(tokenId, maxSupply, salesPrice);

        emit Events.AudioMinted(nftType, msg.sender, workId, amount);
    }

    function mintBatch(
        DataTypes.NFTType[] calldata types,
        uint256[] calldata workIds,
        uint256[] calldata amounts,
        uint256[] calldata salesPrices
    ) public {
        if (types.length != workIds.length || workIds.length != amounts.length) {
            revert Errors.MintBatchLengthInvalid();
        }
        uint256[] memory ids = new uint256[](workIds.length);
        uint256[] memory maxSupplies = new uint256[](workIds.length);
        for (uint256 i = 0; i < workIds.length; i++) {
            if (types[i] == DataTypes.NFTType.Audio) {
                if (workIds[i] >= totalAudioSupplyByCreator[msg.sender]) {
                    revert Errors.MintWorkIdInvalid();
                }
                ids[i] = audioByWorkIdByCreator[msg.sender][workIds[i]].tokenId;

                audioByWorkIdByCreator[msg.sender][workIds[i]]
                    .maxSupply += amounts[i];

                // for tableland
                maxSupplies[i] = audioByWorkIdByCreator[msg.sender][workIds[i]]
                    .maxSupply;
            } else if (types[i] == DataTypes.NFTType.InheritAudio) {
                if (workIds[i] >= totalInheritAudioSupplyByCreator[msg.sender]) {
                    revert Errors.MintWorkIdInvalid();
                }
                ids[i] = inheritAudioByWorkIdByCreator[msg.sender][workIds[i]]
                    .tokenId;

                inheritAudioByWorkIdByCreator[msg.sender][workIds[i]]
                    .maxSupply += amounts[i];

                // for tableland
                maxSupplies[i] = inheritAudioByWorkIdByCreator[msg.sender][workIds[i]]
                    .maxSupply;
            } else {
                revert Errors.UnknownNFTType();
            }
        }
        _mintBatch(msg.sender, ids, amounts, "");

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
        return CrypToneProfile(PROFILE_NFT_CONTRACT).profileExists(profileAddress);
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
