import { parse } from "graphql";
import { readFileSync } from "node:fs";
import { buildSubgraphSchema } from "@apollo/subgraph";
import { createYoga, maskError } from "graphql-yoga";
import { createServer } from "http";
import * as dataSources from "./data";
import { Author, Product, Resolvers, ResponseStatus, Review } from "./generated/graphql";

const typeDefs = parse(readFileSync("./src/schema.graphql", "utf8"));

const resolvers: Resolvers = {
  Query: {
    reviews: async (parent, args, ctx, info) => {
      return dataSources.api.allReviews() as unknown as Review[];
    },
    // topRatedProducts: async (parent, args, ctx, info) => {
    //   return dataSources.api.allReviews()
    // },
  },
  Mutation: {
    submitReview: async (parent, args, createContext, info) => {
      const newReview = dataSources.api.addReview({
        ...args.data,
        id: `review-${dataSources.api.allReviews().length + 1}`,
      }) as unknown as Review;

      return {
        status: ResponseStatus.Ok,
        review: newReview,
      };
    },
  },
  Review: {
    product: (parent) => {
      const review = parent as unknown as (typeof dataSources.data)[0];
      return { id: review.productId } as Product;
    },
    author: (parent) => {
      const review = parent as unknown as (typeof dataSources.data)[0];
      return { id: review.authorId } as Author;
    },
    __resolveReference: (ref) => {
      return dataSources.api.reviewById(ref.id) as unknown as Review;
    },
  },
  Author: {
    reviews: (parent) => {
      const reviewsLists = dataSources.api.reviewManyByAuthorId(parent.id);
      return reviewsLists as unknown as Review[];
    },
  },
  Product: {
    reviews: (parent) => {
      const reviewsLists = dataSources.api.reviewManyByProductId(parent.id);
      return reviewsLists as unknown as Review[];
    },
  },
};

const yoga = createYoga({
  schema: buildSubgraphSchema([{ typeDefs, resolvers }]),
  maskedErrors: {
    maskError(error, message, isDev) {
      // @ts-expect-error -> tba
      if (error?.extensions?.code === "DOWNSTREAM_SERVICE_ERROR") {
        return {
          error: process.env.NODE_ENV !== "production" ? error : undefined,
          name: "error",
          message: "Something went wrong!",
        };
      }

      return maskError(error, message, isDev);
    },
  },
});

const server = createServer(yoga);

const PORT = 5002;
server.listen(PORT, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
});
