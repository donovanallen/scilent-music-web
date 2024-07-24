'use client';

import { TrackItem } from '@spotify/web-api-ts-sdk';
import {
  createContext,
  // Dispatch,
  // SetStateAction,
  // useCallback,
  useContext,
  useState,
} from 'react';

import { useStore } from './zustand';

interface TrackProviderState {
  currentTrackAudio: HTMLAudioElement | null;
  isPlaying: boolean;
  duration: number;
  currentTime: number;
  currentTrack: TrackItem | null;
  // play: () => Promise<void>;
  // pause: () => void;
  // togglePlay: () => Promise<void>;
  // slider: number;
  // setSlider: Dispatch<SetStateAction<number>>;
  // drag: number;
  // setDrag: Dispatch<SetStateAction<number>>;
}

const PlayerContext = createContext<TrackProviderState>({} as any);

interface Props {
  children: React.ReactNode;
}

export default function TrackPlayerProvider({ children }: Props) {
  const { currentTrack } = useStore();

  const [currentTrackAudio, _setCurrentTrackAudio] =
    useState<HTMLAudioElement | null>(null);
  const [isPlaying, _setIsPlaying] = useState(false);
  const [duration, _setDuration] = useState(0);
  const [currentTime, _setCurrentTime] = useState(0);
  // const [slider, setSlider] = useState(1);
  // const [drag, setDrag] = useState(0);

  // const togglePlay = async () => {
  //   if (isPlaying) pause();
  //   else await play();
  // };

  // const play = useCallback(async () => {
  //   setIsPlaying(true);
  //   await currentTrackAudio?.play();
  // }, [currentTrackAudio]);

  // const pause = useCallback(() => {
  //   setIsPlaying(false);
  //   currentTrackAudio?.pause();
  // }, [currentTrackAudio]);

  // useEffect(() => {
  //   if (!currentTrack) return;
  //   if (isPlaying) {
  //     pause();
  //     setCurrentTrackAudio(null);
  //   }
  //   const tempAudio = new Audio(
  //     'preview_url' in currentTrack
  //       ? currentTrack.preview_url || undefined
  //       : undefined,
  //   );

  //   const setAudioData = () => {
  //     setDuration(tempAudio.duration);
  //     setCurrentTime(tempAudio.currentTime);
  //   };

  //   const setAudioTime = () => {
  //     const currTime = tempAudio.currentTime;
  //     setCurrentTime(currTime);
  //     setSlider(
  //       currTime
  //         ? Number(((currTime * 100) / tempAudio.duration).toFixed(1))
  //         : 0,
  //     );
  //   };

  //   tempAudio.addEventListener('loadeddata', setAudioData);
  //   tempAudio.addEventListener('timeupdate', setAudioTime);
  //   tempAudio.preload = 'none';

  //   setCurrentTrackAudio(tempAudio);

  //   return () => {
  //     pause();
  //     setCurrentTrackAudio(null);
  //   };
  // }, [currentTrack, isPlaying, pause]);

  // useEffect(() => {
  //   const handlePlay = async () => {
  //     if (currentTrackAudio) {
  //       await play();
  //     }
  //   };
  //   handlePlay();
  // }, [currentTrackAudio, play]);

  // useEffect(() => {
  //   if (currentTrackAudio && drag) {
  //     currentTrackAudio.currentTime = Math.round(
  //       (drag * currentTrackAudio.duration) / 100,
  //     );
  //   }
  // }, [currentTrackAudio, drag]);

  return (
    <PlayerContext.Provider
      value={{
        currentTrackAudio,
        isPlaying,
        duration,
        currentTime,
        currentTrack,
        // play,
        // pause,
        // togglePlay,
        // slider,
        // setSlider,
        // drag,
        // setDrag,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export const usePlayer = () => useContext(PlayerContext);
