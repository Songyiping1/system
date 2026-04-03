# 岗位管理 (position-manage)

## 业务背景
公司管理员管理岗位，查看岗位下的用户列表。

## 页面结构
左侧：岗位列表（公司为根节点）
右侧：选中岗位的用户列表

## 关联接口
| 功能 | 接口 | 备注 |
|---|---|---|
| 岗位列表 | GET /position/list | 需要 companyId |
| 岗位用户列表 | GET /position/user/list | 需要 positionId, companyId |
| 创建岗位 | POST /position/create | |
| 更新岗位 | POST /position/update | |
| 删除岗位 | POST /position/remove | 岗位下有用户时不可删 |

## 业务规则
- 左侧树支持右键：编辑、删除
- 删除前弹确认框
