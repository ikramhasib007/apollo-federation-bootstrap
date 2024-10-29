import express from "express";
import helmet from "helmet";
import { readFileSync } from "node:fs";
import { createYoga, maskError } from 'graphql-yoga'
import { ApolloGateway } from "@apollo/gateway";
import { useApolloFederation } from "@envelop/apollo-federation";
import { useApolloInlineTrace } from '@graphql-yoga/plugin-apollo-inline-trace'

async function buildGateway(app: ReturnType<typeof express>) {
  // Initialize the gateway
  const gateway = new ApolloGateway({
    supergraphSdl: readFileSync("./src/supergraph.graphql", "utf-8"),
  });

  // Make sure all services are loaded
  await gateway.load();

  const yoga = createYoga({
    cors: {
      allowedHeaders: [
        'X-Custom-Header',
        'Authorization',
        'Content-Type',
        'Apollographql-Client-Name',
        'Apollographql-Client-Version',
      ],
      methods: ['POST'],
    },
    plugins: [
      useApolloInlineTrace(),
      useApolloFederation({
        gateway,
      }),
    ],
    maskedErrors: {
      maskError(error, message, isDev) {
        // @ts-expect-error -> tba
        if (error?.code === 'ECONNREFUSED') {
          return {
            error: process.env.NODE_ENV !== 'production' ? error : undefined,
            name: 'error',
            message: 'Federation service error!',
          }
        }

        // Note: it seems like the "useApolloFederation" plugin should do this by default?
        // @ts-expect-error -> tba
        if (error?.extensions?.code === 'DOWNSTREAM_SERVICE_ERROR') {
          return {
            error: process.env.NODE_ENV !== 'production' ? error : undefined,
            name: 'error',
            message: 'Something went wrong!',
          }
        }
        return maskError(error, message, isDev)
      },
    },
  });

  const router = express.Router();

  // Add specific CSP for GraphiQL by using an express router
  router.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          "style-src": ["'self'", "unpkg.com"],
          "script-src": ["'self'", "unpkg.com", "'unsafe-inline'"],
          "img-src": ["'self'", "raw.githubusercontent.com"],
        },
      },
    })
  );
  router.use(yoga);

  // First register the router, to avoid Global CSP configuration to override the specific one
  app.use(yoga.graphqlEndpoint, router);

  // Global CSP configuration
  app.use(helmet());

  return yoga.graphqlEndpoint;
}

const app = express();

buildGateway(app);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
});
