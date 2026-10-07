"use server";

import { Gender } from "@/generated/prisma/enums";
import { Product } from "@/interfaces";
import { prisma } from "@/lib/prisma";

interface PaginationOptions {
  page?: number;
  take?: number;
  gender?: Gender;
}

export const getPaginatedProductsWithImages = async ({
  page = 1,
  take = 12,
  gender,
}: PaginationOptions) => {
  if (Number.isNaN(Number(page))) page = 1;
  if (page < 1) page = 1;

  try {
    // 1. Obtener los products
    const productsFromDB = await prisma.product.findMany({
      take,
      skip: (page - 1) * take,
      include: { productImages: { take: 2, select: { url: true } } },
      where: { gender },
    });

    const products: Product[] = productsFromDB.map((product) => ({
      ...product,
      images: product.productImages.map((image) => image.url),
    }));

    // 2. Obtener el total de páginas
    const totalCount = await prisma.product.count({ where: { gender } });
    const totalPages = Math.ceil(totalCount / take);

    return {
      products,
      currentPage: page,
      totalPages,
    };
  } catch {
    throw new Error("Error al cargar los productos");
  }
};
