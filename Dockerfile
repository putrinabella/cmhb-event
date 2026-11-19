# =========================
# Base image
# =========================
FROM node:20-alpine AS base
WORKDIR /app

# =========================
# Dev stage
# =========================
FROM base AS dev

# Copy dependency files only
COPY ./app/package*.json ./

# Install dependencies
RUN --mount=type=cache,target=/root/.npm \
    npm install --legacy-peer-deps

# Source code will be mounted via volume
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host"]

# =========================
# Build stage (Prod/Staging)
# =========================
FROM base AS build
COPY ./app/package*.json ./
RUN npm install
COPY ./app .
RUN npm run build

# =========================
# Production stage
# =========================
FROM nginx:alpine AS production

# Copy build output
COPY --from=build /app/dist /usr/share/nginx/html

# Copy env template
COPY ./app/public/env.template.js /usr/share/nginx/html/env.template.js

# Copy entrypoint
COPY ./docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# SPA fallback
RUN sed -i 's/index  index.html index.htm;/index index.html index.htm; try_files $uri $uri\/ \/index.html;/g' \
    /etc/nginx/conf.d/default.conf

EXPOSE 80
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
