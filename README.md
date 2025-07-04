# Microservicio de usuarios - Taller 2 - Arquitectura de Sistemas

Microservicio de usuarios para operaciones típicas y sencillas sobre los usuarios del sistema **Streamflow** del taller 2 del curso "Arquitectura de Sistemas".

## Autor

**Jairo Calcina Valda - 20.734.228-9**

## Pre-requisitos

- [Node.js](https://nodejs.org/es/) (version 23.11.0)
- [Docker Engine o Docker Desktop](https://docs.docker.com/manuals/)
- [PostgreSQL](https://www.postgresql.org/download/) (version 14)

**Nota**: PostgreSQL es configurable mediante Docker sin la necesidad de la descarga cuando se trabaja en un entorno de desarrollo, y se recomienda que se trabaje con Docker para la configuración de este repositorio. Sin embargo, si este microservicio se trabaja en conjunto con todo el sistema de **Streamflow**, omita la configuración de Docker en este repositorio.

## Instalación y configuración

1. **Clonar el repositorio**

```bash
git clone https://github.com/Broukt/users-service
```

2. **Ingresar al directorio del proyecto**

```bash
cd users-service
```

3. **Instalar las dependencias**

```bash
npm install
```

4. **Crear un archivo `.env` en la raíz del proyecto y ingresar las variables de entorno**

```bash
cp .env.example .env
```

5. **Iniciar el contenedor de Docker** (Sólo si **NO** se trabaja en conjunto con la API Gateway de Streamflow)

```bash
docker compose up -d
```

6. **Generar cliente de prisma**

```bash
npx prisma generate
```

7. **Crear la base de datos**

```bash
npx prisma db push
```

## Ejecutar la aplicación

```bash
npm start
```

El servidor se iniciará en el puerto **50051** (o en el puerto definido en la variable de entorno `PORT`). Accede a la API mediante `localhost:50051`.

## Seeder

Para poblar la base de datos con datos de prueba, ejecuta el siguiente comando:

```bash
npm run seed
```