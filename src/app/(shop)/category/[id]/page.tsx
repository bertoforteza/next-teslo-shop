import { notFound } from "next/navigation";

interface CategoryPageProps {
  params: Promise<{ id: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { id } = await params;

  if (id === "kids") {
    notFound();
  }

  return (
    <div>
      <h1>Category Page</h1>
    </div>
  );
}
