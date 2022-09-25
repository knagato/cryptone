import useSWR from "swr";
import { fetcher } from "./fetcher";
import { Altar, AltarTemplate, AudioNFT } from "./interface";

export const useAudioNFTs = () => {
  const { data } = useSWR<{
    data: AudioNFT[];
  }>(["/api/audio-nfts"], fetcher);
  return { data };
};

export const useAltars = (address?: string) => {
  let queryStr = "";
  if (address) {
    queryStr += `address=${address}`;
  }
  const { data } = useSWR<{ data: Altar[] }>(
    () => (address ? `/api/altars?${queryStr}` : null),
    fetcher
  );
  return { data };
};

export const useAltar = (altarId?: number) => {
  const { data } = useSWR<{ data: Altar }>(
    altarId !== undefined ? [`/api/altars/${altarId}`] : null,
    fetcher
  );
  return { data };
};

export const useAltarTemplates = () => {
  const { data } = useSWR<{ data: AltarTemplate[] }>(
    ["/api/altar-templates"],
    fetcher
  );
  return { data };
};
