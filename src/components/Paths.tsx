import React, { useState, useEffect } from 'react';
import {
  Color3,
  Scene as BabylonJSScene,
  Vector3,
  Mesh
} from '@babylonjs/core';
import { Path } from '../data/Path';
import getColorFromString from '../utils/getColorFromString';
import { useBabylonScene } from 'react-babylonjs';

type Props = {
  n: number;
  data: Path[];
};

const onSceneMount = async (scene: BabylonJSScene) => {
  const mesh = scene.meshes.filter(item => item.name === 'airport');
  if (mesh.length > 0) {
    mesh.map(item => (item.billboardMode = Mesh.BILLBOARDMODE_ALL));
  }
};

const Paths: React.FC<Props> = (props: Props) => {
  const scene = useBabylonScene();
  const [component, setComponent] = useState([] as JSX.Element[]);

  useEffect(() => {
    setComponent([] as JSX.Element[]);
    const f = async () => {
      const array = await props.data.map((item: Path, index: number) => (
        <tube
          id={`path ${item.airline}`}
          name={`path`}
          path={item.traces.map(t => new Vector3(t.x, t.y, t.z))}
          radius={0.3}
        >
          <standardMaterial
            name={`path material`}
            emissiveColor={getColorFromString(item.airline)}
          ></standardMaterial>
        </tube>
      ));
      await setComponent(array);
      await onSceneMount(scene!);
    };

    f();
    console.log(component);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.data]);

  return <>{component}</>;
};

export default Paths;
