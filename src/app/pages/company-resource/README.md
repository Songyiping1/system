# 公司资源管理 (company-resource)

## 业务背景
root 管理员管理入驻 CSES 的公司，查看公司已分配的菜单资源。

## 页面结构
上方卡片：公司列表（可搜索、勾选、新建、删除）
下方卡片：选中公司的菜单列表（固定高度 326px，可收起为 1 行）

## 关联接口
| 功能 | 接口 | 备注 |
|---|---|---|
| 加载公司列表 | GET /company/load | type='company' |
| 搜索公司 | GET /company/match | 实时搜索，用于新建时自动补全 |
| 创建公司 | POST /company/create | type='company' |
| 删除公司 | GET /company/remove | 参数名是 id 不是 companyId |
| 公司已分配菜单 | GET /menu/assigned/list | 可能报错（公司未分配过菜单时），需 error 降级 |

## 设计稿
- 主页面展开：figma.com/design/TPav9RQfIDAvneqPDcC5uu?node-id=313-2102
- 菜单收起状态：figma.com/design/TPav9RQfIDAvneqPDcC5uu?node-id=332-4452

## 业务规则
- 进入页面默认选中第一个公司，加载其菜单列表
- 点击公司行切换选中并刷新菜单
- 上方列表滚动到底时，下方菜单卡片自动收起（只保留表头+1行）
- 右上角箭头图标可手动展开/收起菜单卡片
- 菜单为空时显示"暂无资源"
- 新建公司时公司名称输入框有实时搜索下拉建议（debounce 300ms）
- 选择建议项会自动回填公司名称和信用代码
