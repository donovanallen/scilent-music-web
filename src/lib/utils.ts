import clsx, { ClassValue } from 'clsx';
import { format, formatDistanceToNow } from 'date-fns';
import { IconType } from 'react-icons';
import { FaMusic, FaSpotify } from 'react-icons/fa6';
import { twMerge } from 'tailwind-merge';

import {
  ScilentExternalLink,
  ScilentStreamingLinkType,
  SUPPORTED_EXTERNAL_LINKS,
  SupportedExternalLink,
} from '@/constant/types';

/** Merge classes with tailwind-merge with clsx full feature */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export const firstName = (name: string): string => {
  return name.split(' ').length > 1 ? name.split(' ')[0] : name;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const formatArtists = (artists: [] | any): string | never[] => {
  if (artists && artists.name) {
    return artists.name;
  } else if (Array.isArray(artists) && artists.length) {
    return formatMultipleArtists(artists);
  } else if (typeof artists === 'string') {
    return artists;
  } else {
    return '';
  }
};

export const formatMultipleArtists = (
  artistsArr: { name: string }[],
): string | never[] => {
  return artistsArr?.map((artist) => artist.name).join(', ') || [];
};

// TODO: update to handle older than a year, less than, etc.
export const getReleaseDate = (timestamp: string | Date): string => {
  return format(new Date(timestamp), 'PP');
};

export const getTimestampText = (timestamp: string): string => {
  const parsedTimestamp = new Date(timestamp) || timestamp;

  return (
    formatDistanceToNow(parsedTimestamp, {
      includeSeconds: true,
    }) + ' ago' || '0 hours ago'
  );
};

export const getDurationText = (durationMs: number): string => {
  const seconds = Math.floor((durationMs / 1000) % 60);
  const minutes = Math.floor((durationMs / 1000 / 60) % 60);
  const hours = Math.floor((durationMs / 1000 / 60 / 60) % 24);

  const timeArray = [];
  if (hours !== 0) {
    timeArray.push(hours.toString().padStart(2, '0'));
  }
  timeArray.push(minutes.toString().padStart(2, '0'));
  timeArray.push(seconds.toString().padStart(2, '0'));

  return timeArray.join(':');
};

export const TOP_ITEMS_FILTER_OPTIONS: {
  label: string;
  value: 'short_term' | 'medium_term' | 'long_term' | undefined;
  desc: string;
}[] = [
  {
    label: 'Weeks',
    value: 'short_term', // approximately last 4 weeks
    desc: 'Approximately last 4 weeks',
  },
  {
    label: 'Months',
    value: 'medium_term', // approximately last 6 months
    desc: 'Approximately last 6 months',
  },
  {
    label: 'All-time',
    value: 'long_term', // calculated from several years of data and including all new data as it becomes available
    desc: 'Calculated from several years of data and including all new data as it becomes available',
  },
];

export const getSupportedLink = (
  link: ScilentExternalLink,
): SupportedExternalLink | null => {
  const baseUrl = new URL(link.url.resource).hostname;
  const foundLink = SUPPORTED_EXTERNAL_LINKS.find((l) => l.baseUrl === baseUrl);
  if (foundLink) {
    return { ...foundLink, url: link.url.resource };
  } else {
    return null;
  }
};

export const getSupportedLinks = (
  links: ScilentExternalLink[],
): SupportedExternalLink[] => {
  return links.map((link) => getSupportedLink(link)) as SupportedExternalLink[];
};

// TODO: add other link types
export const getPrimaryLinks = (
  links: SupportedExternalLink[],
  type?: 'music' | ScilentStreamingLinkType | string,
): SupportedExternalLink[] => {
  return (
    links &&
    links.filter((link: SupportedExternalLink) => link && link.type === type)
  );
};

export const getSourceIcon = (source: string): IconType => {
  // TODO Add more source options
  switch (source.toLowerCase()) {
    case 'spotify':
      return FaSpotify;
    default:
      return FaMusic;
  }
};
