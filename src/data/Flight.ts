export type Flight = {
  ident: string;
  type: string;
  origin: string;
  destination: string;
  longitude: number;
  latitude: number;
  groundspeed: number;
  heading: number;
  waypoints: string;
  __typename: string;
};
