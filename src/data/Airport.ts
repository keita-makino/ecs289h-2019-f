import airports from './airports.json';

export type Airport = {
  icao: string;
  iata: string;
  latitude: number;
  longitude: number;
  large: boolean;
  selected: number;
  __typename: string;
};

export const icaoList = airports.map(item => item.icao);
export const iataList = airports.map(item => item.icao);
