# Етап 1: встановлення лише робочих залежностей
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN if [ -f package-lock.json ]; then npm ci --omit=dev; \
    else npm install --omit=dev; fi \
    && npm cache clean --force
# Етап 2: мінімальний образ для запуску
FROM node:20-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY package*.json index.js ./
USER node
EXPOSE 3002
CMD ["node", "index.js"]
