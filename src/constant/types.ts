import { DiscoBall, Lectern } from '@phosphor-icons/react/dist/ssr';
import { DefaultSession } from 'next-auth';
import { IconType } from 'react-icons';
import { BiPulse } from 'react-icons/bi';
import { FaApple, FaMusic, FaSoundcloud, FaSpotify } from 'react-icons/fa6';
import { GiAcousticMegaphone, GiRoundKnob } from 'react-icons/gi';
import { LuUnplug } from 'react-icons/lu';
import {
  PiAtom,
  PiGuitar,
  PiMetronome,
  PiSliders,
  PiTicket,
} from 'react-icons/pi';
import { TbMoodUp } from 'react-icons/tb';

export interface AuthSession extends Omit<DefaultSession, 'user'> {
  user: AuthUser;
}
export interface ArtistQueryResult {
  id: string;
  name: string;
  sourceId: string;
  type: string;
  country: string;
  desc: string;
  genres: { name: string }[];
  rels: any[];
  releaseGroups: MBReleaseGroup[];
}

export interface MBReleaseGroup {
  'first-release-date': string;
  'primary-type': string;
  'secondary-types': any[];
  title: string;
  id: string;
  genres: { name: string }[];
  artwork: { url: string };
}

// SCILENT API TYPES
export interface ScilentAlbum {
  id: string;
  title: string;
  artwork: { url: string };
  genres: string[];
  type: string;
  subTypes: any[] | string[];
  artist?: ArtistQueryResult;
  releaseDate: Date | string;
  timestamp?: Date | string;
}

export interface ScilentExternalLink {
  type: string;
  url: {
    resource: string;
  };
}

export interface ScilentArtist {
  id: string;
  name: string;
  type: string;
  country: string;
  desc: string;
  sourceId: string;
  genres: string[];
  externalLinks: ScilentExternalLink[];
  relationTypes: Set<ScilentStreamingLinkType>;
  releases: ScilentAlbum[];
}

export type AuthUser = {
  name: string;
  email: string;
  image: string;
  access_token: string;
  token_type: string;
  expires_at: number;
  expires_in: number;
  refresh_token: string;
  scope: string;
  id: string;
};

export type FilterValue = 'short_term' | 'medium_term' | 'long_term';
export type SearchFilterValue = 'artist' | 'album' | 'track' | null;
export type FilterOption = {
  value?: FilterValue | SearchFilterValue | ReleaseTypes;
  label: string;
  desc: string;
};

export type SearchTypes = 'artist' | 'album' | 'track';
export const SearchFilters = [
  {
    value: 'artist',
    desc: 'Show artists in search results',
    label: 'Artists',
  },
  {
    value: 'album',
    desc: 'Show albums in search results',
    label: 'Albums',
  },
  {
    value: 'track',
    desc: 'Show tracks in search results',
    label: 'Tracks',
  },
];

export type ReleaseTypes =
  | 'album'
  | 'single'
  | 'compilation'
  | 'appears_on'
  | 'ep';
export const ReleaseFilters: {
  value: ReleaseTypes;
  desc: string;
  label: string;
}[] = [
  {
    value: 'album',
    desc: 'Show album releases',
    label: 'Albums',
  },
  {
    value: 'single',
    desc: 'Show single releases',
    label: 'Singles',
  },
  {
    value: 'compilation',
    desc: 'Show compilations',
    label: 'Compilations',
  },
  {
    value: 'appears_on',
    desc: 'Show artist features/appearances',
    label: 'Appears On',
  },
  // {
  //   value: 'ep',
  //   desc: 'Show EP releases',
  //   label: 'EP',
  // },
];

export const ReleaseSubTypes = [
  'compilation',
  'dj-mix',
  'ep',
  'live',
  'mixtape/street',
  'remix',
]; // secondary_types[]

export type SupportedExternalLink = {
  label: string;
  value: string;
  icon?: IconType;
  baseUrl: string;
  url?: string;
  type: ScilentStreamingLinkType | 'music';
};

export type ScilentStreamingLinkType =
  | 'free streaming'
  | 'purchase for download'
  | 'streaming'
  | 'soundcloud'
  | 'youtube';

export const SCILENT_STREAMING_LINK_TYPES = [
  'free streaming',
  'purchase for download',
  'streaming',
  'soundcloud',
  'youtube',
];

