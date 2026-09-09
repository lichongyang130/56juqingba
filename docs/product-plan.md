# 「5 合 1」UI 资源平台 — 产品方案（英文站：前台 + 后台）

> 目标：做一个英文站，功能覆盖 Motion Sites / React Bits / Uiverse / Anime.js / Aceternity UI 五者的合集，
> 但**所有内容原创且质量高于现状**（组件、Prompt、背景、教学全部自产 + 质检后开放社区）。

---

## 0. 一句话定位

**"The open web-craft platform"——组件、AI 建站 Prompt、动画实验室、教学 4 大板块合一的英文站。**
用户心智：*"去这里找现成的前端灵感 → 现场改 → 复制/生成 → 直接能用，且比别家更可靠。"*

---

## 1. 竞品拆解与"更好"清单

### 1.1 五个站各卖什么

| 站 | 核心资产 | 商业模式 | 我们能借鉴的功能点 |
|---|---|---|---|
| Motion Sites (motionsites.ai) | 100+ 动画网站的 AI 生成 Prompt（分类：Landing/Agency/SaaS/3D/Travel…）+ 动画背景库 | Freemium / 会员 | ① Prompt 卡片墙 ② 分类浏览 ③ 一键复制 ④ 会员解锁 |
| React Bits (reactbits.dev) | 170+ React 动画组件/背景（Blob Cursor、Aurora、Orbit Images…） | 免费 + 47k Stars | ① 实时可调参数的预览 ② 背景/文本/动画分组 ③ 即拷即用 |
| Uiverse (uiverse.io) | 7418 个社区 HTML/CSS/Tailwind 微元素（按钮/加载/开关） | 免费 + 社区众包 | ① 海量微元素 ② Tag/搜索 ③ 多格式导出（HTML/CSS/React/Figma） |
| Anime.js (animejs.com) | 开源动画引擎（~24.5KB，模块化：Timeline/Draggable/Scroll/Spring…） | 开源 MIT | ① 精细文档 ② 可交互示例 ③ 弹簧/滚动等动画概念本身 |
| Aceternity UI (ui.aceternity.com) | 200+ React+Tailwind 区块/模板（Hero/Features/Pricing…），120k+ 用户 | Freemium（All-Access） | ① Section/Block 化组织 ② 组件→区块→模板分层 ③ 120k 用户的信任背书打法 |

### 1.2 五个站的共性与痛点（我们的机会）

1. **形态分散**：用户要找"一个按钮 + 一个 Hero + 一条 AI Prompt"得跑 5 个站、注册 5 个账号、学 5 套用法。
2. **无实机预览**：Motion Sites 只有截图，无法在购买前"试运行"Prompt 效果。
3. **质量无门槛**：Uiverse 等社区内容参差、老旧、几乎无无障碍（a11y）与可访问性标注。
4. **难换肤/难改造**：组件与品牌色、设计变量绑定，拿回去改半天（Aceternity 的痛点）。
5. **栈锁定**：React Bits / Aceternity 只给 React；Uiverse 给裸 HTML/CSS；很少有人做"多栈导出 + 依赖体检"。
6. **学习断层**：Anime.js 有引擎没教学站；多数用户只会"抄"，不懂动效原理，改参数就崩。
7. **内容即产品**：它们的内容库其实就是唯一护城河——但**数量都还不够大、且没有"内容评分体系"**来证明哪个能用。

### 1.3 我们的差异化（逐站打赢）

| 对标 | 我们更"好"在哪 |
|---|---|
| vs Motion Sites | 每个 Prompt 附**实机渲染预览 + 3 款主流 AI 工具实测评分**（成功率/还原度/失败模式），而非只有截图；按**技术栈**（Next.js/HTML/国内大模型/Codex）出变体；免费区更大 |
| vs React Bits | 不止动画组件，还有**微元素 / 区块 / 整站模板**；每个组件可**一键换品牌主题（design tokens）**；多框架代码视图（React / HTML+CSS / Vue） |
| vs Uiverse | **质量门禁**：投稿须过 a11y 自动审计 + 人工评审 + 风格一致审查；全部元素统一挂上**设计变量系统**（颜色/圆角/阴影一键重映射）；带"依赖/体积/浏览器兼容"标签 |
| vs Anime.js | 不自研引擎，做 **Animation Lab**：缓动曲线可视化、弹簧调参、滚动编排的**交互式教学与工具**（原创教程 + 可导出代码配方） |
| vs Aceternity UI | 免费内容占比更高；**依赖体检**（拷贝前告知需要哪些包/版本）；区块粒度更细（可单拿某一块而非整页）；主题化引擎让我们能承诺"复制≠改一堆" |

