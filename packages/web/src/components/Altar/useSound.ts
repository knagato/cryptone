import type { Howl } from "howler";
import { useEffect, useRef } from "react";

export type SpriteMap = {
  [key: string]: [number, number];
};

export type HookOptions<T = any> = T & {
  id?: string;
  volume?: number;
  playbackRate?: number;
};

export interface PlayOptions {
  id?: string;
  playbackRate?: number;
}

export type PlayFunction = (options?: PlayOptions) => void;

export interface ExposedData {
  instance: Howl | null;
  stop: () => void;
}

export type ReturnedValue = [PlayFunction, ExposedData];

export const useSound = <T = any>(
  src?: string | string[],
  {
    id,
    volume = 1,
    playbackRate = 1,
    ...delegated
  }: HookOptions<T> = {} as HookOptions
): ReturnedValue => {
  const instance = useRef<Howl | null>(null);

  // We want to lazy-load Howler, since sounds can't play on load anyway.
  useEffect(() => {
    if (!src) return;
    if (instance.current) return;

    import("howler").then((mod) => {
      instance.current = new mod.Howl({
        src: Array.isArray(src) ? src : [src],
        volume,
        rate: playbackRate,
        ...delegated,
      });
    });
  }, [delegated, playbackRate, src, volume]);

  useEffect(() => {
    instance.current?.volume(volume);
    instance.current?.rate(playbackRate);
  }, [volume, playbackRate]);

  const play = () => {
    instance.current?.play(id);
  };

  const stop = () => {
    instance.current?.stop();
  };

  return [play, { instance: instance.current, stop }];
};
