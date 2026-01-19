## 1. 目标与原则

- 目标：确保根目录 `docker-compose.yml` 可一键启动并访问（前端/后端/数据库联调）。
- 原则：
    - 可复制落地
    - 服务依赖清晰（db → backend → frontend）
    - 日志与错误可定位
    - 端口映射明确

---

## 2. frontend/Dockerfile（多阶段构建 + Nginx）

> 前端容器对外端口为 80，在 compose 中映射到本机 3000（`3000:80`）。
> 

```docker
# ===== build =====
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ===== runtime =====
FROM nginx:1.25-alpine

# SPA 路由：history fallback
COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 2.1 frontend/nginx.conf（建议新增）

```
server {
  listen 80;
  server_name _;

  root /usr/share/nginx/html;
  index index.html;

  location / {
    try_files $uri $uri/ /index.html;
  }
}
```

---

## 3. backend/Dockerfile（多阶段构建，生产依赖最小化）

> 后端对外端口为 8080。
> 

```docker
# ===== build =====
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ===== runtime =====
FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=build /app/dist ./dist

ENV NODE_ENV=production
EXPOSE 8080
CMD ["node", "dist/app.js"]
```

---

## 4. 数据库初始化 / Migration 设计

二选一（推荐 B，结构更清晰）：

### 4.1 方案 A：后端启动时自动迁移

- backend 启动时检测并执行 migration。
- 要求：migration 幂等，重复执行不报错。

### 4.2 方案 B：独立 migration 容器

- compose 中增加 `migrate` 服务。
- 依赖 `db` healthy 后执行迁移并退出。

---

## 5. docker-compose.yml（可直接复制落地，PostgreSQL 版本）

> 端口示例：前端 3000，后端 8080，DB 5432。
> 

```yaml
services:
  db:
    image: postgres:16-alpine
    container_name: kanban-db
    environment:
      POSTGRES_DB: kanban
      POSTGRES_USER: kanban
      POSTGRES_PASSWORD: kanban
    ports:
      - "5432:5432"
    volumes:
      - db_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U kanban -d kanban"]
      interval: 5s
      timeout: 3s
      retries: 20

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: kanban-backend
    environment:
      PORT: 8080
      DB_HOST: db
      DB_PORT: 5432
      DB_USER: kanban
      DB_PASSWORD: kanban
      DB_NAME: kanban
      # 可选：CORS 允许前端域名
      # CORS_ORIGIN: http://localhost:3000
    depends_on:
      db:
        condition: service_healthy
    ports:
      - "8080:8080"
    restart: unless-stopped

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: kanban-frontend
    depends_on:
      - backend
    ports:
      - "3000:80"
    restart: unless-stopped

volumes:
  db_data:
```

---

## 6. 关键访问关系（联调闭环）

- 浏览器访问前端：[`http://localhost:3000`](http://localhost:3000)
- 前端容器访问后端：[`http://backend:8080`](http://backend:8080)
- 后端容器访问数据库：`db:5432`

---

## 7. 验收清单（Docker 维度）

- 根目录存在 `docker-compose.yml`
- `docker compose up` 后：
    - [`http://localhost:3000`](http://localhost:3000) 可访问
    - [`http://localhost:8080/api/tasks`](http://localhost:8080/api/tasks) 可访问并返回统一结构
    - 拖拽更新后刷新不丢失（已落库）
    - 容器日志可定位问题（至少包含 path、statusCode、耗时；建议带 requestId）