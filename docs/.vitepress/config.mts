import { defineConfig, type DefaultTheme } from 'vitepress'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// docs/ 根目录（本文件位于 docs/.vitepress/）
const DOCS_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

// 扫描时忽略的目录
const IGNORE_DIRS = new Set(['.vitepress', 'public'])

/**
 * 读取一个 md 文件的菜单元信息。
 * 标题优先级：frontmatter `title` > 首个 `# 一级标题` > 文件名兜底。
 * 顺序：frontmatter `order`（数字，小在前），缺省为 +∞（即排在有 order 的之后，再按名称排）。
 */
function readMeta(filePath: string, fallback: string): { title: string; order: number } {
  const raw = fs.readFileSync(filePath, 'utf-8')

  let title = ''
  let order = Number.POSITIVE_INFINITY

  // 解析顶部 frontmatter（--- 包裹的块）
  const fm = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (fm) {
    const t = fm[1].match(/^title:\s*(.+)$/m)
    if (t) title = t[1].trim().replace(/^['"]|['"]$/g, '')
    const o = fm[1].match(/^order:\s*(-?\d+)\s*$/m)
    if (o) order = Number(o[1])
  }

  // 无 frontmatter title，则取正文第一个一级标题
  if (!title) {
    const body = fm ? raw.slice(fm[0].length) : raw
    const h1 = body.match(/^#\s+(.+)$/m)
    if (h1) title = h1[1].trim()
  }

  return { title: title || fallback, order }
}

/** 文件夹分组名：该文件夹 index.md 的标题 > 文件夹名 */
function readDirMeta(absDir: string, name: string): { title: string; order: number } {
  const indexFile = path.join(absDir, 'index.md')
  if (fs.existsSync(indexFile)) return readMeta(indexFile, name)
  return { title: name, order: Number.POSITIVE_INFINITY }
}

/** 递归生成某目录的侧边栏条目（文件 → 链接项，子目录 → 可折叠分组） */
function buildItems(absDir: string, routePrefix: string): DefaultTheme.SidebarItem[] {
  const entries = fs.readdirSync(absDir, { withFileTypes: true })

  const collected: { order: number; name: string; item: DefaultTheme.SidebarItem }[] = []

  // 当前目录下的 md 文件（index.md 不作为条目）
  for (const e of entries) {
    if (!e.isFile() || !e.name.endsWith('.md') || e.name === 'index.md') continue
    const slug = e.name.replace(/\.md$/, '')
    const meta = readMeta(path.join(absDir, e.name), slug)
    collected.push({
      order: meta.order,
      name: e.name,
      item: { text: meta.title, link: `${routePrefix}/${slug}` },
    })
  }

  // 子目录 → 嵌套分组
  for (const e of entries) {
    if (!e.isDirectory() || IGNORE_DIRS.has(e.name)) continue
    const subAbs = path.join(absDir, e.name)
    const children = buildItems(subAbs, `${routePrefix}/${e.name}`)
    if (children.length === 0) continue
    const meta = readDirMeta(subAbs, e.name)
    collected.push({
      order: meta.order,
      name: e.name,
      item: { text: meta.title, collapsed: false, items: children },
    })
  }

  collected.sort((a, b) => a.order - b.order || a.name.localeCompare(b.name))
  return collected.map((c) => c.item)
}

/** 在一组侧边栏条目中找到第一个可点击链接，用于顶部导航跳转 */
function firstLink(items: DefaultTheme.SidebarItem[]): string | undefined {
  for (const item of items) {
    if (item.link) return item.link
    if (item.items) {
      const nested = firstLink(item.items)
      if (nested) return nested
    }
  }
  return undefined
}

/** 扫描 docs/ 顶层目录，自动生成 nav 与 sidebar */
function buildMenu(): { nav: DefaultTheme.NavItem[]; sidebar: DefaultTheme.SidebarItem[] } {
  const nav: DefaultTheme.NavItem[] = [{ text: '首页', link: '/' }]
  const sidebar: DefaultTheme.SidebarItem[] = []

  const topDirs = fs
    .readdirSync(DOCS_ROOT, { withFileTypes: true })
    .filter((e) => e.isDirectory() && !IGNORE_DIRS.has(e.name))
    .map((e) => e.name)
    .sort()

  for (const dir of topDirs) {
    const absDir = path.join(DOCS_ROOT, dir)
    const items = buildItems(absDir, `/${dir}`)
    if (items.length === 0) continue

    const meta = readDirMeta(absDir, dir)
    sidebar.push({ text: meta.title, collapsed: false, items })

    // 顶部导航：有 index.md 则进分组落地页，否则进第一篇文章
    const hasIndex = fs.existsSync(path.join(absDir, 'index.md'))
    const link = hasIndex ? `/${dir}/` : firstLink(items)
    if (link) nav.push({ text: meta.title, link })
  }

  return { nav, sidebar }
}

const { nav, sidebar } = buildMenu()

// VitePress 配置：https://vitepress.dev/reference/site-config
export default defineConfig({
  // 站点级
  title: 'Tosn Blog',
  description: '技术文档站',
  lang: 'zh-CN',

  // 部署在 GitHub Pages 项目站子路径下，必须与仓库名完全一致（区分大小写）
  base: '/Tosn-blog/',

  // 找不到死链时构建失败，避免线上 404
  ignoreDeadLinks: false,

  // 主题配置：https://vitepress.dev/reference/default-theme-config
  themeConfig: {
    // 顶部导航与侧边栏均由 docs/ 目录结构自动生成，无需手动维护
    nav,
    sidebar,

    // 自带本地搜索
    search: {
      provider: 'local',
    },

    // 社交链接（可选，按需修改/删除）
    socialLinks: [{ icon: 'github', link: 'https://github.com/Tosn/Tosn-blog' }],

    // 页脚
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2026 Tosn',
    },
  },
})
