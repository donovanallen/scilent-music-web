import logger from '@/lib/logger';

const BASE_URL = 'http://localhost:5001/mb'; // ! TODO: add env's

const getAPIStatus = async (): Promise<boolean> => {
  const response = await fetch(`${BASE_URL}/ping`);
  if (!response) {
    return false;
  }
  logger({ response }, 'getAPIStatus.ts line 8');
  return response.ok;
};

export default getAPIStatus;
