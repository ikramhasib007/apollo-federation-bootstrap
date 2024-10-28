type Product = {
  id: string;
  name: string
  price: number
};

export const data: Product[] = [
  {
    id: "product-1",
    name: "Sweet bamboo!",
    price: 300
  },
  {
    id: "product-2",
    name: "Sweet bamboo!",
    price: 500
  },
  {
    id: "product-3",
    name: "Sweet bamboo!",
    price: 700
  },
  {
    id: "product-4",
    name: "Sweet bamboo!",
    price: 900
  },
  {
    id: "product-5",
    name: "Sweet bamboo!",
    price: 400
  },
];

type DataApi = {
  allProducts: () => Product[];
  topProducts: () => Product[];
  productById: (id: string) => Product;
}

export const dataApi: DataApi = {
  allProducts: () => data,
  topProducts: () => data.sort((a, b) => b.price - a.price),
  productById: (id) => data.find((r) => r.id === id)!,
};
