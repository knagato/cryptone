import produce from "immer";
import create from "zustand";
import { Jacket } from "./types";

export type JacketKey = "1" | "2" | "3" | "4";

type AltarState = {
  selectedJacket?: JacketKey;
  displayedJacket: Record<JacketKey, Jacket | undefined>;
  selectJacketModalOpen: boolean;
  jacketDetailModalOpen: boolean;
  actions: {
    init: () => void;
    openSelectJacketModal: (key?: JacketKey) => void;
    closeSelectJacketModal: () => void;
    openJacketDetailModal: () => void;
    closeJacketDetailModal: () => void;
    selectJacket: (src: Jacket) => void;
  };
};

const useStore = create<AltarState>()((set, get) => {
  return {
    openJacketModal: false,
    displayedJacket: {
      "1": undefined,
      "2": undefined,
      "3": undefined,
      "4": undefined,
    },
    selectJacketModalOpen: false,
    jacketDetailModalOpen: false,
    actions: {
      init: () => {
        //
      },
      openSelectJacketModal: (key) => {
        if (key) {
          set({
            selectedJacket: key,
            selectJacketModalOpen: true,
            jacketDetailModalOpen: false,
          });
          return;
        }
        set({ selectJacketModalOpen: true, jacketDetailModalOpen: false });
      },
      closeSelectJacketModal: () => {
        set({ selectJacketModalOpen: false });
      },
      openJacketDetailModal: () => {
        set({ jacketDetailModalOpen: true });
      },
      closeJacketDetailModal: () => {
        set({ jacketDetailModalOpen: false });
      },
      selectJacket: (src) => {
        const { displayedJacket, selectedJacket } = get();
        if (selectedJacket === undefined) return;

        const newJacket = produce(displayedJacket, (draft) => {
          draft[selectedJacket] = src;
        });
        set({
          displayedJacket: newJacket,
          selectJacketModalOpen: false,
        });
      },
    },
  };
});

export { useStore };
