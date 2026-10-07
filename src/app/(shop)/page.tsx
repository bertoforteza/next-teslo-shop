export const revalidate = 60; // los datos se revalidarán cada minuto

import { getPaginatedProductsWithImages } from "@/actions";
import { Pagination, ProductsGrid, Title } from "@/components";
import { redirect } from "next/navigation";

interface HomePageProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const page = (await searchParams).page
    ? parseInt((await searchParams).page as string)
    : 1;
  const { products, totalPages } = await getPaginatedProductsWithImages({
    page,
  });

  if (products.length === 0) {
    redirect("/");
  }

  return (
    <>
      <Title title="Tienda" subTitle="Todos los productos" className="mb-2" />

      <ProductsGrid products={products} />

      <Pagination totalPages={totalPages} />
    </>
  );
}
