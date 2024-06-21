import { useEffect, useState } from 'react';

import logger from '@/lib/logger';

import getAPIStatus from '@/actions/getAPIStatus';

export const useAPIStatus = () => {
  const [apiEnabled, setApiEnabled] = useState(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      setIsConnecting(true);
      const status = await getAPIStatus();
      return status;
    })()
      .then((s) => {
        setApiEnabled(s);
      })
      .catch((error) => {
        setHasError(true);
        logger(error, 'ERROR Connecting to Scilent Music API');
      })
      .finally(() => {
        setIsConnecting(false);
      });
  }, []);

  return {
    apiEnabled,
    loading: isConnecting && !hasError,
    error: hasError,
  };
};
