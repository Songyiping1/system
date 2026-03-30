# Controller 接口文档

本文档基于以下 Controller 与其关联 Command/Query/Handler 代码整理：

- `organize`
- `company`
- `role`
- `position`
- `menu`

说明：

- `@UserContext Context ctx` 为登录上下文，不属于前端显式传参。
- 未标注 `@Body` 的简单类型参数，按查询参数理解。
- 字段说明以代码语义为准；代码中未体现枚举含义的字段，按字面含义说明。

## 1. OrganizeController

Controller 路径前缀：`/organize`

### 1.1 POST `/organize/create`

功能说明：创建部门。仅公司管理员可操作；同级部门名称不能重复。

请求体：`OrganizeUpsertCommand`

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| id | String | 部门 ID；创建时通常不需要传 |
| name | String | 部门名称 |
| companyId | String | 所属公司 ID |
| parentId | String | 父级部门 ID |
| parentUri | String | 父级部门路径，用于生成当前部门路径 |
| status | Integer | 部门状态；创建接口中通常不重点使用 |

### 1.2 GET `/organize/load`

功能说明：加载当前登录公司下的组织架构树。仅管理员可查看。

请求参数：无

### 1.3 POST `/organize/update`

功能说明：修改部门信息或调整部门层级。仅公司管理员可操作；不能移动到自身子部门下。

请求体：`OrganizeUpsertCommand`

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| id | String | 部门 ID |
| name | String | 部门名称 |
| companyId | String | 所属公司 ID |
| parentId | String | 新父级部门 ID |
| parentUri | String | 新父级路径 |
| status | Integer | 部门状态 |

### 1.4 POST `/organize/delete`

功能说明：删除部门。仅公司管理员可操作；公司根节点不可删；有子部门或部门下仍有成员时不可删。

请求体：`OrganizeRemoveCommand`

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| id | String | 要删除的部门 ID |

### 1.5 GET `/organize/member/list`

功能说明：查询部门成员列表，包含目标部门及其所有下级部门成员。仅管理员可查看。

请求参数：

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| companyId | String | 公司 ID |
| deptId | String | 部门 ID。代码实际传入查询逻辑时按组织节点 ID 使用 |

### 1.6 POST `/organize/member/add`

功能说明：新增员工并绑定到部门。若手机号对应用户不存在，会自动创建用户；若存在离职关系，则重新启用并绑定。

请求体：`OrganizeBindCommand`

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| companyId | String | 公司 ID |
| userName | String | 员工姓名 |
| mobile | String | 手机号 |
| sex | Integer | 性别 |
| deptId | String | 部门 ID |
| orgId | String | 组织节点 ID/岗位绑定使用的组织 ID |
| userId | String | 用户 ID；已有用户时可传，新增用户时由系统生成 |
| state | Integer | 状态 |

### 1.7 POST `/organize/member/delete`

功能说明：员工离职/移出组织。支持批量移除，会同步清理组织关系和相关权限。

请求体：`OrganizeUserRemoveCommand`

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| companyId | String | 公司 ID |
| userList | List<RemoveUser> | 要移除的用户列表 |

`RemoveUser` 字段：

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| userId | String | 用户 ID |
| deptId | String | 所属部门 ID |
| orgId | String | 所属组织节点 ID |

### 1.8 POST `/organize/member/transfer`

功能说明：员工部门调动。

请求体：`OrganizeUserTransferCommand`

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| companyId | String | 公司 ID |
| oldDeptId | String | 原部门 ID |
| deptId | String | 新部门 ID |
| userId | String | 用户 ID |

### 1.9 GET `/organize/member/template`

功能说明：下载员工导入模板。模板中会带部门和岗位下拉项。仅管理员可下载。

请求参数：

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| companyId | String | 公司 ID |

### 1.10 POST `/organize/member/import`

功能说明：上传 Excel 导入员工，返回导入结果。

表单参数：

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| file | file | 导入文件，`multipart/form-data` |

### 1.11 POST `/organize/dept/leader`

功能说明：设置部门主管。

请求体：`OrganizeBindCommand`

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| companyId | String | 公司 ID |
| userName | String | 员工姓名 |
| mobile | String | 手机号 |
| sex | Integer | 性别 |
| deptId | String | 部门 ID |
| orgId | String | 组织节点 ID |
| userId | String | 用户 ID |
| state | Integer | 状态 |

### 1.12 GET `/organize/business/list`

功能说明：查询业务模块字典列表。仅 root 用户可查看。

