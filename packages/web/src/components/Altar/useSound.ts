import type { Howl } from "howler";
import { useCallback, useEffect, useRef, useState } from "react";

export type SpriteMap = {
  [key: string]: [number, number];
};

export type HookOptions<T = any> = T & {
  id?: string;
  volume?: number;
  playbackRate?: number;
  interrupt?: boolean;
  soundEnabled?: boolean;
  sprite?: SpriteMap;
  onload?: () => void;
};

export interface PlayOptions {
  id?: string;
  forceSoundEnabled?: boolean;
  playbackRate?: number;
}

export type PlayFunction = (options?: PlayOptions) => void;

export interface ExposedData {
  sound: Howl | null;
  stop: (id?: number) => void;
  pause: (id?: number) => void;
  duration: number | null;
}

export type ReturnedValue = [PlayFunction, ExposedData];

export default function useSound<T = any>(
  src: string | string[],
  {
    id,
    volume = 1,
    playbackRate = 1,
    soundEnabled = true,
    interrupt = false,
    onload,
    ...delegated
  }: HookOptions<T> = {} as HookOptions
) {
  const isMounted = useRef(false);

  const [duration, setDuration] = useState<number | null>(null);

  const [sound, setSound] = useState<Howl | null>(null);

  const handleLoad = useCallback(() => {
    if (typeof onload === "function") {
      // @ts-ignore
      onload.call(this);
    }

    if (isMounted.current) {
      // @ts-ignore
      setDuration(this.duration() * 1000);
    }

    // @ts-ignore
    setSound(this);
  }, [onload])

  // We want to lazy-load Howler, since sounds can't play on load anyway.
  useEffect(() => {
    import("howler").then((mod) => {
      if (!isMounted.current) {
        isMounted.current = true;

        new mod.Howl({
          src: Array.isArray(src) ? src : [src],
          volume,
          rate: playbackRate,
          onload: handleLoad,
          ...delegated,
        });
      }
    });

    return () => {
      isMounted.current = false;
    };
  }, [delegated, handleLoad, playbackRate, src, volume]);

  // Whenever volume/playbackRate are changed, change those properties
  // on the sound instance.
  useEffect(() => {
    if (sound) {
      sound.volume(volume);
      sound.rate(playbackRate);
    }
    // A weird bug means that including the `sound` here can trigger an
    // error on unmount, where the state loses track of the sprites??
    // No idea, but anyway I don't need to re-run this if only the `sound`
    // changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [volume, playbackRate]);

  const play: PlayFunction = useCallback(
    (options: PlayOptions = {}) => {
      if (!sound || (!soundEnabled && !options.forceSoundEnabled)) {
        return;
      }

      if (interrupt) {
        sound.stop();
      }

      if (options.playbackRate) {
        sound.rate(options.playbackRate);
      }

      sound.play(options.id);
    },
    [sound, soundEnabled, interrupt]
  );

  const stop = useCallback(
    (id?: number) => {
      if (!sound) {
        return;
      }
      sound.stop(id);
    },
    [sound]
  );

  const pause = useCallback(
    (id?: number) => {
      if (!sound) {
        return;
      }
      sound.pause(id);
    },
    [sound]
  );

  const returnedValue: ReturnedValue = [
    play,
    {
      sound,
      stop,
      pause,
      duration,
    },
  ];

  return returnedValue;
}

export { useSound };
