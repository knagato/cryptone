// SPDX-License-Identifier: MIT

pragma solidity 0.8.16;

library Errors {
    error CannotInitImplementation();
    error Initialized();
    error SignatureExpired();
    error SignatureInvalid();
    error NotOwnerOrApproved();
    error NotGovernance();
    error NotGovernanceOrEmergencyAdmin();
    error EmergencyAdminCannotUnpause();
    error NotProfileOwner();
    error HandleTaken();
    error HandleLengthInvalid();
    error HandleContainsInvalidCharacters();
    error ProfileImageURILengthInvalid();

    error InitParamsInvalid();
    error AudioIdInvalid();
    error AudioNFTInvalid();

    // MultiState Errors
    error Paused();
    error PublishingPaused();
}