---

## 2. 产品概念与品牌

### 2.1 名字候选（正式使用前须做域名/商标查重）

1. **Motif UI** — motif（设计母题），一个词讲清"可复用设计单元"，适合全栈 UI 平台气质
2. **Fable UI** — "会讲故事的前端素材"，好记、有传播性
3. **Emberstack** — 温暖、开发者向，"点燃你的页面"
4. **Weave UI** — 织合组件/背景/Prompt/教程四股线
5. 兜底方案：`{形容词}+ui` 域名模型（如 `primeui` 已存在，避开），建议注册 `.com/.dev/.ai` 三选一并立即抢 `xxxui.com` + `ui.xxx.com` 双入口

### 2.2 品牌记忆点（Slogan 候选）

- "Copy less. Ship more."（对标"copy-paste"心智但更强）
- "The library that themes itself."
- "From idea to animated site in one place."

### 2.3 原创设计语言（内容不撞车的根基）

自建一套 **tokens + 视觉语法**，所有自产内容统一遵循：
- 专属色彩算法（原创渐变体系）、圆角/阴影/描边刻度；
- 动效规范（时长/缓动命名体系，绑定到 Motion 语义变量）；
- 每个组件必须携带：**亮/暗模式、a11y 备注、浏览器支持、依赖清单、≤3 种用法配方**。
- 预览图/封面全部用自建 3D/渲染管线或 AI 生成后人工调校，**绝不直接截取他人站点图片**。

---

## 3. 前台信息架构（Public Site）

```
/
├── /                     首页（大屏实况演示墙 + 分类入口 + 搜索 + Featured）
├── /components           组件库总览（核心资产 #1）
│   ├── 微元素 elements    按钮/输入/开关/加载/评分/翻页…（对标 Uiverse，但带质检）
│   ├── 动画组件 animated  Blob Cursor/Aurora/Text Effects/滚动驱动组件…（对标 React Bits）
│   ├── 区块 blocks        Hero/Features/Pricing/Testimonials/CTA/Footer…（对标 Aceternity）
│   ├── 模板 templates     20+ 可整站复制的行业模板
│   └── /components/[slug] 详情页：实机预览(沙箱 iframe) + 参数 Playground + 主题换肤
│                          + 代码多栈视图 + 复制/安装 + 版本历史 + 收藏/举报 + 相关推荐
├── /backgrounds          背景与纹理专区（动画背景/渐变/纹理/粒子背景，双入口 SEO）
├── /prompts              AI 建站 Prompt 库（核心资产 #2，对标 Motion Sites）
│   ├── 行业分类：Agency / SaaS / Ecommerce / 3D / Travel / Health / Fintech / Portfolio…
│   ├── 栈筛选：Next.js / Astro / 原生 HTML / React / 国内大模型 / Codex
│   ├── /prompts/[slug]   Prompt 详情：目标描述 + 分步 Prompt + 实测评分 + 失败模式 + 变体
│   ├── /prompts/builder  引导式 Prompt 生成器（选行业→风格→板块→输出成品 Prompt）
│   └── /prompts/scoreboard  每份 Prompt 的 AI 实测还原度排行榜（差异化卖点）
├── /lab                  Playground 工具区（免费引流利器）
│   ├── easing lab        缓动曲线交互实验室（Anime.js 概念可视化）
│   ├── spring lab        弹簧物理调参器（stiffness/damping 实时体感）
│   ├── scroll lab        滚动编排设计器（导出代码配方）
│   ├── gradient forge    原创渐变生成器
│   ├── texture forge     纹理/噪点/玻璃拟态生成器
│   └── theme studio      品牌 tokens 设计器（一键换全站组件配色）
├── /learn                教程与文档（SEO 主力 + 留存）
│   ├── get-started / per-tool guides（Codex/Cursor/国内大模型使用 Prompt 指南）
│   ├── animation-math    动效原理系列（原创图文 + 交互动画）
│   └── /blog, /changelog 运营内容
├── /community            社区（提交作品/合集/排行榜/徽章体系）
├── /pricing              定价页
├── /license /about /api-docs /status
└── /account              个人中心（收藏/合集/投稿/PRO 订阅账单）
```

