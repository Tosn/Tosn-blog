# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目简介

基于 **VitePress** 的静态技术文档站。工作流：只编辑 Markdown → `git push` 到 `main` → GitHub Actions 编译 → 部署到 GitHub Pages，访问 `https://Tosn.github.io/Tosn-blog/`。

## 常用命令

```bash
npm install          # 安装依赖（首次 / 依赖变更后）
npm run docs:dev     # 本地开发服务器，热重载，写文档时常驻
npm run docs:build   # 构建到 docs/.vitepress/dist，发布前可本地验证
npm run docs:preview # 预览已构建的产物
```

发布即推送：`git add . && git commit -m "docs: ..." && git push`（push 到 `main` 自动触发部署）。

## 架构与关键约定

- **内容**：所有文档为 `docs/` 下的 `.md`；`docs/index.md` 是首页（VitePress `home` 布局，hero/features 写在 frontmatter 里）。
- **配置**：`docs/.vitepress/config.mts` 是唯一的站点配置入口——标题、本地搜索、`socialLinks` 等在这里；`nav` 与 `sidebar` 由该文件在启动/构建时扫描 `docs/` 目录**自动生成**，无需手写。
- **新增文档只需一步**：在 `docs/` 下建 `.md` 并写好一级 `#` 标题，菜单自动出现。**不要再手动改 `config.mts` 的 nav/sidebar**。具体约定见下方「侧边栏自动生成规则」。
- **部署流水线**：`.github/workflows/deploy.yml`，push `main` 触发，用 `npm ci` 装依赖（依赖 `package-lock.json`，提交时勿遗漏）、`npm run docs:build`、上传 `docs/.vitepress/dist` 到 Pages。

## 侧边栏与菜单自动生成

`config.mts` 启动/构建时扫描 `docs/` 目录自动生成顶部 `nav` 与侧边栏 `sidebar`。新增文档**只需建 md 文件**，菜单名按以下约定从 markdown 里取，无需改配置：

- **页面菜单名**：取自 frontmatter `title:`（可选）> 正文第一个 `# 一级标题` > 文件名兜底。通常只写 `#` 标题即可。
- **文件夹分组名**：取自该文件夹下 `index.md` 的标题（`title` 或 `#`）> 文件夹名本身。中文分组名需在该目录放一个 `index.md` 并写 `# 名称`。
- **排序**：frontmatter `order:`（数字，小在前）> 文件名字母序。推荐用 `01-`、`02-` 文件名前缀控制顺序（前缀只影响 URL 与排序，不显示）。
- **隐藏规则**：每个目录的 `index.md` 不作为菜单条目，仅用作该分组的名称来源与落地页；`.vitepress`、`public` 目录被忽略。
- 子目录会生成可折叠的嵌套分组，支持多层。

## 重要陷阱

- **`base` 路径必须等于仓库名且区分大小写**：当前为 `base: '/Tosn-blog/'`（见 `config.mts`）。改仓库名或换部署位置时必须同步修改，否则线上 CSS / 链接全部 404。
- `ignoreDeadLinks: false`：存在死链会导致 `docs:build` 失败，新增内部链接后务必本地 build 验证。
- **dev 下新增文件菜单不刷新**：`npm run docs:dev` 在启动时扫描目录生成菜单，运行中新建 md/文件夹后菜单不会自动更新，需**重启 dev server**；`docs:build` 与线上部署每次都全新扫描，始终准确。
- GitHub 端一次性设置：仓库 Settings → Pages → Source 必须选 **GitHub Actions**（非 branch 模式），否则 workflow 不会发布。

## Git Commit Rules

所有 git commit 必须遵循 Conventional Commits 规范：

格式：

<type>(scope): <subject>

示例：

feat(user): 新增登录功能
fix(api): 修复 token 过期问题
refactor(order): 重构订单状态逻辑

要求：

- subject 不超过 50 个字符
- 使用中文
- 不允许出现 "update" "fix bug" 等模糊描述
- 必须说明具体改动
- 一个 commit 只做一件事

允许的 type：

- feat
- fix
- refactor
- docs
- style
- test
- chore

## 文档写作规范

新增或编辑 `docs/` 下的文档时遵循以下约定（侧边栏自动生成，建文件即可，规则见「侧边栏与菜单自动生成」）：

- **标题层级**：每篇文档以**单个** `#` 一级标题开头作为页面标题（该标题同时用作侧边栏菜单名），正文用 `##` / `###` 逐级分层，不跳级。
- **语言**：使用中文撰写；技术术语首次出现可中英对照，如「构建（build）」。
- **代码块**：必须标注语言（` ```bash `、` ```ts ` 等）；命令示例应可直接执行。
- **站内链接**：用以 `/` 开头的相对路径且**不带 `.md` 后缀**（如 `/guide/getting-started`），不要手写 `base` 前缀 `/Tosn-blog/`。新增内链后必须本地 `npm run docs:build` 验证死链（`ignoreDeadLinks: false`）。
- **提示容器**：善用 VitePress 容器组织信息——`::: tip`（提示）、`::: warning`（注意）、`::: details`（折叠）。
- **文件命名**：用小写 kebab-case 英文 slug（如 `deploy-guide.md`），保证 URL 稳定。