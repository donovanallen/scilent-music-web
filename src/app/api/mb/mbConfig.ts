import { CoverArtArchiveApi, MusicBrainzApi } from 'musicbrainz-api';

// Configure MusicBrainz API
const mbApi = new MusicBrainzApi({
  appName: 'scilent-music',
  appVersion: '0.0.1',
  appContactInfo: 'donovan@scilent.digital',
});

const coverArtApiClient = new CoverArtArchiveApi();

export { coverArtApiClient, mbApi };
