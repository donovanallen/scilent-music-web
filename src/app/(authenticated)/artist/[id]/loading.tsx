import Box from '@/components/Box';
import LoadingIndicator from '@/components/LoadingIndicator';

import Logo from '~/svg/Logo_Gray.svg';

export default function ArtistLoading() {
  return (
    <Box className='flex flex-col items-center justify-center h-full w-full gap-y-12'>
      <Logo className='w-1/4' />
      <LoadingIndicator />
      <h4>Loading artist data...</h4>
    </Box>
  );
}
