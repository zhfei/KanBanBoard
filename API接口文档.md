# Kanban Board API 接口文档

## 1. 基本信息

### 1.1 API 基础信息

- **基础 URL**: `http://localhost:8080`
- **API 版本**: v1
- **协议**: HTTP/HTTPS
- **数据格式**: JSON
- **字符编码**: UTF-8

### 1.2 认证方式

当前版本无需认证，后续版本可能添加 JWT 认证。

### 1.3 请求头

所有请求需要包含以下请求头：

```
Content-Type: application/json
X-Request-ID: <可选，用于请求追踪>
```

## 2. 统一响应格式

### 2.1 成功响应

所有成功响应都遵循以下格式：

```json
{
  "code": 0,
  "message": "ok",
  "data": <响应数据>
}
```

**字段说明：**

| 字段 | 类型 | 说明 |
|------|------|------|
| code | number | 响应码，0 表示成功 |
| message | string | 响应消息 |
| data | any \| null | 响应数据，成功时包含实际数据，失败时为 null |

### 2.2 错误响应

所有错误响应都遵循以下格式：

```json
{
  "code": <错误码>,
  "message": "<错误消息>",
  "data": null
}
```

**错误码说明：**

| 错误码 | HTTP 状态码 | 说明 |
|--------|------------|------|
| 1001 | 400 | 参数校验失败 |
| 2001 | 404 | 任务不存在 |
| 9000 | 500 | 未知错误 |
| 404 | 404 | 接口不存在 |

## 3. 数据模型

### 3.1 Task（任务）

```typescript
interface Task {
  id: string;              // UUID，任务唯一标识
  title: string;           // 任务标题，必填，最大长度 200 字符
  description?: string;   // 任务描述，可选
  status: TaskStatus;      // 任务状态：'Todo' | 'Doing' | 'Done'
  created_at: string;      // ISO 8601 格式的创建时间
  updated_at: string;      // ISO 8601 格式的更新时间
}
```

**字段说明：**

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | string (UUID) | 是 | 任务唯一标识，由系统自动生成 |
| title | string | 是 | 任务标题，1-200 个字符 |
| description | string | 否 | 任务描述，可选 |
| status | 'Todo' \| 'Doing' \| 'Done' | 是 | 任务状态 |
| created_at | string (ISO 8601) | 是 | 创建时间，自动生成 |
| updated_at | string (ISO 8601) | 是 | 更新时间，自动更新 |

## 4. 接口列表

### 4.1 健康检查

检查 API 服务是否正常运行。

**请求：**

```http
GET /health
```

**响应示例：**

```json
{
  "status": "ok",
  "timestamp": "2026-01-19T12:00:00.000Z"
}
```

**状态码：**

- `200 OK` - 服务正常运行

---

### 4.2 获取任务列表

获取所有任务，支持按状态过滤。

**请求：**

```http
GET /api/tasks?status={status}
```

**查询参数：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| status | 'Todo' \| 'Doing' \| 'Done' | 否 | 按状态过滤，不传则返回所有任务 |

**请求示例：**

```bash
# 获取所有任务
curl -X GET http://localhost:8080/api/tasks

# 获取 Todo 状态的任务
curl -X GET "http://localhost:8080/api/tasks?status=Todo"
```

**成功响应：**

```json
{
  "code": 0,
  "message": "ok",
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "设计产品原型",
      "description": "使用 Figma 完成产品原型设计",
      "status": "Todo",
      "created_at": "2026-01-19T10:00:00.000Z",
      "updated_at": "2026-01-19T10:00:00.000Z"
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "title": "实现用户认证功能",
      "description": "完成用户注册、登录功能",
      "status": "Doing",
      "created_at": "2026-01-19T09:00:00.000Z",
      "updated_at": "2026-01-19T11:00:00.000Z"
    }
  ]
}
```

**错误响应：**

```json
{
  "code": 1001,
  "message": "参数校验失败: status: Invalid enum value. Expected 'Todo' | 'Doing' | 'Done', received 'Invalid'",
  "data": null
}
```

**状态码：**

- `200 OK` - 成功
- `400 Bad Request` - 参数校验失败

