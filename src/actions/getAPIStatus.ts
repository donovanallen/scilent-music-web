import logger from '@/lib/logger';

// const BASE_URL = 'http://localhost:5001/mb'; // ! TODO: add env's
const NEXT_API = '/api/mb';

const getAPIStatus = async (): Promise<boolean> => {
  const response = await fetch(`${NEXT_API}/ping`);
  logger({ response });
  return response.ok;
};

export default getAPIStatus;
