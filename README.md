# react-query-swapi ⭐

Experimenting with [react-query](https://github.com/tannerlinsley/react-query)

This example uses the [swapi](https://swapi.dev/) REST api and the [swapi-graphql](https://github.com/graphql/swapi-graphql) wrapper to demonstrate how react query works with both of them

## To setup and run

```
$ git clone git@github.com:katebeavis/react-query-swapi.git
$ touch .env
$ yarn
$ yarn dev
```

## Usage

A `useQuery` hook will fetch a random Star Wars character from the REST api

A `useMutation` hook that will fetch a Star Wars character from the graphQL api depending on which button you click

An add to favourites and remove from favourites button that will let you create a list of your favourite Star Wars characters by utilising the cache
