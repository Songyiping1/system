# 项目规范

## ⛔ 工具调用铁律(最高优先级,每次必守)

**问题历史:** 本会话反复出现「工具调用标签未正确闭合 → malformed → 解析失败」,
严重浪费时间。这是绝对不可再犯的错误。

**强制执行:**

1. 每个工具调用的开标签与闭标签必须成对完整闭合,提交前在心里数一遍。
2. 拿不准时,一次只发一个工具调用,不要批量。
3. 文档/注释里绝不写裸的工具调用标签字面量(会污染解析)。
4. 命令行后台任务用工具自带的 run_in_background 参数,不要手写 `&`。

---

## 技术栈(rewrite/authx-alignment 分支,全新重写)

- Angular 20 + Standalone Components + signals + inject() + 新控制流(@if/@for)
- 组件库:**ng-primitives**(headless,只给行为,样式 100% 自写)+ @angular/cdk
- 状态管理:**@ngrx/signals**(SignalStore)
- 动画:**Motion**(常规交互:入场/hover/列表 stagger)+ **GSAP**(复杂时间线编排)
  - 设计目标:大量贯穿式动画 UI/UX,让用户「用起来像看动漫一样」
- HTTP:Angular HttpClient + 两个 functional interceptor
- 样式:SCSS + 项目 tokens(`@use '../shared/styles/tokens' as *`),主色 `$primary` #4857e2

## 后端对接(pass-authx)

后端是 **pass-authx**(Micronaut 4 + Java 21),所有接口已统一 `R<>` 包装。
两大域前缀:`/authx/*`(认证)、`/org/*`(组织架构)。

### 响应格式

成功:
```json
{ "isSuccess": true, "serverName": "...", "code": 200, "message": "成功", "data": {...} }
```
失败:
```json
{ "isSuccess": false, "serverName": "...", "code": 40001, "message": "xxx" }
```

> 注意:paas 的 ResponseWrapperSerializer 可能把对象字段平铺到顶层;
> R<> 包装的 org 域接口保留 data 字段。以 data 字段为准拆壳。

### 拆壳约定(core/http/)

- `response.interceptor.ts`:isSuccess=true 透传 `data`;isSuccess=false 抛 `ApiError`
- `auth.interceptor.ts`:注入 `Authorization: Bearer <token>`;401 清 token + 跳 /login
- 逃生舱:`RAW_RESPONSE` context token 置 true → 跳过拆壳拿完整壳;
  `SKIP_AUTH` 置 true → 匿名接口跳过 token 注入
- Service 默认直接拿业务数据:`http.get<UserVO>(url)` 返回 `UserVO`,**不写防御性解包**

## 目录结构

```
src/app/
├── core/
│   ├── http/      api-response.model / http-context / response.interceptor / auth.interceptor
│   ├── auth/      token.storage / auth.store(SignalStore)
│   └── animation/ motion(预设) / gsap(时间线)
├── shared/
│   ├── components/  16 个自建组件(沿用,见 index.ts)
│   └── styles/      _tokens.scss(设计 token)/ _dropdown.scss
├── layouts/        auth-layout(认证区) / main-layout(带侧边栏)
└── features/       auth / org / dashboard / profile
```

### 路由约定

- 前端路由前缀与后端 API 一致:`/authx/*`、`/org/*`,看 URL 即知调哪个接口
- 认证区(无需登录,AuthLayout):`/login`、`/register`、`/login/qr`、`/login/wechat`
- 主应用区(需登录,MainLayout + authGuard):`/dashboard`、`/org/*`、`/profile`

## 编码规范

- Service 返回类型写明,**禁止 `any`**,**禁止** `res.data ?? res.result ?? []` 防御性解包
- SCSS 引用 `$xxx` 变量前先确认 `_tokens.scss` 里存在(变量是 `$primary` 不是 `$color-primary`)
- 动画时长/缓动统一走 `core/animation/motion.ts` 的预设,不散落魔法值

## 组件使用约定(沿用的自建组件)

- 确认弹窗 `<app-modal>`;搜索框 `<app-search-input>`;按钮 `<app-button>`(type: primary/outline/danger)
- 下拉筛选 `<app-filter-select>`(自定义 dropdown,非原生 select)
- 数据表 `<app-data-table>`;树 `<app-tree-list>`(TreeNode 字段直接展开,无 data 包装,直接 `node.id`)
