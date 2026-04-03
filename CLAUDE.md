# 项目规范

## 技术栈

- Angular 20 + Standalone Components
- 使用 signals、inject()、新控制流（@if/@for）
- 样式使用 SCSS + 项目 tokens（`@use '../../shared/styles/tokens' as *`）

## 接口对接规范

### 后端响应格式

后端所有接口返回统一包装格式：

```json
{
  "isSuccess": true,
  "serverName": "cses-37",
  "items": [...]   // 实际数据
}
```

**例外：** 登录接口 `/User/login` 不使用 items 包装，字段直接平铺在顶层。

### 错误响应

```json
{
  "isSuccess": false,
  "error": "错误信息",
  "url": "/xxx"
}
```

拦截器 `auth.interceptor.ts` 会统一将 `isSuccess: false` 转为 `HttpErrorResponse` 抛出。

### Service 层规范

- 返回列表/对象的接口：使用 `this.http.getItems<T>()` 或 `this.http.postItems<T>()` 自动从 items 解包
- 操作类接口（创建/更新/删除）：使用 `this.http.post<void>()` 不解包
- 登录等特殊接口：使用 `this.http.post<LoginVo>()` 不解包
- **禁止** 在组件中写 `res.data ?? res.result ?? []` 等防御性解包
- **禁止** 在 Service 返回类型中使用 `any`

### 接口文档

- OpenAPI 文档位于 `src/app/api/openapi.json`
- 接口说明文档位于 `controller-api-organize-company-role-position-menu.md`
- 写接口调用前必须先查阅接口文档，确认参数名和响应格式

### 对接新接口的步骤

1. 查 `openapi.json` 确认请求参数和响应字段
2. 确认响应是否有 items 包装（大部分有，登录等少数没有）
3. Service 方法使用 `getItems`/`postItems` 或 `get`/`post`，写明类型
4. 组件中 subscribe 的 error 回调要处理（降级显示空状态）

## 类型定义规范

### TreeNode

后端使用 `@JsonUnwrapped`，字段直接展开在节点上，**没有 data 包装**：

```typescript
// 正确 ✓
export type TreeNode<T> = T & { children?: TreeNode<T>[] };

// 错误 ✗（后端不是这个格式）
export interface TreeNode<T> { data?: T; children?: TreeNode<T>[] }
```

使用时直接 `node.id`、`node.name`，不要写 `node.data.id`。

### ApiResponse

```typescript
interface ApiResponse<T> {
  isSuccess: boolean;
  items: T;
  serverName?: string;
}
```

定义在 `src/app/api/request/http.service.ts`，同时在 `src/app/api/types/index.ts` 中导出。

## 设计稿还原规范

- 开发前先用 Figma MCP 获取截图，确认布局和数值
- 设计稿中的数值（宽度、间距、圆角）精确使用，不用 `flex:1` 等模糊方式替代固定值
- 开发完用 Chrome CDP 截图对比设计稿
- 卡片容器统一使用 `border: 1px solid $border; border-radius: 8px`

## 组件使用约定

- 确认弹窗使用 `<app-modal>`
- 表单抽屉使用 drawer 模式（右侧滑入，700px 宽度）
- 搜索框使用 `<app-search-input>`
- 按钮使用 `<app-button>` 并指定 type（primary/outline/danger）
- 下拉筛选使用 `<app-filter-select>`（自定义 dropdown，非原生 select）

## 交互开发规范

### 弹窗确认模式

弹窗确认操作依赖的数据，**必须在打开弹窗前存到独立 signal**，不能在确认回调中从右键菜单 signal 读取：

```typescript
// 正确 ✓ — 打开弹窗前保存
this.deletingNode.set(node);
this.showDeleteModal.set(true);
// 确认时从 deletingNode 读取

// 错误 ✗ — closeContextMenu() 已将 contextMenuNode 置空
this.closeContextMenu();
this.showDeleteModal.set(true);
// 确认时 this.contextMenuNode() 已经是 null
```

### 事件冒泡与下拉菜单

使用 `@HostListener('document:click')` 关闭菜单时，**触发按钮必须 `$event.stopPropagation()`**：

```html
<!-- 正确 ✓ -->
<app-button label="更多" (click)="$event.stopPropagation(); toggleMenu()" />

<!-- 错误 ✗ — document:click 在同一事件循环内会立即关闭 -->
<app-button label="更多" (click)="toggleMenu()" />
```

### 接口方法校验

- `openapi.json` 中标注的 HTTP method **可能与后端实际不一致**，以实际调用报错为准
- 编辑/更新类接口必须传完整上下文（如 `parentId`、`parentUri`），不能只传修改的字段
- 新写完 service 后，运行 `/api-check` 技能校验一致性

### 交互实现 checklist

实现一个页面的交互前，必须：

1. 用 `/figma-scan` 找到该模块的**所有**设计稿页面（不只是主页面）
2. 逐个截图确认交互状态
3. 列出所有 TODO / 空方法，对照设计稿逐个实现
4. **禁止**只看一个设计稿页面就开始写代码
