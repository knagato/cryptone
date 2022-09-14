import { Dialog, Transition } from "@headlessui/react";
import React, { FC, Fragment } from "react";
import { useStore } from "./store";

const jackets = [
  {
    id: "m1",
    title: "Music 1",
    thumbnail:
      "https://nszknao-sandbox.s3.ap-northeast-1.amazonaws.com/pastel_gaming_isometric_room/textures/Poster1_baseColor.jpeg",
  },
  {
    id: "m2",
    title: "Music 2",
    thumbnail:
      "https://nszknao-sandbox.s3.ap-northeast-1.amazonaws.com/pastel_gaming_isometric_room/textures/Poster2_baseColor.jpeg",
  },
  {
    id: "m3",
    title: "Music 3",
    thumbnail:
      "https://nszknao-sandbox.s3.ap-northeast-1.amazonaws.com/pastel_gaming_isometric_room/textures/Poster3_baseColor.jpeg",
  },
  {
    id: "m4",
    title: "Music 4",
    thumbnail:
      "https://nszknao-sandbox.s3.ap-northeast-1.amazonaws.com/pastel_gaming_isometric_room/textures/Poster4_baseColor.jpeg",
  },
];

type Props = {
  open: boolean;
  onClose: () => void;
};

export const SelectJacketModal: FC<Props> = ({ onClose, open }) => {
  const actions = useStore((state) => state.actions);

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
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
                <div>
                  <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      Select music jacket images
                    </Dialog.Title>
                    <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
                      {jackets.map((jacket) => (
                        <div key={jacket.id}>
                          <button
                            onClick={() => {
                              actions.setJacket("1", jacket.thumbnail);
                            }}
                            className="group"
                          >
                            <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg relative">
                              <img alt={jacket.title} src={jacket.thumbnail} />
                            </div>
                            <div className="mt-4 flex items-center justify-between text-base font-medium text-gray-900">
                              <h3>{jacket.title}</h3>
                            </div>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm"
                    onClick={onClose}
                  >
                    Go back to dashboard
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
