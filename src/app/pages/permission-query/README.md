# 菜单权限查询 (permission-query)

## 业务背景
查询指定成员拥有的菜单权限树。

## 页面结构
左侧：组织架构树
右侧：选中成员的菜单权限树

## 关联接口
| 功能 | 接口 | 备注 |
|---|---|---|
| 组织架构树 | GET /organize/load | |
| 用户权限菜单树 | GET /menu/user/auth | 需要 companyId + userId |

## 业务规则
- 选择成员后展示其菜单权限树，包含权限来源（岗位/角色）

## 已知问题
- OrganizeMemberApiService 已注入但未使用，可能是遗留代码
