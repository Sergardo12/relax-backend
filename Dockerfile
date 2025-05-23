# 1. Usa una imagen base oficial de Node.js
FROM node:20-alpine

# 2. Define el directorio donde se trabajará dentro del contenedor
WORKDIR /app

# 3. # Copiar los archivos necesarios para instalar dependencias con Yarn
COPY package.json yarn.lock ./

# 4. Instala las dependencias
RUN yarn install

# 5. Copia todo el proyecto al contenedor
COPY . .

# 6. Compila el proyecto TypeScript a JavaScript
RUN yarn build

# 7. Expone el puerto que usará la app
EXPOSE 3000

# 8. Comando para iniciar la app en modo producción
CMD ["yarn", "start:prod"]
