import { NextPage } from "next";
import Link from "next/link";
import { FormEvent, useRef, useState } from "react";
import FormCard from "src/components/formCard";
import Lit from "src/lib/Lit";

const PostNewAudio: NextPage = () => {
  const newAudio = useRef<HTMLInputElement>(null);
  const jacket = useRef<HTMLInputElement>(null);
  const audioName = useRef<HTMLInputElement>(null);
  const audioDescription = useRef<HTMLInputElement>(null);
  // const preview = useRef(null);

  // const [zipBlob, setZipBlob] = useState<Blob | File>();

  // const [encryptedFile, setEncryptedFile] = useState<Blob>();
  // const [encryptedSymmetricKey, setEncryptedSymmetricKey] = useState("");

  const [encryptedString, setEncryptedString] = useState("");
  const [encryptedSymmetricKey, setEncryptedSymmetricKey] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    const file = newAudio.current?.files?.item(0);
    if (!file) {
      console.log("a file is not found");
      return;
    }
    const { encryptedString, encryptedSymmetricKey } = await Lit.encryptString(
      "Hello Lit-Protocol!!"
    );
    // setZipBlob(zipBlob);

    // setEncryptedFile(encryptedFile);
    setEncryptedString(encryptedString);
    setEncryptedSymmetricKey(encryptedSymmetricKey);
  };

  const handleDecrypt = async () => {
    // if (!encryptedFile) {
    //   return;
    // }
    // const decryptedFile = await Lit.decryptFile(
    //   encryptedFile,
    //   encryptedSymmetricKey
    // );

    const decryptedString = await Lit.decryptString(
      encryptedString,
      encryptedSymmetricKey
    );
    console.log();
    // console.log("decryptedFile");
    // console.log(decryptedFile);
    console.log(decryptedString);
    // console.log("metaData");
    // console.log(metadata);
  };

  return (
    <div>
      <div className="font-semibold flex justify-center">
        {/* TODO:Header */}
        <Link href="/">
          <a className="text-blue-500">Home</a>
        </Link>
        /
        <Link href="/putOnSale">
          <a className="text-blue-500">Put On Sale</a>
        </Link>
      </div>
      <FormCard
        title="Post New Audio"
        buttonName="submit"
        handleSubmit={handleSubmit}
      >
        <>
          <label htmlFor="message">original audio:</label>
          <input
            ref={newAudio}
            type="file"
            accept="audio/*"
            name="original-audio"
            id="original-audio"
          />
        </>
        <>
          <label htmlFor="message">jacket:</label>
          <input
            ref={jacket}
            type="file"
            accept="image/*"
            name="jacket"
            id="jacket"
          />
        </>
        <>
          <label htmlFor="message">audio name:</label>
          <input ref={audioName} type="text" className="border rounded" />
        </>
        <>
          <label htmlFor="message">audio description:</label>
          <input
            ref={audioDescription}
            type="text"
            className="border rounded"
          />
        </>
        <>
          <button onClick={handleDecrypt}>decrypt</button>
        </>
        <>
          <label htmlFor="message">preview (15s):</label>
          {/* TODO:Edit Preview */}
        </>
      </FormCard>
      {/* TODO:Footer */}
    </div>
  );
};

export default PostNewAudio;
