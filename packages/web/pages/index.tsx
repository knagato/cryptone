import type { NextPage } from "next";
import Link from "next/link";

const Home: NextPage = () => {
  return (
    <>
      <div className="font-semibold">
        <div>Hello World!</div>
        <div>
          <Link href="/postNewAudio">
            <a className="text-blue-500">Post New Audio</a>
          </Link>
          /
          <Link href="/putOnSale">
            <a className="text-blue-500">Put On Sale</a>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Home;
