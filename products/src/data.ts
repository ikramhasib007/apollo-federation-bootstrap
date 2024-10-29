// Product as Book | Movie
type Product = {
  id: string;
  name: string
  price: number
  authorId?: string
  director?: String
};
type Author = {
  id: string;
  name: string
}

export const authors: Author[] = [
  {
    id: 'author-1',
    name: 'John Doe'
  },
  {
    id: 'author-2',
    name: 'Jane Doe'
  },
  {
    id: 'author-3',
    name: 'Jane Merry'
  }
]

// books as products
export const products: Product[] = [
  {
    id: "product-1",
    name: "Sweet bamboo!",
    price: 300,
    authorId: authors[0].id
  },
  {
    id: "product-2",
    name: "Sweet bamboo!",
    price: 500,
    authorId: authors[0].id
  },
  {
    id: "product-3",
    name: "Sweet bamboo!",
    price: 700,
    authorId: authors[1].id
  },
  {
    id: "product-4",
    name: "Sweet bamboo!",
    price: 900,
    authorId: authors[1].id
  },
  {
    id: "product-5",
    name: "Sweet bamboo!",
    price: 400,
    authorId: authors[1].id
  },
];
export const movies: Product[] = [
  {
    id: "movie-1",
    name: "Sweet smash!",
    price: 200,
    director: 'Quentin Tarantino'
  },
];

type DataApi = {
  allProducts: () => Product[];
  topProducts: () => Product[];
  productById: (id: string) => Product;
  allAuthors: () => Author[];
  authorById: (id: string) => Author;
  movies: () => Product[];
  movieById: (id: string) => Product;
}

export const api: DataApi = {
  allProducts: () => products,
  topProducts: () => products.sort((a, b) => b.price - a.price),
  productById: (id) => products.find((r) => r.id === id)!,
  allAuthors: () => authors,
  authorById: (id) => authors.find((a) => a.id === id)!,
  movies: () => movies,
  movieById: (id) => movies.find((a) => a.id === id)!,
};
