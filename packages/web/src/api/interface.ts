import {
  Altar as PrismaAltar,
  AltarTemplate as PrismaAltarTemplate,
  AudioNFT as PrismaAudioNFT,
  User as PrismaUser,
} from "@prisma/client";

export type AudioNFT = PrismaAudioNFT & {
  originalAudioUrl: string | null;
  previewAudioUrl: string;
};

type JacketKey = "1" | "2" | "3" | "4";
export type Altar = PrismaAltar & {
  template: PrismaAltarTemplate;
  creator: PrismaUser;
  arrangementData: Record<
    JacketKey,
    {
      id: number;
      title: string;
      jacketImageCID: string;
      previewAudioUrl: string;
    }
  >;
};

export type AltarTemplate = PrismaAltarTemplate;
