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
    error ProfileURILengthInvalid();
    
    error ProfileAlreadyExists();
    error ProfileNotFound();
    error NotSenderAddress();

    // MultiState Errors
    error Paused();
}
