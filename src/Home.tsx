import * as React from 'react';
import { useQuery } from 'react-query';

const Home = () => {
  const fetchData = async () => {
    const res = await fetch(`https://swapi.dev/api/people/1/`);
    const json = await res.json();
    return json;
  };

  const { isLoading, data, error } = useQuery('restPeopleQuery', fetchData);

  console.log({ isLoading, data });
  if (error) {
    console.log(error);
    return <>error</>;
  }
  return (
    <>
      <h1>React query swapi</h1>
      {isLoading ? (
        <h2>Loading...</h2>
      ) : (
        <>
          <h2>REST example</h2>
          <h3>{data.name}</h3>
        </>
      )}
    </>
  );
};

export default Home;