---

### 4.3 获取单个任务

根据任务 ID 获取单个任务的详细信息。

**请求：**

```http
GET /api/tasks/:id
```

**路径参数：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | string (UUID) | 是 | 任务唯一标识 |

**请求示例：**

```bash
curl -X GET http://localhost:8080/api/tasks/550e8400-e29b-41d4-a716-446655440000
```

**成功响应：**

```json
{
  "code": 0,
  "message": "ok",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "设计产品原型",
    "description": "使用 Figma 完成产品原型设计",
    "status": "Todo",
    "created_at": "2026-01-19T10:00:00.000Z",
    "updated_at": "2026-01-19T10:00:00.000Z"
  }
}
```

**错误响应：**

```json
{
  "code": 2001,
  "message": "任务不存在",
  "data": null
}
```

**状态码：**

- `200 OK` - 成功
- `400 Bad Request` - 参数校验失败（无效的 UUID 格式）
- `404 Not Found` - 任务不存在

---

### 4.4 创建任务

创建一个新任务。

**请求：**

```http
POST /api/tasks
Content-Type: application/json
```

**请求体：**

```typescript
{
  title: string;        // 必填，1-200 个字符
  description?: string; // 可选
}
```

**请求示例：**

```bash
curl -X POST http://localhost:8080/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "完成项目文档",
    "description": "编写 README 和 API 文档"
  }'
```

**成功响应：**

```json
{
  "code": 0,
  "message": "任务创建成功",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440002",
    "title": "完成项目文档",
    "description": "编写 README 和 API 文档",
    "status": "Todo",
    "created_at": "2026-01-19T12:00:00.000Z",
    "updated_at": "2026-01-19T12:00:00.000Z"
  }
}
```

**错误响应：**

```json
{
  "code": 1001,
  "message": "参数校验失败: title: 任务标题不能为空",
  "data": null
}
```

**状态码：**

- `201 Created` - 创建成功
- `400 Bad Request` - 参数校验失败

**注意事项：**

- 新创建的任务默认状态为 `Todo`
- `id`、`created_at`、`updated_at` 由系统自动生成

---

### 4.5 更新任务

更新任务的标题、描述或状态。

**请求：**

```http
PUT /api/tasks/:id
Content-Type: application/json
```

**路径参数：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | string (UUID) | 是 | 任务唯一标识 |

**请求体：**

```typescript
{
  title?: string;        // 可选，1-200 个字符
  description?: string;  // 可选
  status?: 'Todo' | 'Doing' | 'Done'; // 可选
}
```

**请求示例：**

```bash
# 更新任务标题和描述
curl -X PUT http://localhost:8080/api/tasks/550e8400-e29b-41d4-a716-446655440000 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "更新后的任务标题",
    "description": "更新后的描述"
  }'

# 更新任务状态（用于拖拽）
curl -X PUT http://localhost:8080/api/tasks/550e8400-e29b-41d4-a716-446655440000 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "Doing"
  }'

# 同时更新多个字段
curl -X PUT http://localhost:8080/api/tasks/550e8400-e29b-41d4-a716-446655440000 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "更新后的标题",
    "description": "更新后的描述",
    "status": "Done"
  }'
```

**成功响应：**

```json
{
  "code": 0,
  "message": "任务更新成功",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "更新后的任务标题",
    "description": "更新后的描述",
    "status": "Doing",
    "created_at": "2026-01-19T10:00:00.000Z",
    "updated_at": "2026-01-19T12:30:00.000Z"
  }
}
```

**错误响应：**

```json
{
  "code": 2001,
  "message": "任务不存在",
  "data": null
}
```

**状态码：**

- `200 OK` - 更新成功
- `400 Bad Request` - 参数校验失败
- `404 Not Found` - 任务不存在

**注意事项：**

- 只传递需要更新的字段即可
- `updated_at` 字段会自动更新为当前时间
- 用于拖拽功能时，通常只传递 `status` 字段

---

### 4.6 删除任务

删除指定的任务。

**请求：**

```http
DELETE /api/tasks/:id
```

**路径参数：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | string (UUID) | 是 | 任务唯一标识 |

