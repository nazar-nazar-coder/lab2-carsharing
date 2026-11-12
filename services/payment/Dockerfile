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
# npm/yarn не потрібні для запуску: прибираємо їх із фінального образу
RUN rm -rf /usr/local/lib/node_modules/npm /usr/local/bin/npm /usr/local/bin/npx \n    /opt/yarn* /usr/local/bin/yarn /usr/local/bin/yarnpkg
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY package*.json index.js ./
USER node
EXPOSE 3004
CMD ["node", "index.js"]
