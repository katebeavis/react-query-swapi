import * as React from 'react';
import { useQuery, useMutation, QueryClient } from 'react-query';
import { request, gql } from 'graphql-request';

const queryClient = new QueryClient();

const Home = () => {
  const fetchData = async () => {
    const res = await fetch(`https://swapi.dev/api/people/1/`);
    const json = await res.json();
    return json;
  };

  const {
    mutate,
    isLoading: graphqlLoading,
    data: graphqlData,
    error: graphqlError,
  } = useMutation(
    'graphQLMutation',
    async (variables: { [key: string]: any }) =>
      await request(
        `http://localhost:6060`,
        gql`
        query {
          person(personID: ${variables.id}) {
            name
          }
        }
      `
      ),
    {
      onSuccess: (data) => console.log('character loaded:', data.person.name),
      onSettled: (data, error, variables, context) =>
        console.log('settled:', { data, error, variables, context }),
    }
  );

  const addCharacterToFavourites = async ({ character }: any) => {
    await queryClient.setQueryData('favouriteCharacters', (prevData: any) =>
      prevData === undefined ? [character] : [...prevData, character]
    );
    refetch();
  };

  const {
    mutate: addToFavourites,
    isLoading: addToFavouritesLoading,
    error: addToFavouritesError,
  } = useMutation('addToFavouritesMutation', addCharacterToFavourites);

  const { isLoading, data, error } = useQuery('restPeopleQuery', fetchData);

  const {
    isLoading: fetchFavouritesLoading,
    data: fetchFavouritesData,
    error: fetchFavouritesError,
    refetch,
  } = useQuery(
    'fetchFavourites',
    (): [] | undefined => queryClient.getQueryData('favouriteCharacters'),
    { enabled: false }
  );

  if (error || graphqlError || addToFavouritesError || fetchFavouritesError) {
    console.log(
      error,
      graphqlError,
      addToFavouritesError,
      fetchFavouritesError
    );
    return <>error</>;
  }

  return (
    <>
      <h1>React query swapi</h1>
      <h2>REST example</h2>
      {isLoading ? <h3>Loading...</h3> : <h3>{data.name}</h3>}
      <h2>graphQL example</h2>
      {graphqlLoading ? (
        <h3>Loading...</h3>
      ) : (
        <h3>
          {graphqlData ? (
            <>
              {graphqlData?.person?.name}{' '}
              <button
                onClick={() =>
                  addToFavourites({ character: graphqlData?.person?.name })
                }
                disabled={addToFavouritesLoading || fetchFavouritesLoading}
              >
                Add to favourites
              </button>
            </>
          ) : (
            'Who will it be?'
          )}
        </h3>
      )}
      {[...Array(10).keys()].map((index) => {
        const id = index + 1;
        return (
          <button
            style={{ padding: '10px' }}
            onClick={() => mutate({ id })}
            key={id}
          >
            Who could it be?
          </button>
        );
      })}
      <h2>Favourites</h2>
      {fetchFavouritesData === undefined ? (
        <h3>No favourites added yet!</h3>
      ) : (
        fetchFavouritesData.map((character: string, index: number) => (
          <p key={index}>{character}</p>
        ))
      )}
    </>
  );
};

export default Home;
