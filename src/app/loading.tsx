import Box from '@/components/Box';

import Logo from '~/svg/Logo_Full_Gray.svg';

export default function Loading() {
  // Or a custom loading skeleton component
  return (
    <Box className='flex flex-col items-center justify-center h-full w-full px-64 gap-y-12'>
      <Logo />
      <h4>Loading...</h4>
    </Box>
  );
}
