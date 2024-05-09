import { IconType } from 'react-icons';
import { FaApple, FaMusic, FaSoundcloud, FaSpotify } from 'react-icons/fa6';

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

export type ReleaseTypes = 'album' | 'single' | 'ep';
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
    value: 'ep',
    desc: 'Show EP releases',
    label: 'EP',
  },
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
