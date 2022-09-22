// this is any type.
import lit from "@lit-protocol/sdk-browser";
import { access } from "fs";
import { SAMPLE_CONTRACT_ADDRESS } from "src/utils/constants";

const client = new lit.LitNodeClient();
const chain = "mumbai";

type EncryptStringResult = {
  encryptedString: string;
  encryptedSymmetricKey: string;
};

type EncryptFileResult = {
  encryptedFile: Blob;
  symmetricKey: Uint8Array;
};

type DecryptWithUnzipResult = {
  decryptedFile: Blob;
  metadata: Object;
};

class Lit {
  private litNodeClient: any;

  private accessControlConditions =
    // [
    //   {
    //     contractAddress: CRYPTONE_CONTRACT_ADDRESS, // Please check that correct address is set for this constant.
    //     standardContractType: "ERC1155",
    //     chain,
    //     method: "balanceOf",
    //     parameters: [":userAddress", "0"],
    //     returnValueTest: {
    //       comparator: ">",
    //       value: "0",
    //     },
    //   },
    // ];
    [
      {
        contractAddress: SAMPLE_CONTRACT_ADDRESS,
        standardContractType: "ERC1155",
        chain,
        method: "balanceOf",
        parameters: [":userAddress", "0"],
        returnValueTest: {
          comparator: ">",
          value: "0",
        },
      },
    ];

  private setConditionTokenId(tokenId: Number) {
    // TODO: modify this function to match conditions structure
    this.accessControlConditions[0].parameters[1] = tokenId.toString();
  }

  async connect() {
    await client.connect();
    this.litNodeClient = client;
  }

  // using encryptFile
  async encryptFile(file: Blob | File): Promise<EncryptFileResult> {
    if (!this.litNodeClient) {
      await this.connect();
    }

    const { encryptedFile, symmetricKey } = await lit.encryptFile({ file });
    console.log({ encryptedFile, symmetricKey });

    return { encryptedFile, symmetricKey };
  }

  async saveEncriptionKey(symmetricKey: string) {
    // TODO: mint original audio token to smart contract
    const conditionTokenId = 0;
    this.setConditionTokenId(conditionTokenId);

    const authSig = await lit.checkAndSignAuthMessage({ chain });

    const encryptedSymmetricKey = await this.litNodeClient.saveEncryptionKey({
      accessControlConditions: this.accessControlConditions,
      symmetricKey: symmetricKey,
      authSig: authSig,
      chain: chain,
    });
    return {
      encryptedSymmetricKey: lit.uint8arrayToString(
        encryptedSymmetricKey,
        "base16"
      ),
    };
  }

  async decryptFile(
    encryptedFile: Blob,
    encryptedSymmetricKey: string,
    conditionTokenId: Number
  ): Promise<Blob> {
    if (!this.litNodeClient) {
      await this.connect();
    }

    this.setConditionTokenId(conditionTokenId);
    const authSig = await lit.checkAndSignAuthMessage({ chain });

    const symmetricKey = await this.litNodeClient.getEncryptionKey({
      accessControlConditions: this.accessControlConditions,
      toDecrypt: encryptedSymmetricKey,
      chain: chain,
      authSig: authSig,
    });
    const decryptedFile = await lit.decryptFile({
      file: encryptedFile,
      symmetricKey: symmetricKey,
    });
    return decryptedFile;
  }

  /*
  // using encryptFileAndZipWithMetadata
  async encryptFileAndZip(file: Blob | File): Promise<Blob> {
    if (!this.litNodeClient) {
      await this.connect();
    }
    const authSig = await lit.checkAndSignAuthMessage({ chain });
    const { zipBlob } = await lit.encryptFileAndZipWithMetadata({
      authSig: authSig,
      accessControlConditions: accessControlConditions,
      chain: chain,
      file: file,
      litNodeClient: this.litNodeClient,
    });
    return zipBlob;
  }

  async decryptZipFile(file: Blob): Promise<DecryptWithUnzipResult> {
    if (!this.litNodeClient) {
      await this.connect();
    }
    const authSig = await lit.checkAndSignAuthMessage({ chain });
    const { decryptedFile, metadata } = await lit.decryptZipFileWithMetadata({
      authSig: authSig,
      file: file,
      litNodeClient: this.litNodeClient,
    });
    return {
      decryptedFile,
      metadata,
    };
  }
  */

  /*
  async encryptString(message: string): Promise<EncryptStringResult> {
    if (!this.litNodeClient) {
      await this.connect();
    }

    const authSig = await lit.checkAndSignAuthMessage({ chain });
    const { encryptedString, symmetricKey } = await lit.encryptString(message);

    const encryptedSymmetricKey = await this.litNodeClient.saveEncryptionKey({
      accessControlConditions,
      symmetricKey,
      authSig,
      chain,
    });

    return {
      encryptedString: encryptedString,
      encryptedSymmetricKey: lit.uint8arrayToString(
        encryptedSymmetricKey,
        "base16"
      ),
    };
  }

  async decryptString(
    encryptedString: string,
    encryptedSymmetricKey: string
  ): Promise<string> {
    if (!this.litNodeClient) {
      await this.connect();
    }

    const authSig = await lit.checkAndSignAuthMessage({ chain });
    const symmetricKey = await this.litNodeClient.getEncryptionKey({
      accessControlConditions,
      toDecrypt: encryptedSymmetricKey,
      chain,
      authSig,
    });

    const decryptedString = await lit.decryptString(
      encryptedString,
      symmetricKey
    );

    return decryptedString;
  }
  */
}

export default new Lit();
