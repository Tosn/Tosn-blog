import { defineConfig } from 'vitepress'

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
    // 顶部导航
    nav: [
      { text: '首页', link: '/' },
      { text: '指南', link: '/guide/getting-started' }
    ],

    // 侧边栏（按目录分组）
    sidebar: {
      '/guide/': [
        {
          text: '指南',
          items: [
            { text: '快速开始', link: '/guide/getting-started' }
          ]
        }
      ]
    },

    // 自带本地搜索
    search: {
      provider: 'local'
    },

    // 社交链接（可选，按需修改/删除）
    socialLinks: [
      { icon: 'github', link: 'https://github.com/' }
    ],

    // 页脚
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2026 Tosn'
    }
  }
})
