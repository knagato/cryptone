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
  const amount = useRef<HTMLInputElement>(null);
  const salesPrice = useRef<HTMLInputElement>(null);
  const [workType, setWorkType] = useState(-1);
  const [workId, setWorkId] = useState(-1);

  const {
    config: config,
    error: prepareError,
    isError: isPrepareError,
  } = usePrepareContractWrite({
    addressOrName: AUDIO_CONTRACT_ADDRESS!,
    contractInterface: audioABI,
    functionName: 'mint',
    args: [workType, workId, amount, salesPrice],
  });
  const {
    data: data,
    error: error,
    isError: isError,
    write: write,
  } = useContractWrite(config);
  const { isLoading: isLoading, isSuccess: isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  const {
    data: readData,
    isError: isReadError,
    isLoading: isReadLoading,
  } = useContractRead({
    addressOrName: AUDIO_CONTRACT_ADDRESS!,
    contractInterface: audioABI,
    functionName: 'getReferenceToWork',
    args: router.query.tokenId,
    onSuccess(data) {
      setWorkType(data.workType);
      setWorkId(data.workId);
    },
  });

  useContractEvent({
    addressOrName: AUDIO_CONTRACT_ADDRESS!,
    contractInterface: audioABI,
    eventName: 'AudioMinted',
    listener: (event) => {
      console.log(event);
      // setTokenId(event.tokenId);
      // setGeneration(event.generation);
      console.log(event.tokenId, event.amount, event.salesPrice);
      console.log('Completed!!!');
    },
  });

  return (
    <div className="py-10">
      <FormCard
        title="Put NFTs On Sale"
        buttonName="submit"
        handleSubmit={() => (write ? write() : {})}
      >
        <>
          <label htmlFor="message">number of sales:</label>
          <input
            ref={amount}
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
    </div>
  );
};

export default PutOnSale;
