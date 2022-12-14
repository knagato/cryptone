import { Fragment, useEffect, useState } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { NextPage } from 'next';
import { Image, UploadAudio } from '@prisma/client';
import {
  useContractEvent,
  useContractWrite,
  usePrepareContractWrite,
  usePrepareSendTransaction,
  useWaitForTransaction,
} from 'wagmi';
import audioABI from 'src/abi/audio.abi.json';
import { useRouter } from 'next/router';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const PostNewAudioNFT: NextPage = () => {
  const AUDIO_CONTRACT_ADDRESS = '0xad5e5FfDB352769854D7E55E3d793F3237F46104';
  const [audios, setAudios] = useState<UploadAudio[]>([]);
  const [images, setImages] = useState<Image[]>([]);
  const [audioSelected, setAudioSelected] = useState<UploadAudio>(audios[0]);
  const [imageSelected, setImageSelected] = useState<Image>(images[0]);

  const {
    config: audioConfig,
    error: audioPrepareError,
    isError: isAudioPrepareError,
  } = usePrepareContractWrite({
    addressOrName: AUDIO_CONTRACT_ADDRESS,
    contractInterface: audioABI,
    functionName: 'postNewAudio',
  });

  const {
    data: audioData,
    error: audioError,
    isError: isAudioError,
    write: audioWrite,
  } = useContractWrite(audioConfig);

  const { isLoading: isAudioLoading, isSuccess: isAudioSuccess } =
    useWaitForTransaction({
      hash: audioData?.hash,
    });

  useContractEvent({
    addressOrName: AUDIO_CONTRACT_ADDRESS!,
    contractInterface: audioABI,
    eventName: 'AudioCreated',
    listener: (event) => {
      console.log(event);
      // setTokenId(event.tokenId);
      // setGeneration(event.generation);
      onCreateAudioNFTSucceded(
        Number.parseInt(event[0]),
        Number.parseInt(event[3])
      );
    },
  });

  const router = useRouter();

  const getUploadAudios = async () => {
    const res = await fetch('/api/audios', {
      method: 'GET',
    });
    const json = await res.json();
    setAudios(json.audios);
  };

  const getImages = async () => {
    const res = await fetch('/api/materials/images', {
      method: 'GET',
    });
    const json = await res.json();
    setImages(json.images);
  };

  useEffect(() => {
    getUploadAudios();
    getImages();
  }, []);

  useEffect(() => {
    setAudioSelected(audios[0]);
    setImageSelected(images[0]);
  }, [audios, images]);

  const onCreateAudioNFTSucceded = (tokenId: number, generation: number) => {
    // TODO:implement inherit write
    // if (!write) {
    //   return;
    // }
    // write();
    // // post data
    // console.log(audioSelected.id);
    // console.log(imageSelected.id);
    fetch('/api/audio-nfts/new', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tokenId: tokenId,
        generation: generation,
        audioId: audioSelected.id,
        imageId: imageSelected.id,
      }),
    }).then(async (res) => {
      res.json().then((data) => {
        console.log(data);
        router.push(`/mypage/audio-nfts/${data.tokenId}/onsale`);
      });
    });
  };

  // const initMetadataFirstHalf = async () => {};

  return (
    <>
      {audioSelected && imageSelected ? (
        <>
          <div>
            <div className="flex justify-center">
              <Listbox
                value={audioSelected}
                onChange={(value) => setAudioSelected(value)}
              >
                {({ open }) => (
                  <>
                    <div className="w-8/12 max-w-md">
                      <Listbox.Label className="block text-lg font-medium text-gray-700">
                        Select Audio
                      </Listbox.Label>
                      <div className="relative mt-1">
                        {/* <Listbox.Button className="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"> */}
                        <Listbox.Button className="w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm">
                          <span className="flex items-center">
                            <span className="ml-3 block truncate">
                              {audioSelected!.title}
                            </span>
                            <span className="ml-3 block truncate">
                              {audioSelected!.description}
                            </span>
                          </span>
                          <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                            <ChevronUpDownIcon
                              className="h-10 w-10 text-gray-400"
                              aria-hidden="true"
                            />
                          </span>
                        </Listbox.Button>

                        <Transition
                          show={open}
                          as={Fragment}
                          leave="transition ease-in duration-100"
                          leaveFrom="opacity-100"
                          leaveTo="opacity-0"
                        >
                          <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                            {audios.map((audio) => (
                              <Listbox.Option
                                key={audio.id}
                                className={({ active }) =>
                                  classNames(
                                    active
                                      ? 'text-white bg-indigo-600'
                                      : 'text-gray-900',
                                    'relative cursor-default select-none py-2 pl-3 pr-9'
                                  )
                                }
                                value={audio}
                              >
                                {({ selected, active }) => (
                                  <>
                                    <div className="flex items-center">
                                      {/* <img
                                      src={audio.original_image}
                                      alt=""
                                      className="h-16 w-16 flex-shrink-0 rounded-full"
                                    /> */}
                                      <span
                                        className={classNames(
                                          selected
                                            ? 'font-semibold'
                                            : 'font-normal',
                                          'ml-3 block truncate'
                                        )}
                                      >
                                        {audio.title}
                                      </span>
                                      <span
                                        className={classNames(
                                          selected
                                            ? 'font-semibold'
                                            : 'font-normal',
                                          'ml-3 block truncate'
                                        )}
                                      >
                                        -
                                      </span>
                                      <span
                                        className={classNames(
                                          selected
                                            ? 'font-semibold'
                                            : 'font-normal',
                                          'ml-3 block truncate'
                                        )}
                                      >
                                        {audio.description}
                                      </span>
                                    </div>

                                    {selected ? (
                                      <span
                                        className={classNames(
                                          active
                                            ? 'text-white'
                                            : 'text-indigo-600',
                                          'absolute inset-y-0 right-0 flex items-center pr-4'
                                        )}
                                      >
                                        <CheckIcon
                                          className="h-5 w-5"
                                          aria-hidden="true"
                                        />
                                      </span>
                                    ) : null}
                                  </>
                                )}
                              </Listbox.Option>
                            ))}
                          </Listbox.Options>
                        </Transition>
                      </div>
                    </div>
                  </>
                )}
              </Listbox>
            </div>
            <div className="flex justify-center">
              <Listbox value={imageSelected} onChange={setImageSelected}>
                {({ open }) => (
                  <>
                    <div className="w-8/12 max-w-md">
                      <Listbox.Label className="block text-lg font-medium text-gray-700">
                        Jacket Image
                      </Listbox.Label>
                      <div className="relative mt-1">
                        {/* <Listbox.Button className="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"> */}
                        <Listbox.Button className="w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm">
                          <span className="flex items-center">
                            <img
                              src={imageSelected!.imageUrl}
                              alt=""
                              className="h-100 w-100 flex-shrink-0 rounded-full"
                            />
                            <span className="ml-3 block truncate">
                              {imageSelected!.prompt}
                            </span>
                            <span className="ml-3 block truncate">
                              {imageSelected!.prompt}
                            </span>
                          </span>
                          <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                            <ChevronUpDownIcon
                              className="h-10 w-10 text-gray-400"
                              aria-hidden="true"
                            />
                          </span>
                        </Listbox.Button>
                        <Transition
                          show={open}
                          as={Fragment}
                          leave="transition ease-in duration-100"
                          leaveFrom="opacity-100"
                          leaveTo="opacity-0"
                        >
                          <Listbox.Options className="absolute z-15 mt-1 max-h-56 w-full overflow-auto grid grid-cols-2 rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                            {images.map((image) => (
                              <Listbox.Option
                                key={image.id}
                                className={({ active }) =>
                                  classNames(
                                    active
                                      ? 'text-white bg-indigo-600'
                                      : 'text-gray-900',
                                    'relative cursor-default select-none py-2 pl-3 pr-9'
                                  )
                                }
                                value={image}
                              >
                                {({ selected, active }) => (
                                  <>
                                    <div
                                      key={image.id}
                                      className="group relative"
                                    >
                                      <div className="min-h-80 aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:aspect-none lg:h-80">
                                        <img
                                          src={image.imageUrl}
                                          className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                                        />
                                      </div>
                                      <div className="mt-4 flex justify-between">
                                        <div>
                                          <h3 className="text-sm text-gray-700">
                                            {image.prompt}
                                          </h3>
                                          <p className="mt-1 text-sm text-gray-500">
                                            {image.prompt}
                                          </p>
                                        </div>
                                        <p className="text-sm font-medium text-gray-900">
                                          {image.prompt}
                                        </p>
                                      </div>
                                    </div>

                                    {selected ? (
                                      <span
                                        className={classNames(
                                          active
                                            ? 'text-white'
                                            : 'text-indigo-600',
                                          'absolute inset-y-0 right-0 flex items-center pr-4'
                                        )}
                                      >
                                        <CheckIcon
                                          className="h-5 w-5"
                                          aria-hidden="true"
                                        />
                                      </span>
                                    ) : null}
                                  </>
                                )}
                              </Listbox.Option>
                            ))}
                          </Listbox.Options>
                        </Transition>
                      </div>
                    </div>
                  </>
                )}
              </Listbox>
            </div>
            <div className="flex justify-center">
              <div className="flex justify-end border-t pt-4 w-8/12 max-w-md">
                <button
                  disabled={false}
                  type="submit"
                  className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
                  onClick={() => (audioWrite ? audioWrite() : {})}
                >
                  {isAudioLoading ? 'Creating...' : 'Create'}
                </button>
              </div>
            </div>
          </div>
          {(isAudioPrepareError || isAudioError) && (
            <div>Error: {(audioPrepareError || audioError)?.message}</div>
          )}
        </>
      ) : (
        <>
          <div>
            <h1>Loading...</h1>
          </div>
        </>
      )}
    </>
  );
};

export default PostNewAudioNFT;
