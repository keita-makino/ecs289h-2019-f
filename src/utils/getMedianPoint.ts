import { Vector3 } from 'babylonjs';

const getMedianPoint = (org: Vector3, dst: Vector3) => {
  const point = org.add(dst).scale(0.5);
  const distancePoints = Vector3.Distance(org, dst);
  const distanceMedian = Vector3.Distance(point, Vector3.Zero());
  return point.scale(((1 + distancePoints / 100) * 100) / distanceMedian);
};

export default getMedianPoint;