**核心交互原则**：任何素材 3 步内可拿到源码（浏览 → 现场调参/换肤 → 复制或 `npx xxx install`）。

---

## 4. 后台信息架构（Admin / 管理后台）

```
/admin
├── /dashboard            实时数据：日活、收录量、复制数、上传/订阅趋势
├── Content 内容管理
│   ├── components        组件/元素/区块/模板 全生命周期：
│   │                     创建→填代码→沙箱自动渲染→质量清单→多栈导出→定时发布
│   │                     版本历史 / 回滚 / 下线 / SEO 面板 / 关联推荐
│   ├── prompts           Prompt 管理：创建→**一键跑 AI 实测(接各家模型)→评分入库**→发布
│   ├── backgrounds       背景库（含生成参数存档，可再生）
│   ├── learn             教程/博客/变更日志（Markdown + 内嵌 Demo 组件）
│   └── assets            素材/预览图/OG 图管理（R2 直传 + 压缩 + CDN）
├── Moderation 审核
│   ├── submissions       社区投稿队列（自动 a11y/安全审计 → 人工复评 → 采纳发奖）
│   ├── reports           举报处理
│   └── spam/users        水军与封禁
├── Commerce 商业
│   ├── plans             订阅方案（Stripe Product/Price 同步）
│   ├── coupons           折扣码 / 推广期
│   ├── orders            订单与权益发放（entitlement）
│   └── payouts           贡献者分成结算
├── Growth 增长
│   ├── analytics         埋点看板（可接 PostHog/Plausible）
│   ├── announcements     全站横幅/公告（可定向用户组）
│   ├── seo               批量改 slug/重定向/站点地图生成/结构化数据检查
│   └── ab-tests          落地页 A/B（v2+）
├── System 系统
│   ├── users & roles     RBAC：admin / editor / moderator / contributor / viewer
│   ├── api-keys          公开 API 令牌与配额
│   ├── import-export     批量导入（JSON/CSV/MDX）与全量导出
│   ├── feature-flags     功能开关（灰度）
│   └── audit-log         全量操作审计
└── /settings             品牌 tokens / 站点元信息 / 存储 / 邮件模板
```

**后台关键体验**：编辑器即预览器（左代码、右沙箱、下质检报告），编辑/审核不用开第二个页面。

---

## 5. 核心功能规格（详）

### 5.1 组件库（对标 Uiverse + React Bits + Aceternity 的合体升级）

- **内容分层**：`micro-element（≤1KB 单一交互）→ component（动画/逻辑组件）→ section/block（页面区块）→ template（整站）`
- **每项素材元数据**：分类、行为标签（hover/click/scroll/drag/tilt…）、技术栈、依赖清单、体积、a11y 合规、主题支持（亮/暗/自定义 tokens）、作者、许可证、质量评分（自动 + 人工）
- **详情页 Playground**：所有可调参数实时作用于预览；可生成"参数化 URL"分享效果
- **Theme Studio 联动**：点"换肤"→ 输入品牌主色 → 整站 Demo 依 tokens 重映射（写代码时强制走 CSS 变量，杜绝魔法数）
- **多栈导出**：同一素材输出 React(TSX+Tailwind) / HTML+CSS / Vue（v2）三种视图 + `npx` CLI 安装
- **沙箱安全**：所有第三方代码跑在 `sandboxed iframe + 严格 CSP + 无网络/存储隔离`，杜绝 XSS 传播（对外是卖点：**"100% safe to preview"**）

### 5.2 Prompt 库（对标 Motion Sites，质量反超）

- **Prompt = 一等公民**：结构化字段（目标站类型 / 参考气质 / 必须板块 / 动画偏好 / 品牌色 / 内容填充要求 / 技术栈约束）
- **实测评分制**：每份 Prompt 发布前，用 ≥3 家模型（Claude/Codex/国内头部大模型）各跑一次，记录**还原度 / 报错率 / 是否需要修补**，附"预期效果截图 + 失败模式与补救提示"——用户可据此选"最稳"的 Prompt
- **栈变体**：同一设计一份 Prompt 出 Next.js / 纯 HTML / React 三种
- **排行榜**：按实测成功率排序（对 Motion Sites 的"只晒不验"形成降维打击）
- **Prompt Builder**：不懂写 Prompt 的用户按向导点选 → 自动生成结构化 Prompt

