# Descripción

## Levantar en desarrollo

1. Clonar el repositorio
2. Crear una copia del `.env.template` y renombrarlo a `.env` y cambiar las variables de entorno
3. Instalar dependencias `pnpm install` o `npm install`
4. Levantar la base de datos `docker compose up -d`
5. Ejecutar las migraciones de Prisma `npx prisma migrate dev`
6. Ejecutar seed `pnpm run seed`
7. Levantar el proyecto `pnpm run dev` o `npm run dev`