export const SUPPORTED_EXTERNAL_LINKS: SupportedExternalLink[] = [
  {
    label: 'Spotify',
    value: 'spotify',
    icon: FaSpotify,
    baseUrl: 'open.spotify.com',
    type: 'music',
  },
  {
    label: 'Apple Music',
    value: 'apple',
    icon: FaApple,
    baseUrl: 'music.apple.com',
    type: 'music',
  },
  {
    label: 'Tidal',
    value: 'tidal',
    icon: FaMusic,
    baseUrl: 'tidal.com',
    type: 'music',
  },
  {
    label: 'SoundCloud',
    value: 'soundcloud',
    icon: FaSoundcloud,
    baseUrl: 'soundcloud.com',
    type: 'music',
  },
  // {
  //   label: 'Deezer',
  //   value: 'deezer',
  //   icon: FaDeezer,
  //   baseUrl: 'www.deezer.com',
  //
  // },
  // {
  //   label: 'Twitter/X',
  //   value: 'twitter',
  //   icon: FaTwitter,
  //   baseUrl: 'twitter.com',
  //
  // },
  // {
  //   label: 'Facebook',
  //   value: 'facebook',
  //   icon: FaFacebook,
  //   baseUrl: 'www.facebook.com',
  //
  // },
  // {
  //   label: 'Instagram',
  //   value: 'instagram',
  //   icon: FaInstagram,
  //   baseUrl: 'www.instagram.com',
  //
  // },
  // {
  //   label: 'Youtube',
  //   value: 'youtube',
  //   icon: FaYoutube,
  //   baseUrl: 'www.youtube.com',
  //
  // },
  // {
  //   label: 'AllMusic',
  //   value: 'allmusic',
  //   icon: FaMusic,
  //   baseUrl: 'www.allmusic.com',
  //
  // },
  // {
  //   label: 'Discogs',
  //   value: 'discogs',
  //   icon: FaMusic,
  //   baseUrl: 'www.discogs.com',
  //
  // },
  // {
  //   label: 'LastFm',
  //   value: 'lastfm',
  //   icon: FaLastfm,
  //   baseUrl: 'www.last.fm',
  //
  // },
  // {
  //   label: 'SongKick',
  //   value: 'songkick',
  //   icon: FaMusic,
  //   baseUrl: 'www.songkick.com',
  //
  // },
  // {
  //   label: 'Genius',
  //   value: 'genius',
  //   icon: FaMusic,
  //   baseUrl: 'www.genius.com',
  //
  // },
];

export type Aura = {
  id: number;
  name: string;
  label: string;
  description: string;
  icon: IconType;
  visualization?: string;
  features: string[];
};

export const AURAS: Aura[] = [
  {
    id: 1,
    name: 'mood',
    label: 'Mood',
    description: 'Feel + Energy + Groove',
    icon: BiPulse,
    visualization: 'multi_radial',
    features: ['energy', 'danceability', 'valence'],
  },
  {
    id: 2,
    name: 'context',
    label: 'Context',
    description: 'Live factor + acoustic + instrumental',
    icon: GiAcousticMegaphone,
    visualization: 'radar',
    features: ['liveness', 'acousticness', 'instrumentalness'],
  },
  {
    id: 3,
    name: 'property',
    label: 'Properties',
    description: '',
    icon: PiSliders,
    // visualization: 'radar',
    features: ['tempo', 'loudness', 'speechiness'],
  },
];

export interface ScilentAudioFeatures {
  id: number;
  value: string;
  label: string;
  labelShort: string;
  type: string;
  icon: IconType;
  description: string;
  descriptionFull: string;
  visualization: string;
  scale: {
    min: number;
    max: number;
  };
  content?: any;
}

