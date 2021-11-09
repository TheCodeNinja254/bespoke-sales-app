import { ApolloClient, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import ApolloCache from './Cache';

const httpLink = createHttpLink({
  uri: process.env.REACT_APP_APOLLO_CLIENT__HTTP_LINK__URI,
  credentials: 'include'
});

const authLink = setContext(() => {
  // you can manipulate your request headers from here
  // get the authentication token from env file. Use (l) - abstracted variable
  // const token = process.env.REACT_APP_AUTH_TOKEN;
  const s = process.env.REACT_APP_AX;
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      xctx: s
    }
  };
});

const errorLink = onError(
  // eslint-disable-next-line consistent-return
  ({ networkError }) => {
    let networkErrorMessage = '';
    if (
      networkError &&
      networkError.statusCode &&
      networkError.statusCode !== 200
    ) {
      networkErrorMessage = ` Error Code: ${networkError.statusCode}`;
    }
    if (networkError && networkError.message) {
      // eslint-disable-next-line no-param-reassign
      networkError.message =
        networkError.message.indexOf('JSON') !== -1
          ? `Sorry, we experienced a technical error. Please refresh this page or try again later.${networkErrorMessage}`
          : networkError.message;
      if (networkError.message === 'Failed to fetch') {
        // eslint-disable-next-line no-param-reassign
        networkError.message =
          'Sorry, we encountered a connection error. Please check your internet connection and retry again. If the problem persists, please contact your app admin';
      }
    }
  }
);

const Client = new ApolloClient({
  link: authLink.concat(errorLink).concat(httpLink),
  cache: ApolloCache,
  resolvers: {},
  connectToDevTools: process.env.REACT_APP_APOLLO_ENVIRONMENT !== 'production'
});

export default Client;
