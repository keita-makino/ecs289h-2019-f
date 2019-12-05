import React from 'react';
import './App.css';
import Scene from './components/Scene';
import ApolloClient, { InMemoryCache } from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks';

const cache = new InMemoryCache();
const client = new ApolloClient({ cache, resolvers: {} });

client.writeData({
  data: { location: '', paths: [] }
});

const App: React.FC = () => {
  return (
    <div className="App">
      <ApolloProvider client={client}>
        <Scene />
      </ApolloProvider>
    </div>
  );
};

export default App;
