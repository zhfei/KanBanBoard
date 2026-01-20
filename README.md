# Kanban Board - 看板任务管理系统

一个基于 React + Node.js 的现代化看板任务管理系统，支持类似 Trello 的任务拖拽操作。通过 Docker Compose 实现一键部署，前后端完全容器化。

## ✨ 功能特性

- 📋 **任务管理**：完整的任务 CRUD 操作（创建、查看、编辑、删除）
- 🎯 **拖拽流转**：支持任务在 Todo、Doing、Done 三列之间自由拖拽
- 🔄 **实时同步**：拖拽操作立即同步到后端数据库，数据持久化
- 🎨 **现代化 UI**：基于 React + Radix UI 的美观界面设计
- 🐳 **容器化部署**：Docker Compose 一键启动所有服务
- 📱 **响应式设计**：适配不同屏幕尺寸

## 🛠️ 技术栈

### 前端

| 技术 | 版本 | 用途 |
|------|------|------|
| React | ^18.3.1 | UI 框架 |
| TypeScript | - | 类型安全 |
| Vite | 6.3.5 | 构建工具 |
| React DnD | - | 拖拽功能 |
| Radix UI | - | UI 组件库 |
| Tailwind CSS | - | 样式框架 |

### 后端

| 技术 | 版本 | 用途 |
|------|------|------|
| Node.js | 20 | 运行时环境 |
| Express | ^4.21.1 | Web 框架 |
| TypeScript | ^5.5.4 | 类型安全 |
| Prisma | ^5.19.1 | ORM 框架 |
| PostgreSQL | 16 | 关系型数据库 |
| Zod | ^3.23.8 | 参数校验 |

### 部署

| 技术 | 用途 |
|------|------|
| Docker | 容器化 |
| Docker Compose | 服务编排 |
| Nginx | 前端静态资源服务 |

## 📁 项目结构

```
.
├── frontend/              # 前端应用
│   ├── src/
│   │   ├── api/          # API 客户端
│   │   ├── components/   # React 组件
│   │   ├── pages/        # 页面组件
│   │   ├── state/        # 状态管理
│   │   └── utils/        # 工具函数
│   ├── Dockerfile        # 前端 Docker 配置
│   └── package.json
├── backend/              # 后端 API
│   ├── src/
│   │   ├── controllers/  # 控制器层
│   │   ├── services/     # 业务逻辑层
│   │   ├── repositories/ # 数据访问层
│   │   ├── routes/       # 路由定义
│   │   ├── validators/   # 参数校验
│   │   ├── middlewares/  # 中间件
│   │   └── config/       # 配置文件
│   ├── migrations/       # 数据库迁移脚本
│   ├── prisma/           # Prisma schema
│   ├── Dockerfile        # 后端 Docker 配置
│   └── package.json
├── docker-compose.yml    # Docker Compose 配置
├── API接口文档.md        # API 接口文档
└── 启动说明.md           # 详细启动说明

```

## 🚀 快速开始

### 前置要求

- [Docker](https://www.docker.com/get-started) (>= 20.10)
- [Docker Compose](https://docs.docker.com/compose/install/) (>= 2.0)

> **注意**：确保 Docker 和 Docker Compose 已正确安装并运行。

### 一键启动

1. **克隆项目**

```bash
git clone https://github.com/zhfei/KanBanBoard.git
cd KanBanBoard
```

2. **启动所有服务**

```bash
docker compose up
```

3. **访问应用**

- 前端界面：http://localhost:3000
- 后端 API：http://localhost:8080
- 数据库：localhost:5432

### 验证启动成功

1. **检查服务状态**

```bash
docker compose ps
```

应该看到以下服务都在运行：
- `kanban-db` (PostgreSQL 数据库)
- `kanban-backend` (后端 API)
- `kanban-frontend` (前端服务)

> **注意**：`kanban-migrate` 服务执行完数据库迁移后会自动退出，这是正常的。

2. **查看日志**

```bash
# 查看所有服务日志
docker compose logs -f

# 查看特定服务日志
docker compose logs -f backend
docker compose logs -f frontend
```

3. **测试 API**

```bash
# 健康检查
curl http://localhost:8080/health

# 获取任务列表
curl http://localhost:8080/api/tasks
```

### 停止服务

```bash
# 停止所有服务（保留数据）
docker compose stop

# 停止并删除容器（保留数据卷）
docker compose down

# 停止并删除容器和数据卷（完全清理）
docker compose down -v
```

## 💡 使用说明

### 基本操作

1. **创建任务**
   - 点击右上角的"新建任务"按钮
   - 填写任务标题（必填）和描述（可选）
   - 点击"保存"，任务会自动添加到 Todo 列

2. **查看任务详情**
   - 点击任务卡片查看详情
   - 在弹窗中可以查看完整的任务信息

3. **编辑任务**
   - 点击任务卡片打开详情弹窗
   - 修改标题、描述或状态
   - 点击"保存"保存更改

4. **拖拽任务**
   - 按住任务卡片
   - 拖拽到目标列（Todo/Doing/Done）
   - 释放鼠标，任务会自动保存到新状态

5. **删除任务**
   - 在任务详情弹窗中点击"删除"按钮
   - 确认删除操作


## 📝 许可证

本项目采用 ISC 许可证。

## 🔗 相关链接

- [项目仓库](https://github.com/zhfei/KanBanBoard)
- [详细启动说明](启动说明.md)
- [API 接口文档](API接口文档.md)
- [技术文档](技术文档/)

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

**注意**：本 README 描述了项目的使用和开发方法。如果您是作为考核项目查看，原始考核要求请参考项目历史提交记录。
