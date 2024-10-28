type Review = {
  id: string;
  score: number;
  productId: string;
};

export const data: Review[] = [
  {
    id: "review-1",
    score: 3,
    productId: "product-1",
  },
  {
    id: "review-2",
    score: 4,
    productId: "product-1",
  },
  {
    id: "review-3",
    score: 3,
    productId: "product-2",
  },
  {
    id: "review-4",
    score: 4,
    productId: "product-2",
  },
  {
    id: "review-5",
    score: 5,
    productId: "product-2",
  },
];

type DataApi = {
  allReviews: () => Review[];
  reviewById: (id: string) => Review;
  reviewManyByProductId: (productId: string) => Review[];
  addReview: (newReview: Review) => Review;
};

export const dataApi: DataApi = {
  allReviews: () => data,
  reviewById: (id) => data.find((r) => r.id === id)!,
  reviewManyByProductId: (productId) =>
    data.filter((r) => r.productId === productId),
  addReview: (newReview) => {
    data.push(newReview);
    return newReview;
  },
};
