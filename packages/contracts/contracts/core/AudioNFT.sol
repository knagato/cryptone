// SPDX-License-Identifier: MIT
pragma solidity 0.8.15;

import "../../../../node_modules/@openzeppelin/contracts/token/ERC1155/extensions/ERC1155URIStorage.sol";
import "../../../../node_modules/@openzeppelin/contracts/access/Ownable.sol";

contract AudioSupply is ERC1155URIStorage, Ownable {
    constructor() ERC1155("") {}

    // tokenURI is expected IPFS CID
    function addNewType(uint256 tokenId, string memory tokenURI)
        external
        onlyOwner
    {
        _setURI(tokenId, tokenURI);
    }

    function mint(uint256 tokenId, uint256 amount) public onlyOwner {
        _mint(msg.sender, tokenId, amount, "");
        // setApprovalForAll( , true); // approve to market
    }
}
