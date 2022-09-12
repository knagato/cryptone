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

  const handleSubmit = (e: FormEvent) => {
    console.log("post new audio!!");
    console.log(audioName.current?.value);
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
