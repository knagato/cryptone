import { NextPage } from "next";
import Link from "next/link";
import { FormEvent } from "react";

const PostNewAudio: NextPage = () => {
  const handleSubmit = (e: FormEvent) => {
    console.log("post new audio!!");
  };

  return (
    <div>
      <div className="font-semibold">
        {/* TODO:Header */}
        <Link href="/">
          <a className="text-blue-500">Home</a>
        </Link>
        /
        <Link href="/putOnSale">
          <a className="text-blue-500">Put On Sale</a>
        </Link>
      </div>
      <div>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="message">original audio file:</label>
            <input
              type="file"
              accept="audio/*"
              name="original-audio"
              id="original-audio"
            />
          </div>
          <div>
            <label htmlFor="message">preview (15s):</label>
            {/* TODO:Edit Preview */}
          </div>
          <div>
            <label htmlFor="message">jacket:</label>
            <input type="file" accept="image/*" name="jacket" id="jacket" />
          </div>
          <div>
            <label htmlFor="message">audio name:</label>
            <input type="text" className="border rounded" />
          </div>
          <div>
            <label htmlFor="message">audio discription:</label>
            <input type="text" className="border rounded" />
          </div>
          <div>
            <button
              type="submit"
              className="bg-blue-700 hover:bg-blue-600 text-white rounded px-4 py-2"
            >
              submit
            </button>
          </div>
        </form>
      </div>
      {/* TODO:Footer */}
    </div>
  );
};

export default PostNewAudio;
