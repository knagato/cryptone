// this is any type.
import lit from "@lit-protocol/sdk-browser";
import { SAMPLE_CONTRACT_ADDRESS } from "src/utils/constants";

const client = new lit.LitNodeClient();
const chain = "mumbai";

// Must hold at least one Monster Suit NFT (https://opensea.io/collection/monster-suit)
const accessControlConditions =
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

type EncryptStringResult = {
  encryptedString: string;
  encryptedSymmetricKey: string;
};

type EncryptFileResult = {
  encryptedFile: Blob;
  encryptedSymmetricKey: string;
};

type DecryptWithUnzipResult = {
  decryptedFile: Blob;
  metadata: Object;
};

class Lit {
  litNodeClient: any;

  async connect() {
    await client.connect();
    this.litNodeClient = client;
  }

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

  // using encryptFile
  async encryptFile(file: Blob | File): Promise<EncryptFileResult> {
    if (!this.litNodeClient) {
      await this.connect();
    }

    const authSig = await lit.checkAndSignAuthMessage({ chain });

    const { encryptedFile, symmetricKey } = await lit.encryptFile({ file });
    const encryptedSymmetricKey = await this.litNodeClient.saveEncryptionKey({
      accessControlConditions,
      symmetricKey,
      authSig,
      chain,
    });
    return {
      encryptedFile,
      encryptedSymmetricKey: lit.uint8arrayToString(
        encryptedSymmetricKey,
        "base16"
      ),
    };
  }

  async decryptFile(
    encryptedFile: Blob,
    encryptedSymmetricKey: string
  ): Promise<Blob> {
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
    const decryptedFile = await lit.decryptFile(encryptedFile, symmetricKey);
    return decryptedFile;
  }

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
}

export default new Lit();
