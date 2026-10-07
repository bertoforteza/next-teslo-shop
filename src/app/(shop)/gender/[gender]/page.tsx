// import { notFound } from "next/navigation";

import { getPaginatedProductsWithImages } from "@/actions";
import { Pagination, ProductsGrid, Title } from "@/components";
import { Gender } from "@/generated/prisma/enums";
import { redirect } from "next/navigation";

interface CategoryPageProps {
  params: Promise<{ gender: string }>;
  searchParams: Promise<{
    page?: string;
  }>;
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { gender } = await params;
  const page = (await searchParams).page
    ? parseInt((await searchParams).page as string)
    : 1;

  const { products, totalPages } = await getPaginatedProductsWithImages({
    page,
    gender: gender as Gender,
  });

  if (products.length === 0) {
    redirect(`/gender/${gender}`);
  }

  const genderLabels: Record<string, string> = {
    men: "para hombres",
    women: "para mujeres",
    kid: "para niños",
    unisex: "Unisex",
  };

  // if (id === "kids") {
  //   notFound();
  // }

  return (
    <>
      <Title
        title={`Artículos ${genderLabels[gender]}`}
        subTitle={"Todos los productos"}
        className="mb-2"
      />

      <ProductsGrid products={products} />

      <Pagination totalPages={totalPages} />
    </>
  );
}
