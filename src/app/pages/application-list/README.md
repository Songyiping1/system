# 入驻申请列表 (application-list)

## 业务背景
root 管理员审核公司入驻申请，可批准或驳回。

## 关联接口
| 功能 | 接口 | 备注 |
|---|---|---|
| 申请列表 | GET /company/apply/list | 参数 companyId, applyStatus |
| 审核申请 | POST /company/apply/review | |

## 业务规则
- 支持按状态筛选
- 驳回时需填写驳回原因
