// SPDX-License-Identifier: MIT

pragma solidity 0.8.16;

import {ProfileLib} from "../libraries/ProfileLib.sol";

interface ILensHub {
    function initialize(
        string calldata name,
        string calldata symbol,
        address newGovernance
    ) external;

    function setGovernance(address newGovernance) external;

    function setEmergencyAdmin(address newEmergencyAdmin) external;

    function setState(ProfileLib.ProtocolState newState) external;

    function getGovernance() external view returns (address);

    function getProfile(uint256 profileId)
        external
        view
        returns (ProfileLib.ProfileStruct memory);
}
