# ===== build =====
FROM node:20-slim AS build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY prisma ./prisma
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build TypeScript
RUN npm run build

# ===== runtime =====
FROM node:20-slim
WORKDIR /app

# Install OpenSSL for Prisma (required for PostgreSQL connections)
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
# Install production dependencies
RUN npm install --omit=dev

# Install Prisma CLI separately (needed for generate)
RUN npm install -g prisma@^5.19.1

# Copy Prisma schema
COPY prisma ./prisma

# Generate Prisma Client in runtime stage (ensures correct binary)
RUN prisma generate

# Copy built application
COPY --from=build /app/dist ./dist

ENV NODE_ENV=production
EXPOSE 8080
CMD ["node", "dist/server.js"]
