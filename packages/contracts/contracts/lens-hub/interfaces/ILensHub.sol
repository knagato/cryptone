// SPDX-License-Identifier: MIT

pragma solidity 0.8.16;

import {DataTypes} from "../libraries/DataTypes.sol";

interface ILensHub {
    function initialize(
        string calldata name,
        string calldata symbol,
        address newGovernance
    ) external;

    function setGovernance(address newGovernance) external;

    function setEmergencyAdmin(address newEmergencyAdmin) external;

    function setState(DataTypes.ProtocolState newState) external;

    function createProfile(DataTypes.CreateProfileData calldata vars)
        external
        returns (uint256);

    function defaultProfile(address wallet) external view returns (uint256);

    function getGovernance() external view returns (address);

    function getHandle(uint256 profileId) external view returns (string memory);

    function getProfileIdByHandle(string calldata handle)
        external
        view
        returns (uint256);

    function getProfile(uint256 profileId)
        external
        view
        returns (DataTypes.ProfileStruct memory);
}
