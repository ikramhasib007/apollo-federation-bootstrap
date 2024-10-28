// @ts-check

const concurrently = require('concurrently');
const path = require('path');
const commands = {
  products: {
    name: "products",
    cwd: path.resolve(__dirname, 'products'),
    prefixColor: 'gray',
  },
  reviews: {
    name: "reviews",
    cwd: path.resolve(__dirname, 'reviews'),
    prefixColor: 'cyan',
  },
  gateway: {
    name: "gateway",
    cwd: path.resolve(__dirname, 'gateway'),
    prefixColor: 'green',
  },
}

const { result } = concurrently(
  [
    {
      command: 'pnpm dev',
      ...commands.products
    },
    {
      command: 'pnpm dev',
      ...commands.reviews
    },
    {
      command: 'pnpm dev',
      ...commands.gateway
    },
  ],
  {
    prefix: 'name',
    killOthers: ['failure', 'success'],
    restartTries: 2,
    // cwd: path.resolve(__dirname, 'scripts'),
  },
);
result.then(success, failure);

function success(args) { }
function failure(reason) { }