import React, { useEffect } from 'react';
import { Flight } from '../data/Flight';
import {
  Color3,
  Scene as BabylonJSScene,
  Mesh,
  Vector3,
  Matrix,
  Axis
} from '@babylonjs/core';
import { useBabylonScene } from 'react-babylonjs';
import { Control } from '@babylonjs/gui/2D/controls/control';
import getPoint from '../utils/getPoint';

type Info = {
  info: Flight;
};

const InfoPanel: React.FC<Info> = (props: Info) => {
  const onSceneMount = async (scene: BabylonJSScene) => {
    const mesh = scene.getMeshByID('infoPanel');
    if (mesh !== null) {
      mesh.billboardMode = Mesh.BILLBOARDMODE_ALL;
      const camera = scene.activeCamera;
      const flightPosition = getPoint(
        props.info.latitude,
        props.info.longitude
      ).scale(0.7);
      console.log(flightPosition);
      const direction = camera!.getForwardRay().direction;
      mesh.position = camera!.position.subtract(
        camera!.position
          .subtract(flightPosition)
          .normalize()
          .scale(500)
      );
      // const matrix = Matrix.RotationAxis(Axis.X, Math.PI / 6);
      // mesh.position = Vector3.TransformCoordinates(mesh.position, matrix);
    }
  };

  const scene = useBabylonScene();

  useEffect(() => {
    const f = async () => {
      await onSceneMount(scene!);
    };
    console.log(props);
    f();
  });

  return (
    <>
      {props.info !== undefined ? (
        <plane
          id={`infoPanel`}
          name={`infoPanel`}
          width={400}
          height={400}
          position={Vector3.Zero()}
          renderingGroupId={1}
        >
          <advancedDynamicTexture
            name="dialogTexture"
            height={1024}
            width={1024}
            createForParentMesh={true}
          >
            <rectangle name="rect-1" height={150} width={150}>
              <rectangle>
                <textBlock
                  text={Array(8)
                    .fill(0)
                    .map(
                      (item, index) =>
                        `${Object.keys(props.info)[index]}: ${
                          Object.values(props.info)[index]
                        } \r\n`
                    )
                    .toString()
                    .replace(/,/g, '')}
                  fontFamily="Segoe UI"
                  fontSize={48}
                  color="#000000"
                  outlineWidth={4}
                  outlineColor={'white'}
                  alpha={0.5}
                  horizontalAlignment={Control.HORIZONTAL_ALIGNMENT_LEFT}
                />
              </rectangle>
            </rectangle>
          </advancedDynamicTexture>
        </plane>
      ) : null}
    </>
  );
};

export default InfoPanel;
