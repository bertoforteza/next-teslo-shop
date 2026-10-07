export const generatePaginationNumbers = (
  currentPage: number,
  totalPages: number,
) => {
  // Si el número total de páginas es 7 o menos
  // vamos a mostrar todas las páginas sin puntos suspensivos
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1); // [1,2,3,4,5,6,7]
  }

  // Si la página actual está entre las 3 primeras
  // mostraremos las 3 primeras páginas, puntos suspensivos y las 2 últimas
  if (currentPage <= 3) {
    return [1, 2, 3, "...", totalPages - 1, totalPages]; // [1,2,3, "...", 49, 50]
  }

  // Si la página actual está entre las 3 últimas
  // mostraremos las 2 primeras páginas, puntos suspensivos y las 3 últimas
  if (currentPage >= totalPages - 2) {
    return [1, 2, "...", totalPages - 2, totalPages - 1, totalPages]; // [1,2, "...", 48, 49, 50]
  }

  // Si la página actual está en un lugar intermedio
  // mostraremos la primera página, puntos suspensivos, la página actual y las siguientes
  return [
    1,
    "...",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "...",
    totalPages,
  ];
};
