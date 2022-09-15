import { NextPage } from "next";
import Link from "next/link";
import { FormEvent, useRef } from "react";
import FormCard from "src/components/formCard";

const PostNewAudio: NextPage = () => {
  const newAudio = useRef<HTMLInputElement>(null);
  const jacket = useRef<HTMLInputElement>(null);
  const audioName = useRef<HTMLInputElement>(null);
  const audioDescription = useRef<HTMLInputElement>(null);
  // const preview = useRef(null);

  const handleSubmit = async (e: FormEvent) => {
    console.log("post new audio!!");

    // post data to IPFS
    // this implement is test 
    const audioFile = newAudio.current?.files?.item(0);
    const jacketFile = jacket.current?.files?.item(0);
    if (!audioFile || !jacketFile) {
      return;
    }
    const formData = new FormData();
    formData.append(
      "audio",
      new Blob([audioFile], { type: "application/octet-stream" })
    );
    formData.append(
      "jacket",
      new Blob([jacketFile], { type: "application/octet-stream" })
    );
    const response = await fetch("/api/ipfs", {
      method: "POST",
      headers: {},
      body: formData,
    });
    console.log(response.body);
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
      </FormCard>
      {/* TODO:Footer */}
    </div>
  );
};

export default PostNewAudio;
