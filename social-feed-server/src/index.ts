import express from "express";
import cors from "cors";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import typeDefs from "./graphql/typeDefs";
import resolvers from "./graphql/resolvers";
import { contextMiddleware } from "./middleware/context";
import http from 'http'
import { makeExecutableSchema } from "@graphql-tools/schema";
import { PubSub } from "graphql-subscriptions";
import { useServer } from 'graphql-ws/lib/use/ws';
import { WebSocketServer } from 'ws';
import jwt from 'jsonwebtoken'

const app = express();
const PORT = process.env.PORT || 4000;


const httpServer = http.createServer(app);

const schema = makeExecutableSchema({ typeDefs, resolvers });

const pubSub = new PubSub();


async function startServer() {
  const server = new ApolloServer({schema});

  await server.start();

  const wsServer = new WebSocketServer({ server: httpServer, path: '/graphql' });
useServer({ 
  schema,
    context: async (ctx) => {
    const authHeader = ctx.connectionParams?.authorization as string
    const token = authHeader?.split(" ")[1]
    let userId = null
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as { userId: string }
        userId = decoded.userId
      } catch {}
    }
    return { pubSub, userId }
  }
}, wsServer)

  const corsOptions = {
    origin: [
      "http://localhost:5173",
      "https://social-feed-app-eight.vercel.app",
    ],
    credentials: true,
  };

  app.use(cors(corsOptions));
  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.use("/graphql", cors(corsOptions), express.json(), expressMiddleware(server, {
  context: async ({ req }) => contextMiddleware(req,pubSub)
}));


  httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`GraphQL endpoint: http://localhost:${PORT}/graphql`);
  });
}

startServer();