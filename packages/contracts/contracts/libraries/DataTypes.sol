// SPDX-License-Identifier: MIT

pragma solidity 0.8.16;

/**
 * @title DataTypes
 * @author Lens Protocol
 *
 * @notice A standard library of data types used throughout the Lens Protocol.
 */
library DataTypes {
    /**
     * @notice An enum containing the different states the protocol can be in, limiting certain actions.
     *
     * @param Unpaused The fully unpaused state.
     * @param PublishingPaused The state where only publication creation functions are paused.
     * @param Paused The fully paused state.
     */
    enum ProtocolState {
        Unpaused,
        PublishingPaused,
        Paused
    }

    /**
     * @notice An enum specifically used in a helper function to easily retrieve the publication type for integrations.
     *
     * @param Post A standard post, having a URI, a collect module but no pointer to another publication.
     * @param Nonexistent An indicator showing the queried publication does not exist.
     */
    enum PubType {
        Post,
        Nonexistent,
        Unknown
    }

    /**
     * @notice A struct containing the necessary information to reconstruct an EIP-712 typed data signature.
     *
     * @param v The signature's recovery parameter.
     * @param r The signature's r parameter.
     * @param s The signature's s parameter
     * @param deadline The signature's deadline
     */
    struct EIP712Signature {
        uint8 v;
        bytes32 r;
        bytes32 s;
        uint256 deadline;
    }

    // /**
    //  * @notice A struct containing profile data.
    //  *
    //  * @param pubCount The number of publications made to this profile.
    //  * @param handle The profile's associated handle.
    //  * @param imageURI The URI to be used for the profile's image.
    //  */
    struct ProfileStruct {
        uint256 workCount;
        string handle;
        string imageURI;
        address audioNFTContract;
    }

    // /**
    //  * @notice A struct containing data associated with each new publication.
    //  *
    //  * @param profileIdPointed The profile token ID this publication points to, for mirrors and comments.
    //  * @param pubIdPointed The publication ID this publication points to, for mirrors and comments.
    //  * @param contentURI The URI associated with this publication.
    //  */
    struct WorkStruct {
        uint256 profileIdPointed;
        uint256 workIdPointed;
        string contentURI;
    }

    /**
     * @notice A struct containing the parameters required for the `createProfile()` function.
     *
     * @param to The address receiving the profile.
     * @param handle The handle to set for the profile, must be unique and non-empty.
     * @param imageURI The URI to set for the profile image.
     */
    struct CreateProfileData {
        address to;
        string handle;
        string imageURI;
    }

    // /**
    //  * @notice A struct containing the parameters required for the `setDefaultProfileWithSig()` function. Parameters are
    //  * the same as the regular `setDefaultProfile()` function, with an added EIP712Signature.
    //  *
    //  * @param wallet The address of the wallet setting the default profile.
    //  * @param profileId The token ID of the profile which will be set as default, or zero.
    //  * @param sig The EIP712Signature struct containing the profile owner's signature.
    //  */
    struct SetDefaultProfileWithSigData {
        address wallet;
        uint256 profileId;
        EIP712Signature sig;
    }

    /**
     * @notice A struct containing the parameters required for the `setProfileImageURIWithSig()` function. Parameters are the same
     * as the regular `setProfileImageURI()` function, with an added EIP712Signature.
     *
     * @param profileId The token ID of the profile to set the URI for.
     * @param imageURI The URI to set for the given profile image.
     * @param sig The EIP712Signature struct containing the profile owner's signature.
     */
    struct SetProfileImageURIWithSigData {
        uint256 profileId;
        string imageURI;
        EIP712Signature sig;
    }

    struct PostData {
        uint256 profileId;
        string workURI;
    }

    struct PostWithSigData {
        uint256 profileId;
        string workURI;
        EIP712Signature sig;
    }

    struct OnSaleData {
        uint256 profileId;
        uint256 workId;
        uint256 amount;
    }

    struct OnSaleWithSigData {
        uint256 profileId;
        uint256 workId;
        uint256 amount;
        EIP712Signature sig;
    }

    /**
     * @notice A struct containing the parameters required for the `setProfileMetadataWithSig()` function.
     *
     * @param profileId The profile ID for which to set the metadata.
     * @param metadata The metadata string to set for the profile and user.
     * @param sig The EIP712Signature struct containing the user's signature.
     */
    struct SetProfileMetadataWithSigData {
        uint256 profileId;
        string metadata;
        EIP712Signature sig;
    }
}
