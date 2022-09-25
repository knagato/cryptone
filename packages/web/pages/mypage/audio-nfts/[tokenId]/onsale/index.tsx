import { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { FormEvent } from 'react';
import FormCard from 'src/components/formCard';
import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
  useContractRead,
  useContractEvent,
} from 'wagmi';
import audioABI from 'src/abi/audio.abi.json';

const PutOnSale: NextPage = () => {
  const AUDIO_CONTRACT_ADDRESS = '0xad5e5FfDB352769854D7E55E3d793F3237F46104';
  const router = useRouter();
  const [amount, setAmount] = useState('100');
  const [salesPrice, setSalesPrice] = useState<string>('10000');
  const [workType, setWorkType] = useState(0);
  const [workId, setWorkId] = useState(0);

  const {
    config: mintConfig,
    error: prepareError,
    isError: isPrepareError,
  } = usePrepareContractWrite({
    addressOrName: AUDIO_CONTRACT_ADDRESS,
    contractInterface: audioABI,
    functionName: 'mint',
    args: [
      workType,
      workId,
      Number.parseInt(amount),
      Number.parseInt(salesPrice),
    ],
  });

  const {
    data: mintData,
    error: mintError,
    isError: isMintError,
    write: mintWrite,
  } = useContractWrite(mintConfig);

  const { isLoading: isLoading, isSuccess: isSuccess } = useWaitForTransaction({
    hash: mintData?.hash,
  });

  const getAudioInfo = async (tokenId: Number) => {
    const res = await fetch('/api/audio-nfts/new/mint', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tokenId: tokenId,
      }),
    });
    const json = await res.json();
    setWorkType(json.workType);
    setWorkId(json.workId);
    console.log(json.workType, json.workId);
  };

  useEffect(() => {
    const tokenId = router.query.tokenId;
    if (!tokenId || typeof tokenId !== 'string') {
      return;
    }
    getAudioInfo(Number.parseInt(tokenId));
  }, [router.query.tokenId]);

  useContractEvent({
    addressOrName: AUDIO_CONTRACT_ADDRESS!,
    contractInterface: audioABI,
    eventName: 'AudioMinted',
    listener: (event) => {
      console.log(event[0], event[1], event[2]);
      console.log('Completed!!!');
    },
  });

  return (
    <div className="container mx-auto py-10">
      <div>
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          mint AudioNFT
        </h3>
      </div>

      <div className="grid grid-cols-3 items-start gap-4 border-t border-gray-200 py-4">
        <label
          htmlFor="amountRef"
          className="block text-sm font-medium text-gray-700 mt-2"
        >
          Supply Amount
        </label>
        <div className="mt-1 col-span-2">
          <input
            onChange={(e) => setAmount(e.target.value)}
            type="number"
            value={amount}
            className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 items-start gap-4 border-t border-gray-200 py-4">
        <label
          htmlFor="salesPriceRef"
          className="block text-sm font-medium text-gray-700 mt-2"
        >
          Sales Price
        </label>
        <div className="mt-1 col-span-2">
          <input
            onChange={(e) => setSalesPrice(e.target.value)}
            value={salesPrice}
            type="number"
            id="salesPriceRef"
          />
        </div>
      </div>

      <div className="flex justify-end border-t pt-4">
        <button
          onClick={() => {
            console.log(amount, salesPrice);
            mintWrite ? mintWrite() : {};
          }}
          disabled={isLoading || isSuccess}
          className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default PutOnSale;
