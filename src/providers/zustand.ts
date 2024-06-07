// import { Track } from '@/types/types';
import { TrackItem } from '@spotify/web-api-ts-sdk';
import { create } from 'zustand';

interface ZustandState {
  // searchQuery: string;
  // setSearchQuery: (val: string) => void;
  currentTrack: TrackItem | null;
  setCurrentTrack: (track: TrackItem) => void;
}

export const useStore = create<ZustandState>((set) => ({
  // searchQuery: '',
  // setSearchQuery: (val: string) =>
  //   set(() => ({
  //     searchQuery: val,
  //   })),
  currentTrack: null,
  setCurrentTrack: (track: TrackItem) =>
    set(() => ({
      currentTrack: track,
    })),
}));
