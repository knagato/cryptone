// Ref. https://tailwindui.com/components/ecommerce/components/product-lists
import { AudioNFT } from "@prisma/client";
import type { NextPage } from "next";
import { FC } from "react";
import { useHowler } from "src/hooks/useHowler";
import useSWR from "swr";

const fetcher = (path: string) =>
  fetch(`${path}`, {
    method: "GET",
  }).then((res) => res.json());

type ExtendAudioNFT = AudioNFT & {
  originalAudioUrl: string | null;
  previewAudioUrl: string;
};

const Home: NextPage = () => {
  const { data } = useSWR<{
    data: ExtendAudioNFT[];
  }>(["/api/audio-nfts"], fetcher);

  return (
    <div className="container mx-auto py-16">
      <h2 className="text-2xl font-bold tracking-tight text-gray-900">
        Your Audio NFTs
      </h2>

      <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
        {data?.data.map((audio) => (
          <AudioNFT key={audio.id} audioNFT={audio} />
        ))}
      </div>
    </div>
  );
};

type Props = {
  audioNFT: ExtendAudioNFT;
};

const AudioNFT: FC<Props> = ({ audioNFT }) => {
  const [playPreviewAudio, { stop: stopPreviewAudio }] = useHowler(
    audioNFT.previewAudioUrl
  );
  const [playOriginalAudio, { stop: stopOriginalAudio }] = useHowler(
    audioNFT.originalAudioUrl ?? undefined
  );

  return (
    <div className="group relative">
      <div className="min-h-80 aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:aspect-none lg:h-80">
        <img
          src={`https://ipfs.io/ipfs/${audioNFT.jacketImageCID}`}
          alt={audioNFT.title}
          className="h-full w-full object-cover object-center lg:h-full lg:w-full"
        />
      </div>
      <div className="mt-4 flex justify-between">
        <h3 className="text-base">{audioNFT.title}</h3>
        <div className="space-x-2">
          <button
            className="px-2 py-1 border rounded"
            onClick={() => playPreviewAudio()}
          >
            Play (preview)
          </button>
          {audioNFT.originalAudioUrl && (
            <button
              className="px-2 py-1 border rounded"
              onClick={() => playOriginalAudio()}
            >
              Play (original)
            </button>
          )}
          <button
            className="px-2 py-1 border rounded"
            onClick={() => {
              stopPreviewAudio();
              stopOriginalAudio();
            }}
          >
            Stop
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
