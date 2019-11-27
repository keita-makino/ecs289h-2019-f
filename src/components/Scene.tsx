import * as BABYLON from 'babylonjs';
import * as GUI from 'babylonjs-gui';
import React, { useEffect, useRef, useState } from 'react';
import texture from '../data/texture.jpg';
import speechToText from '../utils/speechToText';
import latLngData from '../data/latLng.json';
import getPoint from '../utils/getPoint';

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
  const recognizer = speechToText();
  let scene: BABYLON.Scene | undefined;

  useEffect(() => {
    const canvas = ref.current as HTMLCanvasElement;
    const engine = new BABYLON.Engine(canvas, true);
    scene = new BABYLON.Scene(engine);
    onSceneLoaded(engine, scene, canvas);
  }, []);

  const handleClick = async (scene: BABYLON.Scene | undefined) => {
    recognizer.recognizeOnceAsync(
      function(result) {
        const val = result.text.substring(0, result.text.length - 1);
        console.log(val);
        const record = latLngData.filter(item => item.iata === val)[0];
        const airport = record.icao;
        const latLng = getPoint(record.lat, record.lng, 10);
        const sphere = BABYLON.Mesh.CreateSphere('sphere', 100.0, 0.5, scene);
        sphere.position = new BABYLON.Vector3(latLng[0], latLng[1], latLng[2]);
        sphere.rotation.x = Math.PI;
        console.log(latLng);
        setLocation(latLng);

        const func = async (airport: string) => {
          console.log(Math.floor(Date.now() / 1000));
          const response = await fetch(
            `https://opensky-network.org/api/flights/departure?airport=${airport}&begin=${Math.floor(
              Date.now() / 1000
            ) - 86400}&end=${Math.floor(Date.now() / 1000)}`
          );
          const val = await response.json();
          console.log(val);
          return val;
        };

        const data = func(airport);

        recognizer.close();
      },
      function(err) {
        console.trace('err - ' + err);

        recognizer.close();
      }
    );
  };

  return (
    <>
      <canvas width="1280px" height="720px" ref={ref} />

      <br />
      <br />

      <button
        onClick={() => {
          handleClick(scene);
        }}
      >
        input
      </button>

      {location.map((item, index) => (
        <p key={index}>{item}</p>
      ))}
    </>
  );
};

export default Scene;
