import {ApolloServer} from '@apollo/server';
import {ApolloError} from 'apollo-server';
import {createError} from 'apollo-errors'
import {startStandaloneServer} from '@apollo/server/standalone';

import {typeDefs} from './typeDefs.js';
import {resolvers} from './resolvers.js';

const NotFoundError = createError('NotFoundError', {
  message: 'Page not found',
  options: { showPath: true },
  path: 'customPath',
  statusCode: 404,
});

const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: (error) => {
    if (error.originalError instanceof NotFoundError) {
      // If it's a custom error, you can customize the HTTP status code
      return {
        ...error,
        extensions: {
          ...error.extensions,
          response: {
            ...error.extensions.response,
            status: 404,
          },
        },
      };
    }
    return error;
  },
});

const {url} = await startStandaloneServer(server, {
  listen: {port: 4000}
});

console.log(`🚀 Server ready at ${url}`);
