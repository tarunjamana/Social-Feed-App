import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import useAuthStore from "../store/authStore";
import { SetContextLink } from "@apollo/client/link/context";

import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";

import { split } from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";

const httpLink = new HttpLink({ uri: "http://localhost:4000/graphql" });

const wsLink = new GraphQLWsLink(
  createClient({
    url: "ws://localhost:4000/graphql",
      connectionParams: () => ({
    authorization: useAuthStore.getState().accessToken 
      ? `Bearer ${useAuthStore.getState().accessToken}` 
      : ""
  })
  }),
);

const authLink = new SetContextLink((prevContext) => {
  const token = useAuthStore.getState().accessToken;
  return {
    headers: {
      ...prevContext.headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const splitLink = split(
  ({ query }) => {
    const def = getMainDefinition(query);
    return (
      def.kind === "OperationDefinition" && def.operation === "subscription"
    );
  },
  wsLink, // if subscription
  authLink.concat(httpLink), // if query/mutation
);



// create client
const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

export default client;
