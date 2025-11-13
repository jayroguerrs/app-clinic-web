# Etapa de build con Node 14 (compatible con node-sass@4.14.1)
FROM node:14 AS build

ARG BUILD_CONFIG=production

WORKDIR /app

# Instala dependencias con caché
COPY package*.json ./
RUN npm ci || npm install

# Copia el resto del código y compila
COPY . .
RUN npm run build -- --configuration=${BUILD_CONFIG}

# Etapa de runtime con Nginx
FROM nginx:1.24-alpine
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]