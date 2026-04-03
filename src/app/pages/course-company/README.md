# 课程公司管理 (course-company)

## 业务背景
root 管理员管理 CSES 中的课程公司。

## 关联接口
| 功能 | 接口 | 备注 |
|---|---|---|
| 加载课程公司列表 | GET /company/load | type='course' |
| 搜索公司 | GET /company/match | |
| 创建课程公司 | POST /company/create | type='course' |
| 删除公司 | GET /company/remove | |

## 设计稿
- 新建抽屉：figma.com/design/TPav9RQfIDAvneqPDcC5uu?node-id=760-11474

## 业务规则
- 新建课程公司表单字段：课程公司名称、公司导向、管理员手机号、课程Logo
- 创建时 type 固定为 'course'
