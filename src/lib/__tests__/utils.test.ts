import { SupportedExternalLink } from '@/constant/types';

import {
  cn,
  firstName,
  formatArtists,
  formatMultipleArtists,
  getDurationText,
  getPrimaryLinks,
  getReleaseDate,
  getSourceIcon,
  getSupportedLink,
  getSupportedLinks,
  getTimestampText,
} from '../utils';

describe('Utils functions', () => {
  describe('cn function', () => {
    it('should merge class names correctly', () => {
      expect(cn('class1', 'class2')).toBe('class1 class2');
      expect(cn('class1', undefined, 'class2')).toBe('class1 class2');
    });
  });

  describe('firstName function', () => {
    it('should extract the first name from a full name', () => {
      expect(firstName('John Doe')).toBe('John');
      expect(firstName('Jane')).toBe('Jane');
    });
  });

  describe('formatArtists function', () => {
    it('should handle different types of artist inputs', () => {
      expect(formatArtists({ name: 'Single Artist' })).toBe('Single Artist');
      expect(
        formatArtists([{ name: 'Artist One' }, { name: 'Artist Two' }]),
      ).toBe('Artist One, Artist Two');
      expect(formatArtists('Artist Name')).toBe('Artist Name');
      expect(formatArtists([])).toBe('');
    });
  });

  describe('formatMultipleArtists function', () => {
    it('should format multiple artists into a string', () => {
      const artists = [{ name: 'Artist One' }, { name: 'Artist Two' }];
      expect(formatMultipleArtists(artists)).toBe('Artist One, Artist Two');
    });
  });

  describe('getReleaseDate function', () => {
    it('should format the release date correctly', () => {
      expect(getReleaseDate(new Date('2021-09-10').toISOString())).toBe(
        'Sep 9, 2021',
      );
    });
  });

  describe('getTimestampText function', () => {
    it('should return correct relative time text', () => {
      const now = new Date();
      expect(getTimestampText(now.toISOString())).toContain('seconds ago');
    });
  });

  describe('getDurationText function', () => {
    it('should convert milliseconds to a time string', () => {
      expect(getDurationText(3661000)).toBe('01:01:01');
    });
  });

  describe('getSupportedLink function', () => {
    it('should find and return the supported link', () => {
      const links = [
        { url: { resource: 'http://example.com' }, type: 'music' },
      ];
      expect(getSupportedLink(links[0])).toBeNull();
    });
  });

  describe('getSupportedLinks function', () => {
    it('should map over links and return supported ones', () => {
      const links = [
        { url: { resource: 'http://example.com' }, type: 'music' },
      ];
      expect(getSupportedLinks(links)).toEqual([null]);
    });
  });

  describe('getPrimaryLinks function', () => {
    it('should filter links by type', () => {
      const links: SupportedExternalLink[] = [
        {
          label: 'Example',
          value: 'example',
          baseUrl: 'example.com',
          url: 'http://example.com',
          type: 'music',
        },
      ];
      expect(getPrimaryLinks(links, 'music')).toEqual(links);
    });
  });

  describe('getSourceIcon function', () => {
    it('should return the correct icon for a source', () => {
      expect(getSourceIcon('spotify')).toBeDefined();
      expect(getSourceIcon('default')).toBeDefined();
    });
  });
});
