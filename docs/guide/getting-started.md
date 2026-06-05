# 快速开始

这是一个示例文档，演示如何撰写与组织技术文档。

## 写作流程

1. 在 `docs/` 目录下新增或编辑 `.md` 文件
2. 本地预览：

   ```bash
   npm run docs:dev
   ```

   浏览器打开提示的地址即可实时查看（支持热重载）。

3. 发布：

   ```bash
   git add .
   git commit -m "docs: 更新文档"
   git push
   ```

   推送到 `main` 分支后，GitHub Actions 会自动编译并部署。

## 如何新增一篇文档

1. 在 `docs/guide/` 下新建一个 `.md` 文件，例如 `my-doc.md`
2. 打开 `docs/.vitepress/config.mts`，在 `sidebar` 的 `items` 中添加一项：

   ```ts
   { text: '我的文档', link: '/guide/my-doc' }
   ```

3. 保存后本地预览即可看到侧边栏出现新条目。

## Markdown 增强

VitePress 支持丰富的 Markdown 扩展，例如提示框：

::: tip 提示
这是一个提示框。
:::

::: warning 注意
这是一个警告框。
:::

更多用法见 [VitePress 官方文档](https://vitepress.dev/)。
