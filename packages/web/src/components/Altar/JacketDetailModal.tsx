import { Dialog, Transition } from "@headlessui/react";
import React, { FC, Fragment } from "react";
import { useHowler } from "src/hooks/useHowler";
import { useStore } from "./store";

type Props = {};

export const JacketDetailModal: FC<Props> = () => {
  const selectedJacket = useStore((state) => state.selectedJacket);
  const altar = useStore((state) => state.altar);
  const open = useStore((state) => state.jacketDetailModalOpen);
  const actions = useStore((state) => state.actions);

  const [play, { stop }] = useHowler(
    selectedJacket
      ? altar?.arrangementData?.[selectedJacket]?.previewAudioUrl
      : undefined
  );

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={() => actions.closeJacketDetailModal()}
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
                    Music jacket
                  </Dialog.Title>
                  <div className="mt-6">
                    <button
                      onClick={() => actions.openSelectJacketModal()}
                      className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                    >
                      Change jacket
                    </button>
                    <div className="mt-4 flex space-x-2">
                      <button
                        onClick={() => play()}
                        className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                      >
                        play
                      </button>
                      <button
                        onClick={() => stop()}
                        className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                      >
                        stop
                      </button>
                    </div>
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
