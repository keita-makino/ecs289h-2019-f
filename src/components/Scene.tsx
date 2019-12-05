import * as BABYLON from 'babylonjs';
import React, { useEffect, useRef, useState } from 'react';
import texture from '../data/texture.jpg';

type Props = {};

const onSceneLoaded = (
  engine: BABYLON.Engine,
  scene: BABYLON.Scene,
  canvas: HTMLCanvasElement
) => {
  const camera = new BABYLON.ArcRotateCamera(
    'camera',
    -1,
    1,
    25,
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
  light.intensity = 1;

  const sphere = BABYLON.Mesh.CreateSphere('sphere', 100.0, 20.0, scene);
  sphere.position = new BABYLON.Vector3(0, 0, 0);
  sphere.rotation.x = Math.PI;

  const groundMaterial = new BABYLON.StandardMaterial('mat', scene);
  groundMaterial.diffuseTexture = new BABYLON.Texture(texture, scene);
  groundMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
  sphere.material = groundMaterial;

  engine.runRenderLoop(() => {
    if (scene) {
      scene.render();
    }
  });
};

const Scene: React.FC<Props> = () => {
  const ref = useRef<HTMLCanvasElement>(null);
  const [location, setLocation] = useState([] as number[]);
  let scene: BABYLON.Scene | undefined;

  useEffect(() => {
    const canvas = ref.current as HTMLCanvasElement;
    const engine = new BABYLON.Engine(canvas, true);
    scene = new BABYLON.Scene(engine);
    onSceneLoaded(engine, scene, canvas);
  }, []);

  return (
    <>
      <canvas width="1280px" height="720px" ref={ref} />

      <br />
      <br />

      <button onClick={() => {}}>input</button>

      {location.map((item, index) => (
        <p key={index}>{item}</p>
      ))}
    </>
  );
};

export default Scene;
