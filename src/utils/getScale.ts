import { Vector3 } from '@babylonjs/core';

const getAngle = (vec1: Vector3, vec2: Vector3) => {
  return Vector3.Distance(vec1, vec2) < 0.0001
    ? 0
    : Math.acos(Vector3.Dot(vec1.normalize(), vec2.normalize()));
};

const getScale = (org: Vector3, dst: Vector3, current: Vector3) => {
  const progress =
    Math.PI *
    (getAngle(org, current) /
      (getAngle(org, current) + getAngle(current, dst)));
  const distancePoints = getAngle(org, dst);
  return 1 + (Math.sin(progress) * distancePoints) / 2;
};

export default getScale;
