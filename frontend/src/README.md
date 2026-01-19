# Kanban Board - 看板任务管理系统

这是一个类似 Trello 的看板任务管理系统前端应用，支持任务在 Todo/Doing/Done 三列之间拖拽移动。

## 功能特性

- ✅ 看板三列布局（待办 / 进行中 / 已完成）
- ✅ 任务拖拽移动，支持列间切换
- ✅ 任务创建、编辑、删除
- ✅ 乐观更新策略，失败自动回滚
- ✅ 实时数据同步
- ✅ 响应式设计，适配桌面端
- ✅ 企业级代码规范：错误处理、日志、校验、组件化

## 技术栈

- **React 18** + **TypeScript** - 现代化前端框架
- **Tailwind CSS v4** - 原子化CSS框架
- **react-dnd** - 拖拽功能实现
- **Lucide React** - 图标库
- **Sonner** - Toast通知

## 项目结构

\`\`\`
/
├── api/                    # API 客户端
│   ├── httpClient.ts      # HTTP 请求封装
│   └── tasksApi.ts        # 任务 API
├── components/            # React 组件
│   ├── KanbanBoard/       # 看板组件
│   │   ├── KanbanBoard.tsx
│   │   ├── KanbanColumn.tsx
│   │   └── TaskCard.tsx
│   └── TaskModal/         # 任务弹窗
│       └── TaskModal.tsx
├── pages/                 # 页面组件
│   └── KanbanPage.tsx
├── state/                 # 状态管理
│   └── tasksStore.tsx     # 任务状态管理
├── types/                 # TypeScript 类型
│   └── task.ts
├── utils/                 # 工具函数
│   ├── env.ts            # 环境配置
│   ├── errors.ts         # 错误处理
│   └── logger.ts         # 日志工具
└── App.tsx               # 主入口
\`\`\`

## 后端 API 接口

应用需要对接以下后端 API 接口：

### 1. 获取任务列表
\`\`\`
GET /api/tasks
Query: status (可选，值为 Todo/Doing/Done)
Response: { code: 0, message: "ok", data: Task[] }
\`\`\`

### 2. 创建任务
\`\`\`
POST /api/tasks
Body: { title: string, description?: string }
Response: { code: 0, message: "ok", data: Task }
\`\`\`

### 3. 更新任务
\`\`\`
PUT /api/tasks/{id}
Body: { title?: string, description?: string, status?: TaskStatus }
Response: { code: 0, message: "ok", data: Task }
\`\`\`

### 4. 删除任务
\`\`\`
DELETE /api/tasks/{id}
Response: { code: 0, message: "ok", data: null }
\`\`\`

### Task 数据结构
\`\`\`typescript
interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'Todo' | 'Doing' | 'Done';
  created_at: string;
  updated_at: string;
}
\`\`\`

## 环境配置

应用通过环境变量配置 API 地址：

\`\`\`bash
VITE_API_BASE_URL=http://localhost:3001
\`\`\`

默认值为 \`http://localhost:3001\`

## 关键特性说明

### 1. 拖拽功能
- 使用 react-dnd 实现任务卡片拖拽
- 支持跨列拖拽
- 拖拽时视觉反馈清晰

### 2. 乐观更新
- 拖拽任务时，UI 立即更新
- API 调用失败时自动回滚
- 必要时重新加载全部任务保证数据一致性

### 3. 错误处理
- 统一的错误处理机制
- 友好的错误提示
- 完整的日志记录

### 4. 数据校验
- 前端参数校验
- 标题长度限制（200字符）
- 状态值白名单校验

### 5. 日志记录
- 请求级别日志（requestId、耗时、状态码）
- 业务级别日志（任务创建、更新、删除、移动）
- 错误日志记录

## 设计原则

项目遵循以下软件设计原则：

1. **单一职责原则 (SRP)**: 每个模块只负责一件事
2. **开闭原则 (OCP)**: 通过接口和组合实现扩展
3. **接口隔离原则 (ISP)**: 使用 TypeScript 接口定义清晰的契约
4. **依赖倒置原则 (DIP)**: 依赖抽象而非具体实现
5. **高内聚低耦合**: 模块之间通过明确的接口通信

## 使用说明

### 基本操作

1. **查看任务**: 页面加载后自动显示所有任务，按状态分组
2. **新建任务**: 点击"待办"列标题旁的 ➕ 按钮
3. **编辑任务**: 鼠标悬停在任务卡片上，点击编辑图标
4. **删除任务**: 鼠标悬停在任务卡片上，点击删除图标
5. **移动任务**: 拖拽任务卡片到目标列
6. **刷新数据**: 点击右上角的"刷新"按钮

### 键盘快捷键

- **ESC**: 关闭弹窗

## 浏览器支持

- Chrome (推荐)
- Firefox
- Safari
- Edge

## 许可证

MIT
