import airports from '../data/airports.json';
import { Airport } from '../data/Airport.js';

const getAirport = (iata?: string, icao?: string): Airport => {
  return iata !== undefined
    ? airports.filter(item => item.iata === iata)[0]
    : airports.filter(item => item.iata === icao)[0];
};
// const sphere = BABYLON.Mesh.CreateSphere('sphere', 100.0, 0.5, scene);
// sphere.position = new BABYLON.Vector3(latLng[0], latLng[1], latLng[2]);
// sphere.rotation.x = Math.PI;
// console.log(latLng);
// // setLocation(latLng);

// const func = async (airport: string) => {
//   console.log(Math.floor(Date.now() / 1000));
//   const response = await fetch(
//     `https://opensky-network.org/api/flights/arrival?airport=${airport}&begin=${Math.floor(
//       Date.now() / 1000
//     ) - 86400}&end=${Math.floor(Date.now() / 1000) + 86400}`
//   );
//   const val = await response.json();
//   console.log(val);
//   return val;
// };

// const data = func(airport);

export default getAirport;
