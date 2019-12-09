import { Vector3 } from '@babylonjs/core';

// Taken from stackoverflow.com
// Original Question: https://stackoverflow.com/questions/28365948/
// Answer: https://stackoverflow.com/a/28367325/5734187
// Author: John Smith (https://stackoverflow.com/users/1712905)

const getPoint = (_lat: number, _lng: number) => {
  const cosLat = Math.cos((_lat * Math.PI) / 180.0);
  const sinLat = Math.sin((_lat * Math.PI) / 180.0);
  const cosLon = Math.cos((_lng * Math.PI) / 180.0);
  const sinLon = Math.sin((_lng * Math.PI) / 180.0);
  const x = 100 * cosLat * cosLon;
  const z = 100 * cosLat * sinLon;
  const y = 100 * sinLat;

  return new Vector3(x, y, z);
};

export default getPoint;
