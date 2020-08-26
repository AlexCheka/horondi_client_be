const {
  ApolloServer,
  AuthenticationError,
  makeExecutableSchema,
} = require('apollo-server');
const { applyMiddleware } = require('graphql-middleware');
const http = require('http');
const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');
const connectDB = require('./config/db');
const userService = require('./modules/user/user.service');
const verifyUser = require('./utils/verify-user');
const { currencyWorker } = require('./currency.worker');
const permissions = require('./permissions');

connectDB();
require('dotenv').config();

if (process.env.NODE_ENV === 'test') {
  const HEALTH_PORT = process.env.HEALTH_PORT || 6000;

  const app = http.createServer((req, res) => {
    res.end('Health page!');
  });

  app.listen(HEALTH_PORT, () => {
    console.log('Server Health started');
  });
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const { token } = req.headers || '';
    if (token) {
      const user = verifyUser(token);
      if (!user) throw new AuthenticationError('Invalid authorization token');
      return {
        user: await userService.getUserByFieldOrThrow('email', user.email),
      };
    }
  },
  introspection: true,
  cors: { origin: '*' },
});
currencyWorker();

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log('apollo server started, port', PORT));