export const AUDIO_FEATURES: ScilentAudioFeatures[] = [
  {
    id: 1,
    value: 'energy',
    label: 'Energy', // 'Energy',
    labelShort: 'Energy', // 'Energy',
    type: 'mood',
    icon: PiAtom,
    description: 'Represents the intensity and activity level of a track.',
    descriptionFull:
      'Energy is a measure from 0.0 to 1.0 and represents a perceptual measure of intensity and activity. Typically, energetic tracks feel fast, loud, and noisy. For example, death metal has high energy, while a Bach prelude scores low on the scale. Perceptual features contributing to this attribute include dynamic range, perceived loudness, timbre, onset rate, and general entropy.',
    visualization: 'radial',
    scale: {
      min: 0,
      max: 1,
    },
  },
  {
    id: 2,
    value: 'danceability',
    label: 'Groove Factor', // 'Danceability',
    labelShort: 'Groove', // 'Danceability',
    type: 'mood',
    icon: DiscoBall as IconType,
    description:
      'Measures the suitability of a track for dancing based on a combination of musical elements.',
    descriptionFull:
      'Danceability describes how suitable a track is for dancing based on a combination of musical elements including tempo, rhythm stability, beat strength, and overall regularity. A value of 0.0 is least danceable and 1.0 is most danceable.',
    visualization: 'radial',
    scale: {
      min: 0,
      max: 1,
    },
  },
  {
    id: 3,
    value: 'valence',
    label: 'Feel', // 'Valence',
    labelShort: 'Feel', // 'Valence',
    type: 'mood',
    icon: TbMoodUp,
    description: 'Measures the musical positiveness conveyed by a track.',
    descriptionFull:
      'A measure from 0.0 to 1.0 describing the musical positiveness conveyed by a track. Tracks with high valence sound more positive (e.g. happy, cheerful, euphoric), while tracks with low valence sound more negative (e.g. sad, depressed, angry).',
    visualization: 'radial',
    scale: {
      min: 0,
      max: 1,
    },
  },
  {
    id: 4,
    value: 'liveness',
    label: 'Live Factor', // 'Liveness',
    labelShort: 'Live', // 'Liveness',
    type: 'context',
    icon: PiTicket,
    description:
      'indicates the presence of a live audience in a track or the likelihood of the track being performed live.',
    descriptionFull:
      'Detects the presence of an audience in the recording. Higher liveness values represent an increased probability that the track was performed live. A value above 0.8 provides strong likelihood that the track is live.',
    visualization: 'radial',
    scale: {
      min: 0,
      max: 1,
    },
  },
  {
    id: 5,
    value: 'acousticness',
    label: 'Acoustic', // 'Acousticness',
    labelShort: 'Acoustic', // 'Acousticness',
    type: 'context',
    icon: LuUnplug,
    description: 'Measures the probability of a track being acoustic.',
    descriptionFull:
      'A confidence measure from 0.0 to 1.0 of whether the track is acoustic. 1.0 represents high confidence the track is acoustic.',
    visualization: 'radial',
    scale: {
      min: 0,
      max: 1,
    },
  },
  {
    id: 6,
    value: 'instrumentalness',
    label: 'Instrumental', // 'Instrumentation',
    labelShort: 'Instrumental', // 'Instrumentation',
    type: 'context',
    icon: PiGuitar,
    description: 'Measures the likelihood of a track being instrumental.',
    descriptionFull:
      'Predicts whether a track contains no vocals. "Ooh" and "aah" sounds are treated as instrumental in this context. Rap or spoken word tracks are clearly "vocal". The closer the instrumentalness value is to 1.0, the greater likelihood the track contains no vocal content. Values above 0.5 are intended to represent instrumental tracks, but confidence is higher as the value approaches 1.0.',
    visualization: 'radial',
    scale: {
      min: 0,
      max: 1,
    },
  },
  {
    id: 7,
    value: 'tempo',
    label: 'BPM (Beats Per Minute)', // 'Tempo',
    labelShort: 'BPM', // 'Tempo',
    type: 'property',
    icon: PiMetronome,
    description: 'Represents the overall beats per minute (BPM) of a track.',
    descriptionFull:
      'The overall estimated tempo of a track in beats per minute (BPM). In musical terminology, tempo is the speed or pace of a given piece and derives directly from the average beat duration.',
    visualization: 'gauge',
    scale: {
      min: 0,
      max: 200,
    },
  },
  {
    id: 8,
    value: 'loudness',
    label: 'Loudness (dB)',
    labelShort: 'Loudness',
    type: 'property',
    icon: GiRoundKnob,
    description: 'Measures the overall loudness of a track in decibels (dB).',
    descriptionFull:
      'The overall loudness of a track in decibels (dB). Loudness values are averaged across the entire track and are useful for comparing relative loudness of tracks. Loudness is the quality of a sound that is the primary psychological correlate of physical strength (amplitude). Values typically range between -60 and 0 db.',
    visualization: 'number',
    scale: {
      min: -80,
      max: 0,
    },
  },
  {
    id: 9,
    value: 'speechiness',
    label: 'Speech Factor', // 'Speechiness',
    labelShort: 'Speech', // 'Speechiness',
    type: 'property',
    icon: Lectern as IconType,
    description: 'Measures the presence of spoken words in a track.',
    descriptionFull:
      'Speechiness detects the presence of spoken words in a track. The more exclusively speech-like the recording (e.g. talk show, audio book, poetry), the closer to 1.0 the attribute value. Values above 0.66 describe tracks that are probably made entirely of spoken words. Values between 0.33 and 0.66 describe tracks that may contain both music and speech, either in sections or layered, including such cases as rap music. Values below 0.33 most likely represent music and other non-speech-like tracks.',
    visualization: 'number',
    scale: {
      min: 0,
      max: 1,
    },
  },
];
