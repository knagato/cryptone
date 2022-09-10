import { NextPage } from "next";
import Link from "next/link";
import { useRef } from "react";
import { FormEvent } from "react";
import FormCard from "src/components/formCard";

const PutOnSale: NextPage = () => {
  const salesNum = useRef<HTMLInputElement>(null);
  const salesPrice = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: FormEvent) => {
    console.log("put on sale!!");
    console.log(salesNum.current?.value);
  };

  return (
    <div>
      <div className="font-semibold flex justify-center">
        {/* TODO:Header */}
        <Link href="/">
          <a className="text-blue-500">Home</a>
        </Link>
        /
        <Link href="/postNewAudio">
          <a className="text-blue-500">Post New Audio</a>
        </Link>
      </div>
      <FormCard
        title="Put NFTs On Sale"
        buttonName="submit"
        handleSubmit={handleSubmit}
      >
        <>
          <label htmlFor="message">number of sales:</label>
          <input
            ref={salesNum}
            type="number"
            min={1}
            placeholder="100"
            className="border rounded"
          />
        </>
        <>
          <label htmlFor="message">price:</label>
          <input
            ref={salesPrice}
            type="number"
            min={0.000001}
            placeholder="0.05"
            className="border rounded"
          />
          <label htmlFor="message">MATIC</label>
        </>
      </FormCard>
      {/* TODO:Footer */}
    </div>
  );
};

export default PutOnSale;