请求参数：无

### 1.13 POST `/organize/business/manager`

功能说明：设置业务模块负责人。

请求体：`ModuleManagerCommand`

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| userId | String | 用户 ID |
| userName | String | 用户名 |
| companyId | String | 公司 ID |
| dataIds | List<Integer> | 负责的业务模块 ID 列表 |

### 1.14 GET `/organize/business/assigned`

功能说明：查询某用户已分配的业务模块 ID 列表。

请求参数：

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| companyId | String | 公司 ID |
| userId | String | 用户 ID |

### 1.15 POST `/organize/permission/list`

功能说明：查询权限操作日志。

请求体：`PermissionLogQuery`

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| companyId | String | 公司 ID |
| userId | String | 用户 ID |
| startTime | LocalDateTime | 查询开始时间 |
| endTime | LocalDateTime | 查询结束时间 |

### 1.16 POST `/organize/unBindUser`

功能说明：解绑用户。入参与返回值均为动态 JSON，对接方需要结合调用方约定传值。

请求体：`JsonObject`

## 2. CompanyController

Controller 路径前缀：`/company`

### 2.1 GET `/company/match`

功能说明：按关键字分页匹配公司信息。仅 root 用户可操作。

请求参数：

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| keyword | String | 搜索关键字 |
| pageNum | Integer | 页码 |

### 2.2 POST `/company/create`

功能说明：创建公司。仅 root 用户可操作；创建后会同步初始化公司组织、管理员账号和默认角色。

请求体：`CompanyUpsertCommand`

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| id | String | 公司 ID；创建时通常不需要传 |
| name | String | 公司名称 |
| aliasName | String | 公司别名 |
| logo | PictureEntry | 公司 Logo 对象 |
| contactPhone | String | 联系电话，同时用于初始化管理员账号手机号 |
| type | String | 公司类型 |
| guide | String | 引导说明/介绍 |
| creditNo | String | 统一社会信用代码 |

### 2.3 POST `/company/update`

功能说明：修改公司信息。仅 root 用户可操作；如修改联系电话，会同步更新管理员账号信息。

请求体：`CompanyUpsertCommand`

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| id | String | 公司 ID |
| name | String | 公司名称 |
| aliasName | String | 公司别名 |
| logo | PictureEntry | 公司 Logo 对象 |
| contactPhone | String | 联系电话 |
| type | String | 公司类型 |
| guide | String | 引导说明/介绍 |
| creditNo | String | 统一社会信用代码 |

### 2.4 POST `/company/apply`

功能说明：提交公司入驻/创建申请。无需上下文参数；系统会将申请状态置为待审核。

请求体：`CompanyUpsertCommand`

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| id | String | 公司 ID；通常不传 |
| name | String | 公司名称 |
| aliasName | String | 公司别名 |
| logo | PictureEntry | 公司 Logo 对象 |
| contactPhone | String | 联系电话 |
| type | String | 公司类型 |
| guide | String | 引导说明/介绍 |
| creditNo | String | 统一社会信用代码 |

### 2.5 GET `/company/apply/list`

功能说明：分页条件查询公司申请列表。仅 root 用户可查看。

请求参数：

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| name | String | 公司名称，可空 |
| status | Integer | 申请状态，可空 |

### 2.6 POST `/company/apply/review`

功能说明：审核公司申请。仅 root 用户可操作；审核通过后会正式开通公司并初始化管理员和默认角色。

请求体：`ApplyReviewCommand`

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| id | String | 申请记录对应的公司 ID |
| applyStatus | Integer | 审核状态 |

### 2.7 GET `/company/load`

功能说明：按名称和类型查询公司平铺列表。仅 root 用户可查看。

请求参数：

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| name | String | 公司名称，可空 |    
| type | String | 公司类型 |

### 2.8 GET `/company/list`

功能说明：按名称查询公司树形列表。仅 root 用户可查看。

请求参数：

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| name | String | 公司名称，可空 |

### 2.9 GET `/company/remove`

功能说明：物理删除公司及其管理员、角色、岗位、组织等数据。仅 root 用户可操作。

请求参数：

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| id | String | 公司 ID |

### 2.10 GET `/company/cooperation/list`

功能说明：查询某公司合作体系树。仅该公司管理员可查看。

请求参数：

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| companyId | String | 公司 ID |

### 2.11 GET `/company/cooperation/detail`

功能说明：查询合作关系统计信息，包括上下游公司数量和人数统计。仅该公司管理员可查看。

