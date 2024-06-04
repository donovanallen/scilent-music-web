import { AudioFeatures } from '@spotify/web-api-ts-sdk';

import {
  AUDIO_FEATURES,
  Aura,
  AURAS,
  ScilentAudioFeatures,
} from '@/constant/types';

export const analyzeAudioFeatures = (
  audioFeatures: AudioFeatures[],
):
  | {
      averages: any;
      frequencies: any;
    }
  | undefined => {
  const count = audioFeatures?.length;

  if (!audioFeatures || count < 1) {
    return;
  }

  const totals = audioFeatures.reduce(
    (acc, audio) => {
      return {
        acousticness: acc?.acousticness + audio.acousticness,
        danceability: acc?.danceability + audio.danceability,
        duration_ms: acc?.duration_ms + audio.duration_ms,
        energy: acc?.energy + audio.energy,
        instrumentalness: acc?.instrumentalness + audio.instrumentalness,
        liveness: acc?.liveness + audio.liveness,
        loudness: acc?.loudness + audio.loudness,
        speechiness: acc?.speechiness + audio.speechiness,
        tempo: acc?.tempo + audio.tempo,
        valence: acc?.valence + audio.valence,
      };
    },
    {
      acousticness: 0,
      danceability: 0,
      duration_ms: 0,
      energy: 0,
      instrumentalness: 0,
      liveness: 0,
      loudness: 0,
      speechiness: 0,
      tempo: 0,
      valence: 0,
    },
  );

  const averages = Object.entries(totals).reduce((acc, [key, value]) => {
    acc[key] = parseFloat(`${value / count}`).toFixed(2);
    return acc;
  }, {} as any);

  const occurrences = audioFeatures.reduce(
    (acc, audio) => {
      acc.key[audio.key] = (acc.key[audio.key] || 0) + 1;
      acc.mode[audio.mode] = (acc.mode[audio.mode] || 0) + 1;
      acc.time_signature[audio.time_signature] =
        (acc.time_signature[audio.time_signature] || 0) + 1;
      return acc;
    },
    {
      key: {} as any,
      mode: {} as any,
      time_signature: {} as any,
    },
  );

  const mostFrequent = (obj: any) => {
    const maxOccurrences = Math.max(...(Object.values(obj) as number[]));
    return Object.keys(obj).find((key) => obj[key] === maxOccurrences);
  };

  const frequencies = {
    key: mostFrequent(occurrences.key),
    mode: mostFrequent(occurrences.mode),
    time_signature: mostFrequent(occurrences.time_signature),
  };

  return { averages, frequencies };
};

export const getAudioFeature = (name: string): ScilentAudioFeatures => {
  const feature = AUDIO_FEATURES.find(
    (a) => a.value.toLowerCase() === name.toLowerCase(),
  );

  return feature as ScilentAudioFeatures;
};

export const getAura = (name: string): Aura => {
  const aura = AURAS.find((a) => a.name.toLowerCase() === name.toLowerCase());
  return aura as Aura;
};
