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
- **配置**：`docs/.vitepress/config.mts` 是唯一的站点配置入口——标题、`nav`、`sidebar`、本地搜索、`socialLinks` 都在这里。
- **新增文档需两步**：① 在 `docs/` 下建 `.md`；② 在 `config.mts` 的 `sidebar` 对应分组 `items` 里手动加一条 `{ text, link }`。侧边栏不是自动生成的。
- **部署流水线**：`.github/workflows/deploy.yml`，push `main` 触发，用 `npm ci` 装依赖（依赖 `package-lock.json`，提交时勿遗漏）、`npm run docs:build`、上传 `docs/.vitepress/dist` 到 Pages。

## 重要陷阱

- **`base` 路径必须等于仓库名且区分大小写**：当前为 `base: '/Tosn-blog/'`（见 `config.mts`）。改仓库名或换部署位置时必须同步修改，否则线上 CSS / 链接全部 404。
- `ignoreDeadLinks: false`：存在死链会导致 `docs:build` 失败，新增内部链接后务必本地 build 验证。
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