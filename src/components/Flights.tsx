import React, { useEffect, useState } from 'react';
import { useQuery, useApolloClient } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import { Flight } from '../data/Flight';
import getPoint from '../utils/getPoint';
import { Airport } from '../data/Airport';
import {
  Color3,
  Vector3,
  Mesh,
  Scene as BabylonJSScene
} from '@babylonjs/core';
import getScale from '../utils/getScale';
import { Path, Trace } from '../data/Path';
import getColorFromString from '../utils/getColorFromString';
import { useBabylonScene } from 'react-babylonjs';

type Props = {
  n: number;
  data: { airports: Airport[]; flights: Flight[] };
};

const onSceneMount = async (scene: BabylonJSScene) => {
  const mesh = scene.meshes.filter(item => item.name === 'flight');
  if (mesh.length > 0) {
    mesh.map(item => (item.billboardMode = Mesh.BILLBOARDMODE_ALL));
  }
};

const Flights: React.FC<Props> = (props: Props) => {
  const scene = useBabylonScene();
  const client = useApolloClient();
  const flights = props.data.flights;

  const [component, setComponent] = useState([] as JSX.Element[]);

  useEffect(() => {
    const airports = props.data.airports as Airport[];
    airports.map(item => (item.selected = 0));
    setComponent([] as JSX.Element[]);
    console.log(component);
    const f = async () => {
      const paths = [] as Path[];
      await flights.map(async (item: Flight, index: number) => {
        const currentPosition = getPoint(item.latitude, item.longitude);
        const origin = airports.find(
          (airport: Airport) => airport.icao === item.origin
        ) as Airport;
        const destination = airports.find(
          (airport: Airport) => airport.icao === item.destination
        ) as Airport;

        airports[airports.indexOf(origin)].selected = 1;
        airports[airports.indexOf(destination)].selected = 1;

        const originPosition = getPoint(origin.latitude, origin.longitude);
        const destinationPosition = getPoint(
          destination.latitude,
          destination.longitude
        );
        const scale = getScale(
          originPosition,
          destinationPosition,
          currentPosition
        );

        const traces = [] as Trace[];
        Array(21)
          .fill(0)
          .map((i, index) => {
            const currentPosition = Vector3.Lerp(
              originPosition,
              destinationPosition,
              index / 20
            );
            const scale = getScale(
              originPosition,
              destinationPosition,
              currentPosition
            );
            const [x, y, z] = currentPosition
              .normalize()
              .scale(100 * scale)
              .asArray();
            traces.push({
              x: x,
              y: y,
              z: z,
              __typename: 'trace'
            });
          });
        paths.push({
          airline: item.ident.substring(0, 2),
          traces: traces,
          __typename: 'path'
        });
        console.log(JSON.stringify(item));
        setComponent(component => [
          ...component,
          <icoSphere
            id={`flight ${item.type} ${item.ident} ${item.latitude} ${
              item.longitude
            } ${airports.filter(item2 => item2.icao === item.origin)[0].iata} ${
              airports.filter(item2 => item2.icao === item.destination)[0].iata
            } ${item.groundspeed} ${item.heading}`}
            name={`flight`}
            metadata={{ data: JSON.stringify(item) }}
            radius={1.25}
            subdivisions={4}
            position={currentPosition.scale(100 * scale)}
          >
            <standardMaterial
              name={`flight ${index} material`}
              emissiveColor={getColorFromString(item.type)}
            ></standardMaterial>
          </icoSphere>,
          <plane
            id={`flight ${item.type} ${item.ident} ${item.latitude} ${
              item.longitude
            } ${airports.filter(item2 => item2.icao === item.origin)[0].iata} ${
              airports.filter(item2 => item2.icao === item.destination)[0].iata
            } ${item.groundspeed} ${item.heading}`}
            name={`flight`}
            reservedDataStore={{ data: JSON.stringify(item) }}
            width={10}
            height={10}
            position={currentPosition
              .scale(scale * 100)
              .add(currentPosition.normalize().scale(2.5))}
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
                    width={40}
                    height={10}
                    name={`flight ${item.type}`}
                  >
                    <textBlock
                      text={item.ident}
                      fontFamily="Segoe UI"
                      fontStyle="bold"
                      fontSize={200}
                      color={getColorFromString(item.type).toHexString()}
                      outlineWidth={15}
                      outlineColor={'white'}
                    />
                  </babylon-button>
                </rectangle>
              </rectangle>
            </advancedDynamicTexture>
          </plane>
        ]);
      });
      console.log({
        airports: airports,
        paths: paths
      });
      client.writeData({
        data: {
          airports: airports,
          paths: paths
        }
      });
      await onSceneMount(scene!);
    };
    f();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.n]);

  return <>{component}</>;
};

export default Flights;
