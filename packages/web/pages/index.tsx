import type { NextPage } from "next";
import { useIsMounted } from "src/hooks/useIsMounted";
import { useAccount } from "wagmi";

const Home: NextPage = () => {
  const { address } = useAccount();

  // ref: https://github.com/wagmi-dev/wagmi/issues/542#issuecomment-1144178142
  const isMounted = useIsMounted();

  return (
    <div className="py-10 flex items-center flex-col">
      <div>Top page contents</div>
      {isMounted && address && <div>Connected: {address}</div>}
    </div>
  );
};

export default Home;
