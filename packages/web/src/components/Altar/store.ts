import produce from "immer";
import { Altar, AudioNFT } from "src/api/interface";
import create from "zustand";

export type JacketKey = "1" | "2" | "3" | "4";

type AltarState = {
  altar?: Altar;
  selectedJacket?: JacketKey;
  selectJacketModalOpen: boolean;
  jacketDetailModalOpen: boolean;
  actions: {
    init: (altar: Altar) => void;
    openSelectJacketModal: (key?: JacketKey) => void;
    closeSelectJacketModal: () => void;
    openJacketDetailModal: (key: JacketKey) => void;
    closeJacketDetailModal: () => void;
    selectJacket: (
      src: AudioNFT,
      onUpdate: (altar: Altar) => Promise<void>
    ) => void;
  };
};

const useStore = create<AltarState>()((set, get) => {
  return {
    altar: undefined,
    openJacketModal: false,
    selectJacketModalOpen: false,
    jacketDetailModalOpen: false,
    actions: {
      init: (altar) => {
        set({ altar });
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
      openJacketDetailModal: (key) => {
        set({ jacketDetailModalOpen: true, selectedJacket: key });
      },
      closeJacketDetailModal: () => {
        set({ jacketDetailModalOpen: false, selectedJacket: undefined });
      },
      selectJacket: (audioNFT, onUpdate) => {
        const { altar, selectedJacket } = get();
        if (!selectedJacket || !altar) return;

        const newAltar = produce(altar, (draft) => {
          draft.arrangementData[selectedJacket] = {
            id: audioNFT.id,
            title: audioNFT.title,
            jacketImageCID: audioNFT.jacketImageCID,
            previewAudioUrl: audioNFT.previewAudioUrl,
          };
        });
        set({
          altar: newAltar,
          selectJacketModalOpen: false,
        });
        onUpdate(newAltar);
      },
    },
  };
});

export { useStore };
