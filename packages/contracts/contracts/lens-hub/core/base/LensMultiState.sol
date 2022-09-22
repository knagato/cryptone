// SPDX-License-Identifier: MIT

pragma solidity 0.8.16;

import {ProfileLib} from "../../libraries/ProfileLib.sol";
import {ProfileLib} from "../../libraries/ProfileLib.sol";
import {ProfileLib} from "../../libraries/ProfileLib.sol";

abstract contract LensMultiState {
    ProfileLib.ProtocolState private _state;

    modifier whenNotPaused() {
        _validateNotPaused();
        _;
    }

    function getState() external view returns (ProfileLib.ProtocolState) {
        return _state;
    }

    function _setState(ProfileLib.ProtocolState newState) internal {
        ProfileLib.ProtocolState prevState = _state;
        _state = newState;
        emit ProfileLib.StateSet(msg.sender, prevState, newState, block.timestamp);
    }

    function _validateNotPaused() internal view {
        if (_state == ProfileLib.ProtocolState.Paused) revert ProfileLib.Paused();
    }
}
