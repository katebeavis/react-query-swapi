import * as React from 'react';
import { useQuery } from 'react-query';

const Home = () => {
  const fetchData = async () => {
    const res = await fetch(`https://swapi.dev/api/people/1/`);
    const json = await res.json();
    return json;
  };
  const { isLoading, data } = useQuery('todos', fetchData);

  console.log({ isLoading, data });
  return <h1>Hi</h1>;
};

export default Home;
