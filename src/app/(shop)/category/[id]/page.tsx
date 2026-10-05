// import { notFound } from "next/navigation";

import { ProductsGrid, Title } from "@/components";
import type { Gender } from "@/interfaces";
import { initialData } from "@/seed/seed";

interface CategoryPageProps {
  params: Promise<{ id: Gender }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { id } = await params;

  const products = initialData.products;
  const filteredProducts = products.filter((product) => product.gender === id);

  const genderLabels: Record<Gender, string> = {
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
        title={`Artículos ${genderLabels[id]}`}
        subTitle={"Todos los productos"}
        className="mb-2"
      />

      <ProductsGrid products={filteredProducts} />
    </>
  );
}
