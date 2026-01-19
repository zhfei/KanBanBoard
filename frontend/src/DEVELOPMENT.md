# 开发指南

## 快速开始

### 1. 环境准备

确保已安装：
- Node.js 18+
- npm 或 yarn

### 2. 安装依赖

\`\`\`bash
npm install
\`\`\`

### 3. 配置环境变量

复制 \`.env.example\` 到 \`.env\`：

\`\`\`bash
cp .env.example .env
\`\`\`

编辑 \`.env\` 文件，配置 API 地址：

\`\`\`
VITE_API_BASE_URL=http://localhost:3001
\`\`\`

### 4. 启动开发服务器

\`\`\`bash
npm run dev
\`\`\`

应用将在 http://localhost:5173 启动

## Mock 模式

如果后端 API 尚未准备好，可以启用 Mock 模式进行开发：

1. 打开 \`/api/mockApi.ts\`
2. 将 \`ENABLE_MOCK\` 设置为 \`true\`
3. 重启开发服务器

Mock 模式会使用本地模拟数据，无需连接真实后端。

## 项目架构

### 分层设计

\`\`\`
┌─────────────────────────────────┐
│        UI Components            │  ← React 组件层
├─────────────────────────────────┤
│      State Management           │  ← Context + Reducer
├─────────────────────────────────┤
│         API Client              │  ← HTTP 请求封装
├─────────────────────────────────┤
│        Backend API              │  ← RESTful API
└─────────────────────────────────┘
\`\`\`

### 目录说明

- **/api** - API 客户端和 HTTP 请求封装
  - \`httpClient.ts\` - 统一的 HTTP 请求处理，支持超时、错误处理、日志记录
  - \`tasksApi.ts\` - 任务相关的 API 接口封装
  - \`mockApi.ts\` - Mock 数据服务

- **/components** - React 组件
  - \`/KanbanBoard\` - 看板相关组件
  - \`/TaskModal\` - 任务编辑弹窗
  - \`/ui\` - 通用 UI 组件库

- **/pages** - 页面组件
  - \`KanbanPage.tsx\` - 看板主页面

- **/state** - 状态管理
  - \`tasksStore.tsx\` - 任务状态管理 (Context + Reducer)

- **/types** - TypeScript 类型定义
  - \`task.ts\` - 任务相关类型

- **/utils** - 工具函数
  - \`env.ts\` - 环境变量配置
  - \`errors.ts\` - 错误处理工具
  - \`logger.ts\` - 日志记录工具

## 关键功能实现

### 1. 拖拽功能

使用 \`react-dnd\` 库实现：

\`\`\`typescript
// 可拖拽的任务卡片
const [{ isDragging }, dragRef] = useDrag({
  type: 'TASK',
  item: { id: task.id, status: task.status },
});

// 可放置的列
const [{ isOver, canDrop }, dropRef] = useDrop({
  accept: 'TASK',
  drop: (item) => onDrop(item.id, newStatus),
});
\`\`\`

### 2. 乐观更新

拖拽任务时的处理流程：

1. 立即更新 UI（乐观更新）
2. 调用 API 更新后端
3. 如果失败，回滚到原状态
4. 必要时重新加载所有任务

\`\`\`typescript
// Optimistic update
dispatch({ type: 'OPTIMISTIC_UPDATE', payload: { id, status: newStatus } });

try {
  await tasksApi.updateTask(id, { status: newStatus });
} catch (error) {
  // Rollback
  dispatch({ type: 'ROLLBACK_UPDATE', payload: originalTask });
  await fetchTasks(); // Refetch all tasks
}
\`\`\`

### 3. 错误处理

统一的错误处理流程：

\`\`\`typescript
try {
  await tasksApi.createTask(payload);
} catch (error) {
  const message = getUserErrorMessage(error);
  toast.error('创建任务失败', { description: message });
  logger.error('Failed to create task', { error: message });
}
\`\`\`

### 4. 日志记录

每个请求都会记录：

- Request ID（请求唯一标识）
- Method & URL
- Status Code
- Latency（耗时）
- 错误信息（如果有）

\`\`\`typescript
logger.info('Request started: GET /api/tasks', { requestId, url });
logger.info('Request completed', { requestId, statusCode, latency });
logger.error('API Error', { requestId, code, message });
\`\`\`

## 代码规范

### 命名约定

- **组件**: PascalCase (例: \`TaskCard.tsx\`)
- **函数/变量**: camelCase (例: \`fetchTasks\`)
- **常量**: UPPER_SNAKE_CASE (例: \`DEFAULT_TIMEOUT\`)
- **类型/接口**: PascalCase (例: \`Task\`, \`ApiResponse\`)

### 注释规范

使用 JSDoc 注释：

\`\`\`typescript
/**
 * Create a new task
 * @param title - Task title (required, max 200 chars)
 * @param description - Task description (optional)
 * @returns Promise with created task
 */
async createTask(title: string, description?: string): Promise<Task>
\`\`\`

### 错误处理

- 所有异步操作都需要 try-catch
- 使用自定义 \`ApiError\` 类
- 提供用户友好的错误提示
- 记录错误日志

## 测试

### 手动测试清单

- [ ] 加载页面，显示初始任务
- [ ] 创建新任务（标题必填）
- [ ] 编辑任务（标题、描述）
- [ ] 删除任务（需要确认）
- [ ] 拖拽任务到不同列
- [ ] 拖拽失败回滚测试（断开网络）
- [ ] 刷新页面，数据保持
- [ ] 错误提示显示正确
- [ ] 响应式布局正常

## 部署

### Docker 部署

前端应该与后端、数据库一起通过 Docker Compose 部署。

参考 \`docker-compose.yml\`（需要在项目根目录创建）：

\`\`\`yaml
version: '3.8'
services:
  frontend:
    build: ./frontend
    ports:
      - "80:80"
    environment:
      - VITE_API_BASE_URL=http://backend:3001
    depends_on:
      - backend
  
  backend:
    build: ./backend
    ports:
      - "3001:3001"
    depends_on:
      - db
  
  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=kanban
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
\`\`\`

### 环境变量配置

不同环境使用不同的 API 地址：

- **开发环境**: \`http://localhost:3001\`
- **Docker 环境**: \`http://backend:3001\`
- **生产环境**: 实际的后端 API 地址

## 常见问题

### Q: API 请求失败怎么办？

A: 
1. 检查后端服务是否启动
2. 确认 \`VITE_API_BASE_URL\` 配置正确
3. 查看浏览器控制台的错误日志
4. 可以临时启用 Mock 模式进行前端开发

### Q: 拖拽不生效？

A: 
1. 确保已安装 \`react-dnd\` 和 \`react-dnd-html5-backend\`
2. 检查 \`DndProvider\` 是否正确包裹组件
3. 确认任务卡片已经连接 \`dragRef\`

### Q: 如何添加新的状态列？

A: 
1. 更新 \`TaskStatus\` 类型定义
2. 在 \`KanbanBoard\` 中添加新的 \`KanbanColumn\`
3. 更新后端 API 支持新的状态值

## 性能优化建议

1. **使用 React.memo** 减少不必要的重渲染
2. **useMemo/useCallback** 优化昂贵计算和回调函数
3. **虚拟滚动** 如果任务数量很多
4. **图片懒加载** 如果任务包含图片
5. **请求去重** 防止重复请求

## 贡献指南

1. Fork 项目
2. 创建特性分支 (\`git checkout -b feature/AmazingFeature\`)
3. 提交更改 (\`git commit -m 'Add some AmazingFeature'\`)
4. 推送到分支 (\`git push origin feature/AmazingFeature\`)
5. 创建 Pull Request

## 联系方式

项目仓库: https://github.com/zhfei/KanBanBoard.git
