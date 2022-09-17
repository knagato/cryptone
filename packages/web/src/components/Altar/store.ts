import produce from "immer";
import create from "zustand";
import { Jacket } from "./types";

export type JacketKey = "1" | "2" | "3" | "4";

type AltarState = {
  selectedJacket?: JacketKey;
  displayedJacket: Record<JacketKey, Jacket | undefined>;
  actions: {
    init: () => void;
    setOpenJacketModal: (key?: JacketKey) => void;
    setJacket: (src: Jacket) => void;
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
    actions: {
      init: () => {
        //
      },
      setOpenJacketModal: (key) => {
        set({ selectedJacket: key });
      },
      setJacket: (src) => {
        const { displayedJacket, selectedJacket } = get();
        if (selectedJacket === undefined) return;

        const newJacket = produce(displayedJacket, (draft) => {
          draft[selectedJacket] = src;
        });
        set({ displayedJacket: newJacket, selectedJacket: undefined });
      },
    },
  };
});

export { useStore };
