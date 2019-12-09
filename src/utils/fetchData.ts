import axios from 'axios';
import config from './config';
import { Flight } from '../data/Flight';
import { icaoList } from '../data/Airport';
import { useApolloClient, useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

type Args = {
  airport?: string;
  aircraft?: string;
  airline?: string;
};

const query = gql`
  {
    airports @client {
      icao
      latitude
      longitude
      large
      selected
    }
  }
`;

const fetchData = async (args: Args, client: any) => {
  axios
    .post('https://ecs289h-2019-fetch.azurewebsites.net/api/fecthData', null, {
      params: {
        ...args,
        code: 'qbIqca3zv/n3ah0am91hFMggblzCbCvYb5vtOhamariZaDfaqFO9cw=='
      }
    })
    .then(response => {
      console.log(response);
      if (response.data.SearchBirdseyeInFlightResult !== undefined) {
        client.writeData({
          data: {
            flights: response.data.SearchBirdseyeInFlightResult.aircraft
              .filter(
                (item: { origin: string; destination: string }) =>
                  icaoList.includes(item.origin) &&
                  icaoList.includes(item.destination)
              )
              .map((item: any) => ({ ...item, __typename: 'flight' })),
            lastFetch: {
              time: Date.now(),
              __typename: 'lastFetch'
            }
          }
        });
      }
    });
};

export default fetchData;
