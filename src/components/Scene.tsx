import * as BABYLON from 'babylonjs';
import * as GUI from 'babylonjs-gui';
import React, { useEffect, useRef } from 'react';
import texture from '../data/texture.jpg';
import speechToText from '../utils/speechToText';

type Props = {};

const onSceneLoaded = (
  engine: BABYLON.Engine,
  scene: BABYLON.Scene,
  canvas: HTMLCanvasElement
) => {
  const camera = new BABYLON.ArcRotateCamera(
    'camera',
    0,
    0,
    10,
    new BABYLON.Vector3(0, 0, 0),
    scene
  );
  camera.wheelPrecision = 50;
  camera.setTarget(BABYLON.Vector3.Zero());
  camera.attachControl(canvas);

  const light = new BABYLON.HemisphericLight(
    'light',
    new BABYLON.Vector3(1, 1, 1),
    scene
  );
  light.intensity = 0.6;

  const sphere = BABYLON.Mesh.CreateSphere('sphere', 100.0, 10.0, scene);
  sphere.position = new BABYLON.Vector3(0, 0, 0);
  sphere.rotation.x = Math.PI;

  const groundMaterial = new BABYLON.StandardMaterial('mat', scene);
  groundMaterial.diffuseTexture = new BABYLON.Texture(texture, scene);
  sphere.material = groundMaterial;

  engine.runRenderLoop(() => {
    if (scene) {
      scene.render();
    }
  });
};

const Scene: React.FC<Props> = () => {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const result = speechToText();

    const canvas = ref.current as HTMLCanvasElement;
    const engine = new BABYLON.Engine(canvas, true);
    const scene = new BABYLON.Scene(engine);
    onSceneLoaded(engine, scene, canvas);
  });

  return <canvas width="1280px" height="720px" ref={ref} />;
};

export default Scene;
