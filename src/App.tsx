import React from 'react';
import { hot } from 'react-hot-loader';
import './App.css';

import ApolloClient, { InMemoryCache } from 'apollo-boost';
import fetchData from './utils/fetchData';
import { resolvers, typeDefs } from './resolvers';

import Main from './components/Main';

import airports from './data/airports.json';

const cache = new InMemoryCache();
const client = new ApolloClient({ cache, resolvers, typeDefs });

client.writeData({
  data: {
    airports: airports,
    paths: [],
    flights: [],
    lastFetch: { time: 0, __typename: 'lastFetch' },
    mode: { mode: 0, __typename: 'mode' }
  }
});

const App: React.FC = () => {
  fetchData({ airport: 'KSFO' }, client);
  console.log(client.cache);
  return (
    <div className="App">
      <Main apolloClient={client} />
    </div>
  );
};

export default hot(module)(App);
