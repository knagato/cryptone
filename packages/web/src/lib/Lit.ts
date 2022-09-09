// this is any type.
import lit from "@lit-protocol/sdk-browser";

const client = new lit.LitNodeClient();
const chain = "mumbai";

/** 
 * Access control for a wallet with > 0.00001 ETH
 * const accessControlConditionsETHBalance = [
  {
    contractAddress: '',
    standardContractType: '',
    chain,
    method: 'eth_getBalance',
    parameters: [
      ':userAddress',
      'latest'
    ],
    returnValueTest: {
      comparator: '>=',
      value: '10000000000000'
    }
  }
]
 */

// Must hold at least one Monster Suit NFT (https://opensea.io/collection/monster-suit)
const accessControlConditionsNFT = [
  {
    contractAddress: "0xabdfb84dae7923dd346d5b1a0c6fbbb0e6e5df64",
    standardContractType: "ERC721",
    chain,
    method: "balanceOf",
    parameters: [":userAddress"],
    returnValueTest: {
      comparator: ">",
      value: "0",
    },
  },
];

class Lit {
  litNodeClient: any;

  async connect() {
    await client.connect();
    this.litNodeClient = client;
  }

  async encryptString(str: String) {
    if (!this.litNodeClient) {
      await this.connect();
    }
    const authSig = await lit.checkAndSignAuthMessage({ chain });
    const { encryptedString, symmetricKey } = await lit.encryptString(str);

    const encryptedSymmetricKey = await this.litNodeClient.saveEncryptionKey({
      accessControlConditions: accessControlConditionsNFT,
      symmetricKey,
      authSig,
      chain,
    });

    return {
      encryptedFile: encryptedString,
      encryptedSymmetricKey: lit.uint8arrayToString(
        encryptedSymmetricKey,
        "base16"
      ),
    };
  }

  async encryptFile() {
    if (!this.litNodeClient) {
      await this.connect();
    }

    const authSig = await lit.checkAndSignAuthMessage({ chain });
    const { encryptedFile, symmetricKey } =
      await lit.encryptFileAndZipWithMetadata();
    const encryptedSymmetricKey = await this.litNodeClient.saveEncryptionKey({
      accessControlConditions: accessControlConditionsNFT,
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

  async decryptString(encryptedStr: String, encryptedSymmetricKey: String) {
    if (!this.litNodeClient) {
      await this.connect();
    }
    const authSig = await lit.checkAndSignAuthMessage({ chain });
    const symmetricKey = await this.litNodeClient.getEncryptionKey({
      accessControlConditions: accessControlConditionsNFT,
      toDecrypt: encryptedSymmetricKey,
      chain,
      authSig,
    });
    const decryptedFile = await lit.decryptString(
      encryptedStr,
      symmetricKey
    );
    // eslint-disable-next-line no-console
    console.log({
      decryptedFile,
    });
    return { decryptedFile };
  }
}

export default new Lit();
