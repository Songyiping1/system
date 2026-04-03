# 角色管理 (role-manage)

## 业务背景
公司管理员管理角色（含分组），查看角色下的用户列表。

## 页面结构
左侧：角色树（分组 > 角色）
右侧：选中角色的用户列表

## 关联接口
| 功能 | 接口 | 备注 |
|---|---|---|
| 角色树 | GET /role/list | 需要 companyId |
| 角色用户列表 | GET /role/user/list | 需要 roleId, companyId |
| 创建角色 | POST /role/create | |
| 更新角色 | POST /role/update | |
| 删除角色 | POST /role/remove | 角色下有用户时不可删 |

## 业务规则
- 左侧树支持右键：编辑、添加子角色、删除
- 删除前弹确认框
