# 菜单分配 (menu-assign)

## 业务背景
root 管理员给公司分配菜单权限。

## 页面结构
左侧：公司树形列表
右侧：全量菜单树，已分配的打勾

## 关联接口
| 功能 | 接口 | 备注 |
|---|---|---|
| 公司树形列表 | GET /company/list | |
| 全量菜单树 | GET /menu/load | |
| 已分配菜单 ID | GET /menu/assigned | 返回 string[]，可能报错需降级 |
| 保存/取消分配 | POST /menu/assign | menuIds 为空数组即取消所有分配 |

## 业务规则
- 进入页面加载公司列表，默认选第一个公司
- 右侧先加载 menu/load 全量菜单，再加载 menu/assigned 已分配 ID，标记 checked
- 勾选子节点：所有祖先节点自动勾选
- 父节点有子节点被选中时：checkbox 禁用不能取消
- 子节点全部取消后父节点恢复可操作
- 保存按钮：收集所有 checked 的菜单 ID（递归），调 assignMenu
- 取消按钮：弹确认框"确定要取消分配给「XX公司」的所有菜单吗？"，确认后发送空数组
