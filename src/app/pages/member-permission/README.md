# 成员管理权限 (member-permission)

## 业务背景
查看公司所有成员的管理权限分配情况。

## 关联接口
| 功能 | 接口 | 备注 |
|---|---|---|
| 业务模块列表 | GET /organize/business/list | |
| 成员列表 | GET /organize/member/list | deptId 传空字符串查全部 |

## 业务规则
- 展示成员列表和对应的权限信息
