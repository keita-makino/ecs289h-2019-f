import { Color3 } from '@babylonjs/core';

const getColorFromString = (text: string) => {
  const array = text
    .split('')
    .map(item => ((item.charCodeAt(0) * 100) % 256) / 256);
  return new Color3(array[0], array[1], array[2]);
};

export default getColorFromString;
