const express = require("express");
const cors = require("cors");
const { ApolloServer } = require("apollo-server-express");
const { typeDefs, resolvers } = require("./schema");

async function start() {
  const app = express();
  app.use(cors());

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();
  server.applyMiddleware({ app, path: "/graphql" });

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(
      `🚀 BT07 cart GraphQL server running at http://localhost:${PORT}${server.graphqlPath}`
    );
  });
}

start().catch((err) => {
  console.error("Failed to start GraphQL server:", err);
});