### 5.3 背景/纹理库

- 类目：动画背景 / 静态渐变 / 纹理（film grain / glass / noise…）/ 粒子类
- 每个背景附 **WebGL/CSS/SVG 三选实现 + 性能档位**（低配机自动降级说明）

### 5.4 Lab 工具区（对标 Anime.js 概念的可视化升级）

| 工具 | 说明 | 导出 |
|---|---|---|
| Easing Lab | 可视化全部缓动曲线，拖点自定义贝塞尔 | 代码片段（CSS/JS/Tailwind） |
| Spring Lab | stiffness/damping/mass 实时体感 | JS 弹簧配置 |
| Scroll Lab | 设定滚动触发点/同步进度/交错 | 配方代码 |
| Gradient / Texture Forge | 原创生成器 | CSS/SVG/PNG |
| Theme Studio | tokens 设计器 | CSS 变量 / Tailwind config |

**原创教程**（区别于 Anime.js 的参考文档）：以"项目制"教学——*做一个获奖感的 3D 落地页第 1–10 课*，每课产出可用代码。

### 5.5 社区与账号

- 注册：GitHub / Google / 邮箱。免费获得：收藏、合集（collection）、投稿、点赞
- **投稿管线**：提交源码 → 自动语法/lint/a11y 审计 → 沙箱截图 → 人工评审（≤48h）→ 上线即送贡献者徽章 + 上榜
- **合集**：一键"收藏 20 个组件打包下载/生成集成说明"（对标"拯救收藏夹吃灰"痛点）

### 5.6 搜索

- 语义 + 标签混合（Typesense/Meilisearch 起步，支持"dark glass hero with 3d tilt"这类自然语言搜索），同义词与行为标签兜底
- 结果页附带**可比对的"相似素材"**促进浏览深度

---

## 6. 数据模型（核心实体）

```
User (role, plan, credits) ─┬─< Submission (status, moderationLog)
                            ├─< Collection / CollectionItem
                            ├─< Like / Comment / Report
                            └─< Entitlement / Subscription / Order (Stripe)

Asset (组件/元素/区块/模板)
 ├─ fields: slug, kind(Element|Component|Section|Template|Background|Texture),
 │          title, description, license, stack[], deps[], bundleKb,
 │          themeable(bool), a11yScore, qualityScore, status(Draft|Review|Live|Archived)
 ├─< AssetVersion (codePayload JSON: react/htmlCss/css + propsSchema)
 ├─< Tag / Category
 ├─< AssetTest (浏览器兼容/体积/a11y 自动检测记录)
 └─< Media (preview 截图/封面/OG)

PromptTemplate
 ├─ fields: industry[], stackVariant[], goalBlocks[], tone[], testedWith[]
 ├─< PromptRun (模型/还原度评分/截图/失败记录)   ← 差异化核心表
 └─< PromptBlock (可复用小节，供 Builder 拼装)

LearnArticle / Changelog / Announcement
AnalyticsEvent / AuditLog / ApiKey
```

---

## 7. 技术架构

### 7.1 技术选型（推荐，可拍板调整）

| 层 | 选型 | 理由 |
|---|---|---|
| 框架 | **Next.js 15 (App Router) + TypeScript + Tailwind v4** | 前台/后台同仓；SSR 利于 SEO；生态最大 |
| 组件体系 | 内部自研 UI 组件包（shadcn 风格、非抄其素材）+ Motion | 与"原创内容"战略一致 |
| 数据库 | PostgreSQL + Prisma | 关系清晰、快速迭代 |
| 缓存/队列 | Redis（限流/热数据）+ Inngest 或 BullMQ（AI 实测跑批/截图任务） | Lab/Prompt 实测是重异步任务 |
| 搜索 | Typesense/Meilisearch（自托管）或 Algolia（省心） | 语义搜索演示效果好 |
| 对象存储/CDN | Cloudflare R2 + R2 CDN | 便宜 + 预览图流量大 |
| 鉴权 | Auth.js（GitHub/Google）+ RBAC | 免费用量够 |
| 支付 | Stripe（订阅/一次性）+ 分成结算 | 国际站标准 |
| 邮件 | Resend | 便宜 |
| 分析 | PostHog（事件）或 Plausible（轻） | 自控 |
| 沙箱 | iframe srcdoc + CSP + Sandbox 属性 | 预览第三方代码 |
| 代码编辑器 | CodeMirror/Monaco 只读视图 + 后台全功能 | — |
| AI 评测 | 统一 `ai-sdk` 网关（Claude/Codex/国产模型可插拔） | PromptRun 批量执行 |
| 部署 | Vercel + GitHub Actions + 预览环境 | 快 |
| 监控 | Sentry + Better Stack | — |

