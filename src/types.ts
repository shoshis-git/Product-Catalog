export interface Category {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  categoryId: string;
  name: string;
  price?: number;
  description?: string;
  [key: string]: unknown;
}
