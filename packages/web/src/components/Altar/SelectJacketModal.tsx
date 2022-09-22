import { Dialog, Transition } from "@headlessui/react";
import React, { FC, Fragment } from "react";
import { useStore } from "./store";
import { Jacket } from "./types";

const audios: Jacket[] = [
  {
    id: "m1",
    title: "Music 1",
    thumbnailSrc:
      "https://nszknao-sandbox.s3.ap-northeast-1.amazonaws.com/pastel_gaming_isometric_room/textures/Poster1_baseColor.jpeg",
    audioSrc:
      "https://nszknao-sandbox.s3.ap-northeast-1.amazonaws.com/cat-life.mp3",
  },
  {
    id: "m2",
    title: "Music 2",
    thumbnailSrc:
      "https://nszknao-sandbox.s3.ap-northeast-1.amazonaws.com/pastel_gaming_isometric_room/textures/Poster2_baseColor.jpeg",
    audioSrc:
      "https://nszknao-sandbox.s3.ap-northeast-1.amazonaws.com/cat-life.mp3",
  },
  {
    id: "m3",
    title: "Music 3",
    thumbnailSrc:
      "https://nszknao-sandbox.s3.ap-northeast-1.amazonaws.com/pastel_gaming_isometric_room/textures/Poster3_baseColor.jpeg",
    audioSrc:
      "https://nszknao-sandbox.s3.ap-northeast-1.amazonaws.com/cat-life.mp3",
  },
  {
    id: "m4",
    title: "Music 4",
    thumbnailSrc:
      "https://nszknao-sandbox.s3.ap-northeast-1.amazonaws.com/pastel_gaming_isometric_room/textures/Poster4_baseColor.jpeg",
    audioSrc:
      "https://nszknao-sandbox.s3.ap-northeast-1.amazonaws.com/cat-life.mp3",
  },
];

type Props = {};

export const SelectJacketModal: FC<Props> = ({}) => {
  const actions = useStore((state) => state.actions);
  const open = useStore((state) => state.selectJacketModalOpen);

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={() => actions.closeSelectJacketModal()}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                <div className="mt-3 text-center sm:mt-5">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Select music jacket images
                  </Dialog.Title>
                  <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
                    {audios.map((audio) => (
                      <div key={audio.id}>
                        <button
                          onClick={() => {
                            actions.selectJacket(audio);
                          }}
                          className="group"
                        >
                          <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg relative">
                            <img alt={audio.title} src={audio.thumbnailSrc} />
                          </div>
                          <div className="mt-4 flex items-center justify-between text-base font-medium text-gray-900">
                            <h3>{audio.title}</h3>
                          </div>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