### 7.2 仓库结构（Monorepo 建议）

```
apps/
  web         前台（公开站）
  admin       后台（独立 Next 应用，走同库同 schema，独立域名 admin.xxx.com）
  api         可选：公开只读 API（Edge/Node）
packages/
  ui          内部组件库（不对外售卖的"地基"）
  content     数据 schema / 校验器 / 内容导入导出
  playground  沙箱渲染器（iframe 服务）
  lab         各类生成器的纯函数核心
  seo         元数据/结构化数据工具
docs/         产品与工程文档
```

> MVP 也可先 `apps/web` 内含 `/admin` 路由组，上线后再拆，避免过度工程。

### 7.3 关键流程

1. **内容发布流**：写代码 → 填元数据 → 自动跑 a11y/体积/依赖审计 → 沙箱截图 → 人工过审 → 上线（全部留版本）
2. **Prompt 发布流**：编辑 Prompt → 队列触发 ≥3 模型实测 → 自动评分+截图 → 人工审核 → 上线
3. **投稿流**：用户提交 → 沙箱安全扫描 → 自动审计报告 → 审核台 → 采纳/打回（打回附原因）

---

## 8. 内容战略：原创且"更好"的落地方法

### 8.1 原创性红线（必须遵守）

- **不搬运**上述 5 站的代码/Prompt/文案/图片/命名（它们的组件若为 MIT 也不整体照抄——我们要"更好"而非"重发"）
- 预览图、封面图自产（AI 生成 + 人工修图），**禁止直接截取他人站点**
- 品牌名、logo 不与 Aceternity/ReactBits 等混淆；做商标/域名查重
- 自己的内容统一采用 **MIT（素材代码）+ CC BY 4.0（教程图文）**，开源声明清晰——这是社区信任资产

### 8.2 内容生产管线（自产 + AI 加速 + 人工质检）

```
创意库(原创方向卡片) → 设计系统规范套用 → AI 生成代码初稿(可换多家模型)
  → 人工设计评审（视觉/动效/一致性） → 自动化质检（a11y/体积/依赖/兼容）
  → 沙箱截图 + 文档/配方撰写 → 分级上线（Featured/Pro/Community）
```

### 8.3 首发目录目标（比任何一家首发都厚）

| 内容 | 首发量 | 说明 |
|---|---|---|
| 微元素 elements | 300 | 现代风格、tokens 化、全 a11y 标注 |
| 动画组件 animated | 120 | 对标 React Bits 品类但不重复其设计 |
| 区块 sections | 80 | 含 20 套完整 Hero/定价/Bento 等 |
| 整站模板 templates | 20 | 行业向（SaaS/Agency/Ecommerce/3D…） |
| 背景/纹理 backgrounds | 100 | 动画+静态+纹理三实现 |
| AI Prompt 站点案例 | 300 | 30 行业 × 多栈，附实测评分 |
| Lab 工具 | 12 | 免费引流 |
| 教程/博客 | 40 | SEO 长尾主力 |

> 节奏：发布后每周新增 ≥30 素材 + 20 Prompt（靠半自动化管线 + 社区），保持"每周都在长"的感知。

### 8.4 "更好"的可验证标准（写进质检报告，公开给用户看）

- a11y：自动审计 ≥95 分 + 人工复核（键盘可达/对比度/ARIA）
- 体积：element ≤ 5KB、animated ≤ 20KB（gzip），超限标注
- 依赖：声明到主版本，缺依赖零配置可跑
- 主题：100% 走设计变量（无魔法色值）
- 实测：Prompt 三模型平均还原度 ≥ 80% 才标"Verified"，否则标 Beta 并附失败说明

