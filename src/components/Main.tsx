import { Engine, Scene, BabylonJSContext } from 'react-babylonjs';
import {
  Vector3,
  Color3,
  AbstractMesh,
  Scene as BabylonJSScene,
  Matrix,
  Camera,
  WebVRFreeCamera,
  PointerInfo,
  Mesh
} from '@babylonjs/core';
import React, { useState, useContext } from 'react';
import texture from '../data/texture.jpg';
import sky from '../data/sky.jpg';
import { ApolloProvider, useQuery } from '@apollo/react-hooks';

import Flights from './Flights';
import { gql } from 'apollo-boost';
import Airports from './Airports';
import Paths from './Paths';
import InfoPanel from './InfoPanel';
import recognizeInput from '../utils/recoginizeInput';
import speechToText from '../utils/speechToText';
import fetchData from '../utils/fetchData';
import { Flight } from '../data/Flight';

const query = gql`
  {
    lastFetch {
      time
    }
    flights @client {
      ident
      type
      latitude
      longitude
      origin
      destination
      groundspeed
      heading
      waypoints
    }
    paths @client {
      airline
      traces {
        x
        y
        z
      }
    }
    airports @client {
      icao
      iata
      latitude
      longitude
      large
      selected
    }
  }
`;

type Props = {
  apolloClient: any;
};

const initialInfo = {
  ident: '',
  type: '',
  latitude: 0,
  longitude: 0,
  origin: '',
  destination: '',
  groundspeed: 0,
  heading: 0,
  waypoints: ''
};

const Main: React.FC<Props> = (props: Props) => {
  const recognizer = speechToText();
  const { data } = useQuery(query, { client: props.apolloClient });
  const [info, setInfo] = useState({} as Flight);
  const [isVR, setIsVr] = useState(false);

  const onScenePointerUp = async (
    event: PointerInfo,
    scene: BabylonJSScene
  ) => {
    console.log(event);
    let destination: Vector3 = scene.activeCamera!.position;
    const mesh = event.pickInfo!.hit ? event.pickInfo!.pickedMesh : null;
    if (mesh === null) return;
    switch (mesh.name) {
      case 'airport':
        destination = mesh.position.scale(1.3);
        fetchData({ airport: mesh.id.split(' ')[1] }, props.apolloClient);
        break;
      case 'flight':
        destination = mesh.position.scale(1.1);
        fetchData({ aircraft: mesh.id.split(' ')[1] }, props.apolloClient);
        break;
      case 'path':
        fetchData({ airline: mesh.id.split(' ')[1] }, props.apolloClient);
        break;
      case 'sky':
        console.log(isVR);
        if (!isVR) recognizeInput(recognizer, props.apolloClient);
        break;
      default:
        return;
    }
    scene.activeCamera!.position = destination;
  };

  const onScenePointerMove = async (
    event: PointerInfo,
    scene: BabylonJSScene
  ) => {
    const mesh = event.pickInfo!.hit ? event.pickInfo!.pickedMesh : null;
    if (mesh === null) return;
    switch (mesh.name) {
      case 'flight':
        {
          const array = mesh.id.split(' ');
          setInfo({
            ident: array[2],
            type: array[1],
            latitude: Number(array[3]),
            longitude: Number(array[4]),
            origin: array[5],
            destination: array[6],
            groundspeed: Number(array[7]),
            heading: Number(array[8]),
            waypoints: array[9],
            __typename: 'flight'
          });
        }
        console.log(mesh);
        break;
      default:
        setInfo({} as Flight);
        break;
    }
  };

  const onSceneMount = async (event: { scene: BabylonJSScene }) => {
    const scene = event.scene;
    const vrHelper = scene.createDefaultVRExperience();
    vrHelper.enableInteractions();
    vrHelper.currentVRCamera!.position = new Vector3(-100, 30, -100);
    await vrHelper.onControllerMeshLoaded.add(contoller => {
      vrHelper.displayLaserPointer = true;
      setIsVr(true);
      contoller.onPadValuesChangedObservable.add(state => {
        if (contoller.hand === 'right') {
          const rotation = (vrHelper.currentVRCamera as WebVRFreeCamera)
            .deviceRotationQuaternion;
          console.log(rotation);

          const move = new Vector3(state.x * 10, 0, -state.y * 10);
          move.rotateByQuaternionToRef(rotation, move);
          vrHelper.position = vrHelper.position.add(move);
        }
      });
      contoller.onTriggerStateChangedObservable.add(async state => {
        if (contoller.hand === 'right' && state.value === 1) {
          await recognizeInput(recognizer, props.apolloClient);
        }
      });
    });
  };

  const [projection, setProjection] = useState(0);
  console.log('Main');

  return (
    <Engine
      babylonJSContext={useContext(BabylonJSContext)}
      antialias
      width={(window as any).innerWidth}
      height={(window as any).innerHeight}
      canvasId="canvas"
    >
      <Scene
        onScenePointerMove={onScenePointerMove}
        onScenePointerUp={onScenePointerUp}
        onSceneMount={onSceneMount}
      >
        <arcRotateCamera
          name="camera"
          target={new Vector3(0, 0, 0)}
          alpha={-Math.PI / 2}
          beta={Math.PI / 4}
          radius={250}
          lowerRadiusLimit={101}
          upperRadiusLimit={1000}
          wheelPrecision={10}
        />
        <hemisphericLight
          name="light"
          intensity={0.1}
          direction={new Vector3(1, 1, 1)}
        />
        <sphere
          name="globe"
          diameter={200}
          segments={64}
          position={Vector3.Zero()}
        >
          <standardMaterial
            createForParentMesh
            name={'globeMaterial'}
            specularColor={new Color3(0, 0, 0)}
          >
            <texture
              name={'globeTexture'}
              url={texture}
              onLoad={() => {
                setProjection(8);
              }}
              coordinatesMode={projection}
            />
          </standardMaterial>
        </sphere>
        <ApolloProvider client={props.apolloClient}>
          <Flights
            n={data.lastFetch.time}
            data={{ airports: data.airports, flights: data.flights }}
          />
          <Airports n={data.lastFetch.time} data={data.airports} />
          <Paths n={data.lastFetch.time} data={data.paths} />
          <InfoPanel info={info} />
        </ApolloProvider>
        <sphere
          name="sky"
          diameter={5000}
          segments={8}
          position={Vector3.Zero()}
          sideOrientation={1}
        >
          <standardMaterial
            createForParentMesh
            name={'skyMaterial'}
            specularColor={new Color3(0, 0, 0)}
            emissiveColor={new Color3(0, 0, 0)}
          >
            <texture
              name={'skyTexture'}
              url={sky}
              onLoad={() => {
                setProjection(8);
              }}
              coordinatesMode={projection}
            />
          </standardMaterial>
        </sphere>
      </Scene>
    </Engine>
  );
};

export default Main;
