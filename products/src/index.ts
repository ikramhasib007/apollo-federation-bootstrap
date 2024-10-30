import 'dotenv/config'
import { parse } from "graphql";
import { readFileSync } from 'node:fs'
import { buildSubgraphSchema } from "@apollo/subgraph";
import { createYoga, maskError } from "graphql-yoga";
import { createServer } from "http";
import * as dataSources from "./data";
import { Resolvers } from "./generated/graphql";

const typeDefs = parse(readFileSync('./src/schema.graphql', 'utf8'))

const resolvers: Resolvers = {
  Query: {
    // @ts-expect-error -> tba
    product: async (parent, args, ctx, info) => {
      const productRes = dataSources.api.productById(args.id)
      return productRes
    },
    // @ts-expect-error -> tba
    topProducts: async (parent, args, ctx, info) => {
      return dataSources.api.topProducts()
    },
    authors: async (parent, args, ctx, info) => {
      const authorsList = dataSources.api.allAuthors()
      return authorsList
    },
    // @ts-expect-error -> tba
    books: async (parent, args, ctx, info) => {
      return dataSources.api.allProducts()
    },
  },
  Book: {
    author: (parent) => {
      const book = parent as typeof dataSources.products[0]
      const authorData = dataSources.api.authorById(book.authorId!)
      return authorData
    },
    // __resolveReference: (ref) => {
    //   return dataSources.api.productById(ref.id)
    // }
  },
  Product: {
    // @ts-expect-error -> tba
    __resolveReference: (ref) => {
      const product = dataSources.api.productById(ref.id)
      return product
    },

    // @ts-expect-error -> tba
    __resolveType: (ref) => {
      const product = ref as typeof dataSources.products[0]
      let __typename
      if (product.director) __typename = 'Movie'
      // @ts-expect-error -> tba
      if (product.author !== 'undefined') __typename = 'Book'
      else __typename = null // GraphQLError is thrown
      return __typename
    },
  },
  Author: {
    __resolveReference: (ref) => {
      const authorData = dataSources.api.authorById(ref.id)
      return authorData
    }
  }
};
const yoga = createYoga({
  cors: {
    allowedHeaders: [
      'X-Custom-Header',
      'X-Authorization',
      'Authorization',
      'Content-Type',
    ],
    methods: ['POST'],
  },
  schema: buildSubgraphSchema([{ typeDefs, resolvers }]),
  maskedErrors: {
    maskError(error, message, isDev) {
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

const server = createServer(yoga);

const PORT = 5001
server.listen(PORT, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
});
