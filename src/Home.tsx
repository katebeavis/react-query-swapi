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

  const addCharacterToFavourites = (prevData: any, character: any) =>
    prevData === undefined ? [character] : [...prevData, character];

  const removeCharacterFromFavourites = (prevData: any, character: any) =>
    prevData.filter((item: any) => character !== item);

  const updateFavourites = async ({ character, callback }: any) => {
    await queryClient.setQueryData('favouriteCharacters', (prevData: any) =>
      callback(prevData, character)
    );
    refetch();
  };

  const {
    mutate: updateFavouritesMutate,
    isLoading: updateFavouritesLoading,
    error: updateFavouritesError,
  } = useMutation('updateFavouritesMutation', updateFavourites);

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

  if (error || graphqlError || updateFavouritesError || fetchFavouritesError) {
    console.log(
      error,
      graphqlError,
      updateFavouritesError,
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
                  updateFavouritesMutate({
                    character: graphqlData?.person?.name,
                    callback: addCharacterToFavourites,
                  })
                }
                disabled={updateFavouritesLoading || fetchFavouritesLoading}
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
        fetchFavouritesData.map((character: string, index: number) => {
          return (
            <div key={index} style={{ display: 'flex', marginBottom: '10px' }}>
              <p style={{ marginRight: '10px' }}>{character}</p>
              <button
                onClick={() =>
                  updateFavouritesMutate({
                    character,
                    callback: removeCharacterFromFavourites,
                  })
                }
                disabled={updateFavouritesLoading || fetchFavouritesLoading}
              >
                {`Remove ${character} from favourites`}
              </button>
            </div>
          );
        })
      )}
    </>
  );
};

export default Home;
