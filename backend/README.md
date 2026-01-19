# Kanban Board Backend API

看板任务管理系统的后端 API 服务。

## 技术栈

- **Node.js** + **TypeScript**
- **Express** - Web 框架
- **Prisma** - ORM
- **PostgreSQL** - 数据库
- **Zod** - 参数校验

## 项目结构

```
backend/
├─ src/
│  ├─ app.ts                    # Express 应用配置
│  ├─ server.ts                 # HTTP 服务器启动
│  ├─ routes/                   # 路由定义
│  ├─ controllers/              # 控制器（HTTP 层）
│  ├─ services/                 # 业务逻辑层
│  ├─ repositories/             # 数据访问层
│  ├─ validators/               # 参数校验
│  ├─ middlewares/              # 中间件
│  ├─ config/                   # 配置
│  └─ utils/                    # 工具函数
├─ prisma/
│  └─ schema.prisma             # Prisma schema
├─ migrations/
│  └─ init.sql                  # 数据库初始化脚本
└─ Dockerfile                   # Docker 构建文件
```

## 环境变量

创建 `.env` 文件（参考 `.env.example`）：

```env
PORT=8080
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_USER=kanban
DB_PASSWORD=kanban
DB_NAME=kanban

DATABASE_URL=postgresql://kanban:kanban@localhost:5432/kanban?schema=public
```

## 本地开发

### 1. 安装依赖

```bash
npm install
```

### 2. 生成 Prisma Client

```bash
npm run prisma:generate
```

### 3. 运行数据库迁移（可选，如果使用 Prisma Migrate）

```bash
npm run prisma:migrate
```

### 4. 启动开发服务器

```bash
npm run dev
```

服务将在 `http://localhost:8080` 启动。

## Docker 部署

### 使用 docker-compose（推荐）

在项目根目录运行：

```bash
docker compose up
```

这将启动：
- PostgreSQL 数据库（端口 5432）
- 数据库迁移容器
- 后端 API 服务（端口 8080）
- 前端服务（端口 3000）

### 单独构建后端镜像

```bash
docker build -t kanban-backend ./backend
```

## API 接口

### 1. 获取任务列表

```http
GET /api/tasks?status=Todo
```

响应：
```json
{
  "code": 0,
  "message": "ok",
  "data": [
    {
      "id": "uuid",
      "title": "任务标题",
      "description": "任务描述",
      "status": "Todo",
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### 2. 创建任务

```http
POST /api/tasks
Content-Type: application/json

{
  "title": "任务标题",
  "description": "任务描述（可选）"
}
```

### 3. 获取单个任务

```http
GET /api/tasks/:id
```

### 4. 更新任务

```http
PUT /api/tasks/:id
Content-Type: application/json

{
  "title": "新标题（可选）",
  "description": "新描述（可选）",
  "status": "Doing（可选）"
}
```

### 5. 删除任务

```http
DELETE /api/tasks/:id
```

## 错误码

- `1001`: 参数校验失败
- `2001`: 任务不存在
- `9000`: 未知错误

## 日志

日志采用 JSON 格式输出，包含：
- `timestamp`: 时间戳
- `level`: 日志级别（INFO/ERROR/WARN）
- `context`: 上下文信息
- `message`: 日志消息
- `requestId`: 请求 ID（用于追踪）

## 健康检查

```http
GET /health
```

响应：
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```
