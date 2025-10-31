# 玉石雅韵数据库设计与数据迁移方案（初稿）

## 目标与范围
- 前端网站所有业务数据全面迁移并接入数据库，满足商品、订单、用户、分类、网站内容与首页元素（轮播图、公告）等场景。
- 后台管理系统基于完整 RBAC 权限控制，支持运营与客服工作流。
- 满足第三范式、主外键完整性、事务与并发控制、合理索引策略、GDPR 合规。

## 技术选型
- 数据库：PostgreSQL（关系型、事务与并发能力强，丰富索引与约束）
- ORM：Prisma（类型安全、迁移管理、事务支持）
- 后端：Node.js + Express（或可平滑升级至 NestJS）

## 规范化与约束
- 第三范式：实体独立、字段原子、非键字段完全依赖主键且相互独立。
- 主外键：所有引用均通过外键约束维护一致性；删除策略以 `RESTRICT`/`SET NULL` 为主。
- 事务与并发：订单、库存、支付等关键流程统一使用数据库事务（序列化或可重复读），结合乐观锁或库存扣减事务。
- 索引策略：主键 + 外键索引、常用查询字段（如 `slug`、`code`、`email`、`status` 等）建 BTREE 索引；全文/前缀检索可增加 GIN/Trigram。

## 核心实体（概要）
- 用户（User）：账号、凭证（passwordHash）、基本资料、状态、GDPR 同意记录、地址、订单、积分/钱包、角色关联。
- 角色与权限（Role/Permission/UserRole/RolePermission）：RBAC 权限模型，覆盖管理端所有模块操作粒度（view/manage/import/export）。
- 分类（Category）：自引用层级结构（parentId），与商品多对多关联（ProductCategory）。
- 商品与 SKU（Product/Sku）：商品基本信息（name/slug/description/status），SKU 维度承载库存、价格、属性（JSON）。
- 订单（Order/OrderItem）：订单主表（状态、支付、物流、总额）、子项（SKU/数量/单价）。
- 支付（Payment）：支付方式、金额、状态、交易号、时间。
- 物流（Shipment）：承运商、运单号、状态、时点、收货地址。
- 地址（Address）：用户/订单地址信息，支持作为订单快照。
- 营销（Coupon/UserCoupon）：优惠券规则与用户领用记录。
- 积分（PointLedger）：积分流水（发放、消费、调整）。
- 钱包（WalletEntry）：钱包流水（充值、消费、退款、调整）。
- 内容（ContentPage）：静态页面内容（/about /culture /history 等），支持 Markdown/富文本。
- 首页元素（CarouselItem/Announcement）：轮播图与公告（时效、级别与排序）。

## 事务与并发控制
- 下单：以事务写入 `Order` 与 `OrderItem`，并扣减 `Sku.stock`（或库存表），失败回滚。必要时使用 `SELECT ... FOR UPDATE` 防止超卖。
- 退款：订单与支付状态变更、钱包或原路退回流水以事务保证一致。
- 支付回调：幂等处理（基于 `transactionId` 唯一约束），重复回调安全。

## 索引与性能
- 唯一约束：`User.username`、`User.email`（可选）、`Sku.skuCode`、`Product.slug`、`Category.slug`、`Coupon.code` 等。
- 组合索引：`Order(userId,status,createdAt)`、`Payment(orderId,status)`、`Shipment(orderId,status)` 等。
- 层级分类：`Category(parentId)` 索引；必要时维护冗余字段（如 `path`）用于快速查询（保持第三范式的同时在服务层构造）。

## GDPR 与合规
- 明确用户数据用途与保留周期；记录 `GDPRConsent`（包含个人数据与营销许可）。
- 密码不可逆加密（bcrypt）；敏感信息加密存储（如必要时加密电话）。
- 提供数据导出与删除接口；按需脱敏展示。

## 数据迁移映射（从前端现状到数据库）
- 商品与SKU：现有产品与属性数据 → `Product`/`Sku`，分类映射至 `Category` 与 `ProductCategory`。
- 订单：前端模拟或历史订单 → `Order`/`OrderItem`，支付与物流补充至 `Payment`/`Shipment`。
- 用户：现有注册数据 → `User` 与 `Address`，积分/钱包流水至 `PointLedger`/`WalletEntry`。
- 内容：前端静态页面文案 → `ContentPage`（以 `slug` 标识），支持富文本。
- 首页元素：轮播与公告 → `CarouselItem` 与 `Announcement`。

## 后台管理模块映射（RBAC）
- 用户管理：users:view/manage；权限分配：rbac:assign。
- 商品与分类：products:view/manage；categories:view/manage；inventory:adjust。
- 会员与积分：members:view/manage；points:grant/redeem。
- 营销：coupons:view/manage。
- 订单：orders:view/manage；refunds:process。
- 支付与物流：payments:config；shipments:fulfill/track。
- 客户服务：support:chat/surveys/feedback。
- 系统：operators:manage；settings:update。

## 实时同步与监听
- 数据变更监听：数据库触发器或应用层事件总线（例如订单状态变更触发通知/物流更新）。
- 实时同步：前端通过 WebSocket 或 SSE 与后端订阅关键事件；后台对外提供 webhook（如支付/物流回调）。

## 迁移校验工具（设计）
- 目标：校验源数据完整性、唯一性约束、外键可解析性、页文案覆盖率等。
- 实现思路：Node 脚本读取源（JSON/CSV/TS）、运行规则校验（唯一、必填、格式、关联），输出报告（通过/警告/错误）。
- 后续：集成到 CI（GitHub Actions），每次数据变更自动校验。

## 下一步实施
1) 配置 PostgreSQL 与 `.env`，生成 Prisma 客户端并迁移。
2) 实现 API（商品/分类/订单/用户/内容等），接入前端占位客户端。
3) 搭建后台管理界面与 RBAC 校验中间件。
4) 编写与落地迁移校验工具与流水线。
## 认证与令牌（后端）
- JWT 载荷精简：仅包含 `sub`（用户ID或`admin-default`）、`username`、`roles`、`exp`。
- 不再包含 `email`；需要邮箱时请从数据库查询。
- 中间件在数据库可用时以最新角色为准；数据库不可用时回退使用令牌中的 `roles`。