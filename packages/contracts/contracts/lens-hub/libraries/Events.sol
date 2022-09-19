// SPDX-License-Identifier: MIT

pragma solidity 0.8.16;

import {DataTypes} from "./DataTypes.sol";

library Events {
    event BaseInitialized(string name, string symbol, uint256 timestamp);

    event StateSet(
        address indexed caller,
        DataTypes.ProtocolState indexed prevState,
        DataTypes.ProtocolState indexed newState,
        uint256 timestamp
    );

    event GovernanceSet(
        address indexed caller,
        address indexed prevGovernance,
        address indexed newGovernance,
        uint256 timestamp
    );

    event EmergencyAdminSet(
        address indexed caller,
        address indexed oldEmergencyAdmin,
        address indexed newEmergencyAdmin,
        uint256 timestamp
    );

    event ProfileCreated(
        uint256 indexed profileId,
        address indexed creator,
        address indexed to,
        string handle,
        string contentURI,
        uint256 timestamp
    );

    event ProfileURISet(
        uint256 indexed profileId,
        string contentURI,
        uint256 timestamp
    );
}