**请求示例：**

```bash
curl -X DELETE http://localhost:8080/api/tasks/550e8400-e29b-41d4-a716-446655440000
```

**成功响应：**

```json
{
  "code": 0,
  "message": "任务删除成功",
  "data": null
}
```

**错误响应：**

```json
{
  "code": 2001,
  "message": "任务不存在",
  "data": null
}
```

**状态码：**

- `200 OK` - 删除成功
- `400 Bad Request` - 参数校验失败（无效的 UUID 格式）
- `404 Not Found` - 任务不存在

---

## 5. 使用示例

### 5.1 JavaScript/TypeScript 示例

```typescript
// 获取所有任务
const response = await fetch('http://localhost:8080/api/tasks');
const result = await response.json();
if (result.code === 0) {
  const tasks = result.data;
  console.log('Tasks:', tasks);
}

// 创建任务
const createResponse = await fetch('http://localhost:8080/api/tasks', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    title: '新任务',
    description: '任务描述',
  }),
});
const createResult = await createResponse.json();
if (createResult.code === 0) {
  console.log('Task created:', createResult.data);
}

// 更新任务状态（拖拽）
const updateResponse = await fetch('http://localhost:8080/api/tasks/550e8400-e29b-41d4-a716-446655440000', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    status: 'Doing',
  }),
});
const updateResult = await updateResponse.json();
if (updateResult.code === 0) {
  console.log('Task updated:', updateResult.data);
}

// 删除任务
const deleteResponse = await fetch('http://localhost:8080/api/tasks/550e8400-e29b-41d4-a716-446655440000', {
  method: 'DELETE',
});
const deleteResult = await deleteResponse.json();
if (deleteResult.code === 0) {
  console.log('Task deleted');
}
```

### 5.2 cURL 示例

```bash
# 1. 健康检查
curl http://localhost:8080/health

# 2. 获取所有任务
curl http://localhost:8080/api/tasks

# 3. 获取 Todo 状态的任务
curl "http://localhost:8080/api/tasks?status=Todo"

# 4. 获取单个任务
curl http://localhost:8080/api/tasks/550e8400-e29b-41d4-a716-446655440000

# 5. 创建任务
curl -X POST http://localhost:8080/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "新任务",
    "description": "任务描述"
  }'

# 6. 更新任务
curl -X PUT http://localhost:8080/api/tasks/550e8400-e29b-41d4-a716-446655440000 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "更新后的标题",
    "status": "Doing"
  }'

# 7. 删除任务
curl -X DELETE http://localhost:8080/api/tasks/550e8400-e29b-41d4-a716-446655440000
```

## 6. 错误处理

### 6.1 常见错误场景

**参数校验失败（1001）：**

```json
{
  "code": 1001,
  "message": "参数校验失败: title: 任务标题不能为空",
  "data": null
}
```

**任务不存在（2001）：**

```json
{
  "code": 2001,
  "message": "任务不存在",
  "data": null
}
```

**接口不存在（404）：**

```json
{
  "code": 404,
  "message": "接口不存在",
  "data": null
}
```

**未知错误（9000）：**

```json
{
  "code": 9000,
  "message": "发生未知错误",
  "data": null
}
```

### 6.2 错误处理建议

1. 始终检查响应中的 `code` 字段
2. `code === 0` 表示成功，其他值表示失败
3. 根据 `code` 值进行相应的错误处理
4. 向用户显示友好的错误消息（`message` 字段）

## 7. 注意事项

1. **请求 ID**：建议在请求头中包含 `X-Request-ID`，便于日志追踪
2. **超时处理**：建议设置合理的请求超时时间（默认 30 秒）
3. **幂等性**：PUT 和 DELETE 操作是幂等的，可以安全地重复执行
4. **数据验证**：所有输入数据都会在后端进行严格验证
5. **CORS**：当前配置允许 `http://localhost:3000` 访问，生产环境需要调整

## 8. 版本历史

- **v1.0.0** (2026-01-19)
  - 初始版本
  - 实现任务 CRUD 操作
  - 支持按状态过滤任务
  - 统一响应格式和错误处理