---

## 9. 商业模式（建议 Freemium，留决策点）

| 档位 | 价格 | 内容 |
|---|---|---|
| Free | $0 | 浏览/搜索/复制全库素材代码、Lab 基础工具、Community 投稿、收藏 |
| Pro | **$19/月 或 $129/年** | Prompt 全量实测报告与高分变体、Template 一键整包、Playground 存档、私有合集、公开 API、去广告、优先审核 |
| 一次性 | $39–99 | 单套高级模板/行业 Prompt 包 |
| 分成 | — | 社区精选素材作者 30% 净收入分成或积分兑礼 |

> 与竞品对照：Aceternity 大量高级内容锁付费墙 → 我们**基础库永久免费**、付费只卖"生产力"（评测、批量、API、模板包），信任感更强。

---

## 10. 路线图

| 阶段 | 周期 | 交付 |
|---|---|---|
| P0 地基 | 2 周 | Monorepo + 设计系统 tokens + DB schema + 沙箱渲染器 + 后台骨架（内容 CRUD + 预览） |
| P1 垂直切片 | 2 周 | 端到端打通：1 个组件从录入→质检→详情页→复制；后台 + 前台联调 |
| P2 MVP | 4–6 周 | 组件库(500+) + 详情/Playground v1 + 搜索 + 账号/收藏 + Prompt 库(150+) + 投稿管线 |
| P3 公测 Launch | 2–4 周 | 背景库 + Lab 工具 ×6 + 教程 20 篇 + SEO + 发布（PH/HN/Reddit/X）+ 灰度 Pro |
| V2 | 第 4–6 月 | 订阅计费完整化、社区分成、公开 API、主题换肤上线、移动端预览、Prompt 实测自动化放量 |
| V3 | 第 7–12 月 | 模板市场、团队版、多语言（西/日）、小程序/原生预览 SDK |

---

## 11. 成本粗估（月）

- 云：Vercel ~$50–200 / R2+CDN ~$30–150（预览图是大头）/ DB ~$50–150 / 搜索 ~$100 或自托管省 60%
- AI 实测与生成：$200–800/月（Prompt 批量评测是大头，可限流错峰）
- 人力（自建团队）：3 人（2 全栈 + 1 设计）× 3–4 个月到公测为合理预估；AI 管线熟练后内容边际成本极低
- 若先 Solo 验证：建议 P0–P2 单人 + AI 先行，砍掉模板/分成，首发量减半再放量

---

## 12. 风险与对策

| 风险 | 对策 |
|---|---|
| 内容原创性被质疑 | 发布即附生成记录/作者/许可证；对比表主动说明差异点 |
| 预览沙箱被注入恶意代码 | 双层隔离（无凭据 iframe + CSP + 上传代码静态扫描 + 不落第三方存储） |
| 社区投稿质量崩坏 | 先"自产撑起 80%"，社区只作增量；审核 SLA + 采纳率公开 |
| AI Prompt 实测结果随模型更新漂移 | 存档模型版本 + 定期重测重标 |
| 大厂/竞品跟进 | 拼内容厚度 + Lab 工具 + 评测体系三件套组合拳，短时间难复制 |
| 版权擦边（名字/视觉雷同） | 上线前商标域名查重 + 律师过一遍素材许可页 |
| SEO 冷启动慢 | /learn + Prompt 长尾（"make a X website with AI"）+ 免费工具站（gradient/easing 类）是自然流量三入口 |

---

## 13. 需要你拍板的决策点

- **D1 范围**：只要本方案，还是确认后我直接在仓库里开工搭 MVP 骨架？
- **D2 商业模式**：Freemium(推荐) / 全免费社区 / 内容售卖为主？
- **D3 技术栈**：Next.js+TS+Tailwind+Postgres(推荐) 还是别的？
- **D4 首期内容**：AI 批量生成 + 人工质检(推荐) / 纯人工设计师 / 先靠社区众包？
- **D5 品牌名**：从 2.1 候选挑或另起（我下一步可做域名/商标预检）
- **D6 首发规模**：按 8.3 全量，还是先 1/3 验证市场？