请求参数：

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| companyId | String | 公司 ID |

### 2.12 POST `/company/cooperation/apply`

功能说明：提交合作申请。仅申请方公司管理员可操作。

请求体：`CooperationApplyCommand`

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| companyId | String | 申请方公司 ID |
| parentId | String | 目标上级/合作公司 ID |
| linkDeptId | String | 对接部门 ID |
| status | Integer | 状态；实际保存时由后端设置 |
| applyTime | LocalDateTime | 申请时间；实际保存时由后端设置当前时间 |

### 2.13 POST `/company/cooperation/apply/review`

功能说明：审核合作申请。审核通过后会建立公司合作关系。

请求体：`CooperationApplyReviewCommand`

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| id | String | 合作申请记录 ID |
| status | Integer | 审核状态 |

### 2.14 GET `/company/cooperation/apply/list`

功能说明：查询指定公司的合作申请列表。仅该公司管理员可查看。

请求参数：

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| companyId | String | 公司 ID |

## 3. RoleController

Controller 路径前缀：`/role`

### 3.1 POST `/role/create`

功能说明：创建角色。仅公司管理员可操作；同公司下角色名称不可重复。

请求体：`RoleUpsertCommand`

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| id | String | 角色 ID；创建时通常不传 |
| name | String | 角色名称 |
| companyId | String | 公司 ID |
| description | String | 角色描述 |
| type | String | 角色类型，如角色/分组 |
| groupId | String | 所属分组 ID |

### 3.2 POST `/role/update`

功能说明：修改角色信息。仅公司管理员可操作。

请求体：`RoleUpsertCommand`

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| id | String | 角色 ID |
| name | String | 角色名称 |
| companyId | String | 公司 ID |
| description | String | 角色描述 |
| type | String | 角色类型 |
| groupId | String | 所属分组 ID |

### 3.3 POST `/role/menu/bind`

功能说明：为一个或多个角色分配菜单权限，会按差异增删角色菜单关联。

请求体：`RoleBindMenuCommand`

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| companyId | String | 公司 ID |
| roleIds | List<String> | 角色 ID 列表 |
| menuIds | List<String> | 菜单 ID 列表 |

### 3.4 GET `/role/menu/list`

功能说明：查询多个角色当前绑定的菜单及其来源角色。

请求参数：

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| roleIds | List<String> | 角色 ID 列表 |

### 3.5 POST `/role/remove`

功能说明：删除角色。要求角色不存在绑定用户；同时会清理岗位关联和菜单权限关联。

请求参数：

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| id | String | 角色 ID |

### 3.6 POST `/role/user/bind`

功能说明：绑定角色用户。接口按“目标用户集合”做差异计算，会自动补充新增用户并移除未保留用户。

请求体：`RoleBindUserCommand`

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| roleId | String | 角色 ID |
| userIds | List<String> | 用户 ID 列表 |

### 3.7 POST `/role/user/unbind`

功能说明：从角色中解除指定用户。

请求体：`RoleBindUserCommand`

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| roleId | String | 角色 ID |
| userIds | List<String> | 要解绑的用户 ID 列表 |

### 3.8 GET `/role/user/list`

功能说明：查询角色已绑定用户列表。

请求参数：

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| roleId | String | 角色 ID |

### 3.9 GET `/role/list`

功能说明：查询公司角色树，返回分组及分组下角色。仅该公司管理员可查看。

请求参数：

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| companyId | String | 公司 ID |

### 3.10 GET `/role/detail`

功能说明：查询角色详情。

请求参数：

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| id | String | 角色 ID |

## 4. PositionController

Controller 路径前缀：`/position`

### 4.1 POST `/position/create`

功能说明：创建岗位。仅公司管理员可操作；同公司同部门下岗位名称不可重复；可同步绑定角色。

请求体：`PositionUpsertCommand`

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| id | String | 岗位 ID；创建时通常不传 |
| name | String | 岗位名称 |
| companyId | String | 公司 ID |
| deptId | String | 所属部门 ID；`0` 通常表示通用岗位 |
| status | Integer | 岗位状态 |
| roleIds | List<String> | 关联角色 ID 列表 |

### 4.2 POST `/position/update`

功能说明：修改岗位信息并同步调整岗位关联角色。

请求体：`PositionUpsertCommand`

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| id | String | 岗位 ID |
| name | String | 岗位名称 |
| companyId | String | 公司 ID |
| deptId | String | 所属部门 ID |
| status | Integer | 岗位状态 |
| roleIds | List<String> | 关联角色 ID 列表 |

