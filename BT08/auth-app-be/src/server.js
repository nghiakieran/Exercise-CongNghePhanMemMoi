const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { connectDB } = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");
const errorHandler = require("./middleware/errorHandler");
const { apiLimiter } = require("./middleware/rateLimiter");

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply rate limiting to all API routes (production only)
if (process.env.NODE_ENV === "production") {
  app.use("/api/", apiLimiter);
}

// REST Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/favorites", favoriteRoutes);

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ success: true, message: "Server is running" });
});

// Error handler
app.use(errorHandler);

// GraphQL setup (optional - only if ENABLE_GRAPHQL=true)
async function startServer() {
  const PORT = process.env.PORT || 5000;

  // Only enable GraphQL if explicitly enabled via env var
  if (process.env.ENABLE_GRAPHQL === "true") {
    try {
      const { ApolloServer } = require("apollo-server-express");
      const { typeDefs, resolvers } = require("./graphql/cartSchema");

      const server = new ApolloServer({
        typeDefs,
        resolvers,
      });

      await server.start();
      server.applyMiddleware({ app, path: "/graphql" });

      app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
        console.log(`REST API: http://localhost:${PORT}/api`);
        console.log(
          `GraphQL endpoint available at http://localhost:${PORT}${server.graphqlPath}`
        );
      });
    } catch (err) {
      console.error("Failed to start GraphQL server:", err);
      console.log("Starting server without GraphQL...");
      // Fallback: start server without GraphQL
      app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT} (REST API only)`);
        console.log(`REST API: http://localhost:${PORT}/api`);
      });
    }
  } else {
    // Start server without GraphQL
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT} (REST API only)`);
      console.log(`REST API: http://localhost:${PORT}/api`);
      console.log(`To enable GraphQL, set ENABLE_GRAPHQL=true in .env`);
    });
  }
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
