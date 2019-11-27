// Taken from stackoverflow.com
// Original Question: https://stackoverflow.com/questions/28365948/
// Answer: https://stackoverflow.com/a/28367325/5734187
// Author: John Smith (https://stackoverflow.com/users/1712905)

const getPoint = (_lat: number, _lng: number, rad: number) => {
  const cosLat = Math.cos((_lat * Math.PI) / 180.0);
  const sinLat = Math.sin((_lat * Math.PI) / 180.0);
  const cosLon = Math.cos((_lng * Math.PI) / 180.0);
  const sinLon = Math.sin((_lng * Math.PI) / 180.0);
  const x = -rad * cosLat * cosLon;
  const z = -rad * cosLat * sinLon;
  const y = rad * sinLat;

  return [x, y, z];
};

export default getPoint;
