---
name: new-doc
description: 在本 VitePress 文档站新增一篇文档页。当用户说「新增一篇文档」「加一页文档」「写一篇 xxx 的文档」「在指南下加一页」等意图时使用。自动走完整两步——在 docs/ 下创建 .md 文件，并在 config.mts 的 sidebar 同步登记条目，避免漏加侧边栏。
---

# 新增文档页

本站侧边栏**不是自动生成的**：新增一篇文档必须同时做两件事，缺一则页面要么 404、要么不出现在侧边栏。本 Skill 负责把这两步一次做完并验证。

## 开始前先确认这三项

如果用户没说清，先问（一次问全，不要逐条挤牙膏）：

1. **文档标题**：显示在页面顶部和侧边栏的中文标题，例如「部署指南」。
2. **所属分组**：对应 `docs/` 下的子目录，例如 `guide`。已有分组见下方「读取现状」。
3. **文件名 slug**：小写 kebab-case 英文，例如 `deploy`，最终 URL 为 `/<分组>/<slug>`。

## 读取现状

动手前先看清楚要改哪里：

- 列出已有分组目录：查看 `docs/` 下的子目录。
- 读 `docs/.vitepress/config.mts`，确认 `sidebar` 现有的分组键（形如 `'/guide/'`）和每组的 `items`。

## 第一步：创建 Markdown 文件

在 `docs/<分组>/<slug>.md` 新建文件。模板（遵循 CLAUDE.md 的「文档写作规范」）：

```markdown
# <文档标题>

<一句话说明本页主题。>

## <小节标题>

正文……
```

要求：

- 以**单个** `#` 一级标题开头，作为页面标题；正文用 `##` / `###` 分层。
- 中文撰写，代码块标注语言。
- 若分组目录还不存在（例如第一次建 `docs/notes/`），直接在该路径下创建文件即可。

## 第二步：在 config.mts 登记侧边栏

编辑 `docs/.vitepress/config.mts` 的 `themeConfig.sidebar`，分两种情况：

**情况 A —— 分组已存在**（如 `'/guide/'` 已有）：向该分组的 `items` 数组追加一条：

```ts
{ text: '<文档标题>', link: '/<分组>/<slug>' }
```

**情况 B —— 新建分组**：在 `sidebar` 对象里新增一个键，并视情况在顶部 `nav` 加入口：

```ts
'/<分组>/': [
  {
    text: '<分组显示名>',
    items: [
      { text: '<文档标题>', link: '/<分组>/<slug>' }
    ]
  }
]
```

关键约定：

- `link` **不带 `.md` 后缀**，以 `/` 开头的站内绝对路径（VitePress 会自动叠加 `base`，**不要**手动写 `/Tosn-blog/`）。
- 一条 `link` 必须对应一个真实存在的 `.md`，否则构建因死链失败。

## 第三步：验证

```bash
npm run docs:build
```

`ignoreDeadLinks: false`，任何死链都会让构建失败。构建通过即说明文件与侧边栏链接自洽。可选 `npm run docs:dev` 本地肉眼确认侧边栏出现新条目。

## 收尾

提示用户发布流程：`git add . && git commit -m "docs: 新增<标题>文档" && git push`（push 到 `main` 自动部署）。commit 信息遵循 CLAUDE.md 的 Conventional Commits 规范。
