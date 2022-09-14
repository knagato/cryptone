import produce from "immer";
import create from "zustand";

type JacketKey = "1" | "2" | "3" | "4";

type AltarState = {
  openJacketModal: boolean;
  displayedJacket: Record<JacketKey, string | undefined>;
  actions: {
    init: () => void;
    setOpenJacketModal: (open: boolean) => void;
    setJacket: (pos: JacketKey, src: string) => void;
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
      setOpenJacketModal: (open) => {
        set({ openJacketModal: open });
      },
      setJacket: (key, src) => {
        const { displayedJacket } = get();
        const newJacket = produce(displayedJacket, (draft) => {
          draft[key] = src;
        });
        set({ displayedJacket: newJacket, openJacketModal: false });
      },
    },
  };
});

export { useStore };
