// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

import "../../node_modules/@openzeppelin/contracts/utils/Strings.sol";
import "../../node_modules/@tableland/evm/contracts/ITablelandTables.sol";

abstract contract TablelandManager {
    // Tableland
    string private _baseURIString =
        "https://testnet.tableland.network/query?s=";
    ITablelandTables private _tableland;
    string private _metadataTable;
    uint256 private _metadataTableId;
    string private _tablePrefix = "canvas";
    string private _chainName; // e.g. polygon-mumbai

    constructor(address tableRegistry, string memory chainName) {
        _initTableland(tableRegistry, chainName);
    }

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
                "salesPrice text, ",
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
    ) internal {
        // too long concat makes the hardhat compile faiied.
        string memory query = string.concat(
            "INSERT INTO ",
            _metadataTable,
            " (chain, contractAddress, tokenId, ", // polygon-mumbai
            "salesPrice, ",
            "generation, encryptedAudioCID, ",
            "encryptedSymmetricKey, previewAudioCID, jacketCID)",
            " SELECT '",
            _chainName,
            "','",
            Strings.toHexString(address(this)),
            "','"
        );
        query = string.concat(
            query,
            Strings.toString(tokenId),
            "','0',",
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
            "' WHERE NOT EXISTS (SELECT 1 FROM ",
            _metadataTable,
            " WHERE tokenId='",
            Strings.toString(tokenId),
            "');"
        );
        _tableland.runSQL(address(this), _metadataTableId, query);
    }

    function _updateTableOnMint(uint256 tokenId, uint256 salesPrice) internal {
        _tableland.runSQL(
            address(this),
            _metadataTableId,
            string.concat(
                "UPDATE ",
                _metadataTable,
                " SET salesPrice = '",
                Strings.toString(salesPrice),
                "' WHERE tokenId = '",
                Strings.toString(tokenId),
                "';"
            )
        );
    }

    function _updateTableOnMintBatch(
        uint256[] memory tokenIds,
        uint256[] memory salesPrices
    ) internal {
        string memory pricesPhrase = "";
        string memory idPhrase = "";
        for (uint256 i = 0; i < tokenIds.length; i++) {
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
            uint256 strLength = bytes(pricesPhrase).length +
                bytes(idPhrase).length;
            if (strLength > 34500) {
                // devide query
                _runUpdateTableOnMintBatch(pricesPhrase, idPhrase);
                pricesPhrase = "";
                idPhrase = "";
            } else if (i < tokenIds.length - 1) {
                idPhrase = string.concat(idPhrase, ",");
            }
        }
        _runUpdateTableOnMintBatch(pricesPhrase, idPhrase);
    }

    function _runUpdateTableOnMintBatch(
        string memory pricesPhrase,
        string memory idPhrase
    ) internal {
        _tableland.runSQL(
            address(this),
            _metadataTableId,
            string.concat(
                "UPDATE ",
                _metadataTable,
                " SET salesPrice=CASE tokenId ",
                pricesPhrase,
                "END WHERE tokenId IN(",
                idPhrase,
                ");"
            )
        );
    }
}
