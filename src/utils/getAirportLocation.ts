import speechToText from '../utils/speechToText';
import latLngData from '../data/latLng.json';
import getPoint from '../utils/getPoint';
import * as BABYLON from 'babylonjs';

const recognizer = speechToText();

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
      // setLocation(latLng);

      const func = async (airport: string) => {
        console.log(Math.floor(Date.now() / 1000));
        const response = await fetch(
          `https://opensky-network.org/api/flights/arrival?airport=${airport}&begin=${Math.floor(
            Date.now() / 1000
          ) - 86400}&end=${Math.floor(Date.now() / 1000) + 86400}`
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
