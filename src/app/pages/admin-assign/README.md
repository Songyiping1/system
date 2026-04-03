# 管理员分配 (admin-assign)

## 业务背景
给成员分配业务模块管理权限。

## 页面结构
左侧：组织架构树
右侧：选中成员后展示业务模块列表，可勾选分配

## 关联接口
| 功能 | 接口 | 备注 |
|---|---|---|
| 组织架构树 | GET /organize/load | |
| 业务模块列表 | GET /organize/business/list | |
| 已分配模块 | GET /organize/business/assigned | 需要 companyId + userId |
| 保存分配 | POST /organize/business/manager | |

## 业务规则
- 选择树节点后加载该成员已分配的业务模块
- 勾选/取消后点保存调 setBusinessManager