### 4.3 POST `/position/remove`

功能说明：删除岗位。要求岗位下不存在绑定用户；同时会清理岗位与角色的关系。

请求参数：

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| id | String | 岗位 ID |

### 4.4 GET `/position/list`

功能说明：查询某组织/部门下的岗位列表，并附带岗位关联角色列表。仅管理员可查看。

请求参数：

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| companyId | String | Controller 参数名为 `companyId`，但查询处理器实际按组织/部门 ID 使用 |

### 4.5 GET `/position/detail`

功能说明：查询岗位详情及其关联角色。

请求参数：

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| id | String | 岗位 ID |

### 4.6 GET `/position/user/list`

功能说明：查询岗位已绑定用户列表。

请求参数：

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| positionId | String | 岗位 ID |

## 5. MenuController

Controller 路径前缀：`/menu`

### 5.1 POST `/menu/create`

功能说明：创建系统菜单。仅 root 用户可操作；要求菜单名称、编码非空，且同级名称不能重复。

请求体：`MenuUpsertCommand`

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| id | String | 菜单 ID；创建时通常不传 |
| name | String | 菜单名称 |
| description | String | 菜单描述 |
| code | String | 菜单编码 |
| parentId | String | 父级菜单 ID |
| parentPath | String | 父级菜单路径 |
| icon | PictureEntry | 菜单图标对象 |
| menuType | MenuType | 菜单类型：`MENU`、`LABEL`、`BUTTON` |
| route | String | 前端路由 |
| status | Integer | 状态 |
| position | String | 展示位置 |

### 5.2 GET `/menu/detail`

功能说明：查询菜单详情。

请求参数：

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| id | String | 菜单 ID |

### 5.3 POST `/menu/update`

功能说明：修改菜单。仅 root 用户可操作；若菜单下仍有子菜单，则不能改成 `BUTTON` 类型。

请求体：`MenuUpsertCommand`

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| id | String | 菜单 ID |
| name | String | 菜单名称 |
| description | String | 菜单描述 |
| code | String | 菜单编码 |
| parentId | String | 父级菜单 ID |
| parentPath | String | 父级菜单路径 |
| icon | PictureEntry | 菜单图标对象 |
| menuType | MenuType | 菜单类型：`MENU`、`LABEL`、`BUTTON` |
| route | String | 前端路由 |
| status | Integer | 状态 |
| position | String | 展示位置 |

### 5.4 POST `/menu/remove`

功能说明：删除菜单。仅 root 用户可操作；存在子菜单时不可删除。

请求参数：

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| id | String | 菜单 ID |

### 5.5 GET `/menu/load`

功能说明：加载菜单树。root 用户可查看全量系统菜单；admin 用户可查看当前公司已分配菜单。

请求参数：无

### 5.6 POST `/menu/drag`

功能说明：拖拽调整菜单顺序和父子层级；会同步更新本菜单及其所有子菜单路径。

请求体：`MenuDragCommand`

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| id | String | 当前拖拽菜单 ID |
| code | String | 当前菜单编码 |
| parentId | String | 目标父菜单 ID |
| parentPath | String | 目标父菜单路径 |
| preOrder | BigDecimal | 前一个兄弟菜单的排序值 |

### 5.7 POST `/menu/assign`

功能说明：给公司分配菜单。仅 root 用户可操作；会先清空公司原有菜单，再全量重建。

请求体：`MenuAssignCommand`

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| companyId | String | 公司 ID |
| menuIds | List<String> | 分配的菜单 ID 列表 |

### 5.8 GET `/menu/assigned`

功能说明：查询公司已分配的菜单 ID 列表。仅 root 用户可查看。

请求参数：

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| companyId | String | 公司 ID |

### 5.9 GET `/menu/assigned/list`

功能说明：查询公司已分配菜单树。仅 root 用户可查看。

请求参数：

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| companyId | String | 公司 ID |

### 5.10 GET `/menu/auth`

功能说明：登录后获取当前用户实际拥有权限的菜单树。

请求参数：无

### 5.11 GET `/menu/user/auth`

功能说明：查询指定用户的菜单权限树，并标识权限来源（岗位/角色）。

请求参数：

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| userId | String | 用户 ID |

### 5.12 GET `/menu/user/auth/diff`

功能说明：对比两个用户的菜单权限差异。

请求参数：

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| fromUserId | String | 对比源用户 ID |
| toUserId | String | 对比目标用户 ID |