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

  const [encryptedFile, setEncryptedFile] = useState<Blob>();
  const [encryptedSymmetricKey, setEncryptedSymmetricKey] = useState("");

  // const [zipBlob, setZipBlob] = useState<Blob | File>();

  const isEmpty = (str: string | undefined) => str === undefined || str === "";

  const handleSubmit = async (e: FormEvent) => {
    const audioFile = newAudio.current?.files?.item(0);
    const jacketFile = jacket.current?.files?.item(0);
    const name = audioName.current?.value;
    const description = audioDescription.current?.value;
    const preview = null; // TODO: implement preview
    // if (!audioFile || !jacketFile || isEmpty(name) || isEmpty(description) || !preview) {
    if (!audioFile) {
      console.log("a file is not found");
      return;
    }

    // TODO: mint original audio token to smart contract
    const conditionTokenId = 0;

    const { encryptedFile, encryptedSymmetricKey } = await Lit.encryptFile(
      audioFile,
      conditionTokenId
    );
    setEncryptedFile(encryptedFile);
    setEncryptedSymmetricKey(encryptedSymmetricKey);

    /*
    const zipBlob = await Lit.encryptFileAndZip(file);
    setZipBlob(zipBlob);
      */
  };

  // TODO: this implement will be moved to component to play original audio.
  const handleDecrypt = async () => {
    if (!encryptedFile) {
      return;
    }

    // TODO: load original audio tokenId from smart contract
    const conditionTokenId = 0;

    const decryptedFile = await Lit.decryptFile(
      encryptedFile,
      encryptedSymmetricKey,
      conditionTokenId
    );
    console.log(decryptedFile);

    /*
    if (!zipBlob) {
      return;
    }
    const { decryptedFile, metadata } = await Lit.decryptZipFile(zipBlob);
    console.log("decryptedFile");
    console.log(decryptedFile);
    console.log("metaData");
    console.log(metadata);
    */
  };

  return (
    <div className="py-10">
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
          <label htmlFor="message">preview (15s):</label>
          {/* TODO:Edit Preview */}
        </>
        <>
          <button onClick={handleDecrypt} className="border rounded">
            decrypt
          </button>
        </>
      </FormCard>
      {/* TODO:Footer */}
    </div>
  );
};

export default PostNewAudio;
