import airports from '../data/airports.json';
import { Airport } from '../data/Airport.js';

const getAirport = (iata?: string, icao?: string): Airport => {
  return iata !== undefined
    ? airports.filter(item => item.iata === iata)[0]
    : airports.filter(item => item.iata === icao)[0];
};

export default getAirport;
