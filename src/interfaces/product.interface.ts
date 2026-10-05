export interface Product {
  description: string;
  images: string[];
  inStock: number;
  price: number;
  sizes: Size[];
  slug: string;
  tags: string[];
  title: string;
  type: ValidType;
  gender: Gender;
}

export type Size = "XS" | "S" | "M" | "L" | "XL" | "XXL" | "XXXL";
export type ValidType = "shirts" | "pants" | "hoodies" | "hats";
export type Gender = "men" | "women" | "kid" | "unisex";
