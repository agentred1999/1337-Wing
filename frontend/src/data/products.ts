// Product data now lives in Postgres and is fetched via useProducts() / fetchProductById()
// in utils/useProducts.ts. This file only keeps the shared types.

export interface ProductSpec {
  label: string;
  value: string;
}

export type ProductCategory = 'merch' | 'hardware';

export interface Product {
  id: string;
  name: string;
  price: number;
  category: ProductCategory;
  image: string;
  short: string;
  description: string;
  specs: ProductSpec[];
}
