type Review = {
  id: string;
  score: number;
  productId: string;
  authorId?: string;
};

export const data: Review[] = [
  {
    id: "review-1",
    score: 3,
    productId: "product-1",
    authorId: 'author-3',
  },
  {
    id: "review-2",
    score: 4,
    productId: "product-1",
    authorId: 'author-3',
  },
  {
    id: "review-3",
    score: 3,
    productId: "product-2",
    authorId: 'author-3',
  },
  {
    id: "review-4",
    score: 4,
    productId: "product-2",
    authorId: 'author-3',
  },
  {
    id: "review-5",
    score: 5,
    productId: "product-2",
    authorId: 'author-3',
  },
];

type DataApi = {
  allReviews: () => Review[];
  reviewById: (id: string) => Review;
  reviewManyByProductId: (productId: string) => Review[];
  reviewManyByAuthorId: (authorId: string) => Review[];
  addReview: (newReview: Review) => Review;
};

export const api: DataApi = {
  allReviews: () => data,
  reviewById: (id) => data.find((r) => r.id === id)!,
  reviewManyByProductId: (productId) =>
    data.filter((r) => r.productId === productId),
  reviewManyByAuthorId: (authorId) =>
    data.filter((r) => r.authorId === authorId),
  addReview: (newReview) => {
    data.push(newReview);
    return newReview;
  },
};
