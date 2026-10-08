-- CreateTable
CREATE TABLE "Country" (
    "name" TEXT NOT NULL,
    "id" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Country_name_key" ON "Country"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Country_id_key" ON "Country"("id");
