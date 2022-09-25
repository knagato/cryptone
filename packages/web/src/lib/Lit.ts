// this is any type.
import lit from "@lit-protocol/sdk-nodejs";
import { access } from "fs";

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
        contractAddress: process.env.AUDIO_CONTRACT_ADDRESS,
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

    return { encryptedFile, symmetricKey };
  }

  async saveEncriptionKey(symmetricKey: Buffer, conditionTokenId: number) {
    if (!this.litNodeClient) {
      await this.connect();
    }

    this.setConditionTokenId(conditionTokenId);

    const authSig = await lit.checkAndSignAuthMessage({ chain });

    const encryptedSymmetricKey = await this.litNodeClient.saveEncryptionKey({
      accessControlConditions: this.accessControlConditions,
      symmetricKey: new Uint8Array(symmetricKey),
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

}

export default new Lit();
