# WhatsAgent - Configuración y Despliegue con Docker

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

## Configuración del Entorno

Crea un archivo `.env` en la raíz del proyecto con la siguiente configuración:

```env
JWT_SECRET_KEY="una clave segura"

HOST="localhost"
PORT=5432
USER="usuario"
PASS="clave"
DB="whatsagent"
```

## Configuración de Docker

### 1. Crear `Dockerfile`

Crea un archivo `Dockerfile` en la raíz del proyecto con el siguiente contenido:

```dockerfile
# Usa la imagen oficial de Node.js
FROM node:18-alpine

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos necesarios
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto del código de la aplicación
COPY . .

# Expone el puerto de la aplicación
EXPOSE 3000

# Comando por defecto para ejecutar la aplicación
CMD ["npm", "run", "start"]
```

### 2. Crear `docker-compose.yml`

Crea un archivo `docker-compose.yml` en la raíz del proyecto con la siguiente configuración:

```yaml
version: '3.8'
services:
  app:
    build: .
    container_name: whatsagent_app
    ports:
      - "3000:3000"
    env_file:
      - .env
    depends_on:
      - db
  
  db:
    image: postgres:14-alpine
    container_name: whatsagent_db
    restart: always
    environment:
      POSTGRES_USER: "usuario"
      POSTGRES_PASSWORD: "clave"
      POSTGRES_DB: "whatsagent"
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

## Despliegue con Docker

### 1. Construir la imagen y levantar los contenedores

```bash
docker-compose up --build -d
```

### 2. Verificar los contenedores en ejecución

```bash
docker ps
```

### 3. Ver logs de la aplicación

```bash
docker logs -f whatsagent_app
```

### 4. Detener los contenedores

```bash
docker-compose down
```
