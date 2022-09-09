import { NextPage } from "next";
import Link from "next/link";
import { FormEvent } from "react";

const PutOnSale: NextPage = () => {
  const handleSubmit = (e: FormEvent) => {
    console.log("put on sale!!");
  };

  return (
    <div>
      <div className="font-semibold">
        {/* TODO:Header */}
        <Link href="/">
          <a className="text-blue-500">Home</a>
        </Link>
        /
        <Link href="/postNewAudio">
          <a className="text-blue-500">Post New Audio</a>
        </Link>
      </div>
      <div>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="message">number of sales:</label>
            <input
              type="number"
              min={1}
              placeholder="100"
              className="border rounded"
            />
          </div>
          <div>
            <label htmlFor="message">price:</label>
            <input
              type="number"
              min={0.000001}
              placeholder="0.05"
              className="border rounded"
            />
            <label htmlFor="message">MATIC</label>
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

export default PutOnSale;
