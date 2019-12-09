import { Color3, Scene as BabylonJSScene, Mesh } from '@babylonjs/core';
import React, { useContext, useEffect } from 'react';
import { Airport } from '../data/Airport';
import getPoint from '../utils/getPoint';
import { useBabylonScene } from 'react-babylonjs';

type Props = {
  n: number;
  data: Airport[];
};

const onSceneMount = async (scene: BabylonJSScene) => {
  const mesh = scene.meshes.filter(item => item.name === 'airport');
  if (mesh.length > 0) {
    mesh.map(item => (item.billboardMode = Mesh.BILLBOARDMODE_ALL));
  }
};

const Airports: React.FC<Props> = (props: Props) => {
  const scene = useBabylonScene();
  console.log(scene);

  const airports = props.data.filter((item: any) => item.selected > 0);

  useEffect(() => {
    const f = async () => {
      await onSceneMount(scene!);
    };
    f();
  });
  return (
    <>
      {airports.map((item: Airport, index: number) => {
        const currentPosition = getPoint(item.latitude, item.longitude);
        return (
          <>
            <icoSphere
              id={`airport ${item.icao}`}
              name={`airport`}
              radius={item.large ? 3 : 1.5}
              subdivisions={1}
              position={currentPosition}
            >
              <standardMaterial
                name={`airport ${index} material`}
                emissiveColor={new Color3(1, 1, 1)}
              ></standardMaterial>
            </icoSphere>
            <plane
              id={`airport ${item.icao}`}
              name={`airport`}
              width={10}
              height={10}
              position={currentPosition.scale(1.05)}
            >
              <advancedDynamicTexture
                name="dialogTexture"
                height={1024}
                width={1024}
                createForParentMesh={true}
              >
                <rectangle name="rect-1" height={150} width={150}>
                  <rectangle>
                    <babylon-button
                      width={10}
                      height={10}
                      name={`airport ${item.icao}`}
                    >
                      <textBlock
                        text={item.iata}
                        fontFamily="Segoe UI"
                        fontStyle="bold"
                        fontSize={300}
                        color="#222222"
                        outlineWidth={25}
                        outlineColor={'white'}
                      />
                    </babylon-button>
                  </rectangle>
                </rectangle>
              </advancedDynamicTexture>
            </plane>
          </>
        );
      })}
    </>
  );
};

export default Airports;
