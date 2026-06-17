## 斜杠命令

### 会话与上下文管理

| 命令            | 说明                         | 使用场景                                  |
| --------------- | ---------------------------- | ----------------------------------------- |
| /clear          | 清空对话上下文               | 🟢 切换不相关任务时用，最常用命令之一      |
| /compact [指令] | 手动压缩上下文               | 🟡 上下文快满但需要保留历史时              |
| /cost           | 查看当前会话 token 用量      | 🟢 监控消耗，判断是否需要清理              |
| /context        | 查看上下文消耗分布           | 🟡 诊断哪些内容占了最多空间                |
| /btw <问题>     | 侧边快速提问，不进入会话历史 | 🟢 Claude 工作时也能用，不打断不污染上下文 |
| /rewind         | 打开回退菜单                 | 🟢 回退到检查点、撤销错误操作              |
| /resume         | 恢复之前的会话               | 🟢 继续昨天的工作                          |
| /rename         | 重命名当前会话               | 🟡 像 Git 分支一样管理多个工作流           |

### 环境与配置

| 命令            | 说明                                 | 使用场景                                                     |
| --------------- | ------------------------------------ | ------------------------------------------------------------ |
| /init           | 自动生成 CLAUDE.md                   | 🟢 新项目引入 AI 协作的最快启动方式                           |
| /memory         | 在编辑器中编辑记忆文件               | 🟡 调试工具：怀疑 AI 没遵循规范时，查看 AI "脑中"的规则到底是什么 |
| /config         | 查看/修改全局配置（含 Output Style） | 🟢 调整全局设置、切换输出风格                                 |
| /permissions    | 查看/修改权限规则                    | 🟢 预批准安全的常用命令                                       |
| /hooks          | 交互式配置 Hooks                     | 🟡 配置事件驱动的自动化                                       |
| /model          | 切换模型或调整 Effort Level          | 🟡 根据任务复杂度切换                                         |
| /mcp            | 查看和管理 MCP 服务器                | 🟡 禁用不用的 MCP 节省上下文                                  |
| /keybindings    | 自定义所有键绑定                     | 🟡 重新映射快捷键，即时生效                                   |
| /terminal-setup | 配置终端兼容性                       | 🟢 在 IDE 终端/Warp/Alacritty 中启用 Shift+Enter 换行         |

### **项目与协作**

| 命令                | 说明                                                      | 使用场景                                                     |
| ------------------- | --------------------------------------------------------- | ------------------------------------------------------------ |
| /review             | 代码审查（需安装对应 skill/插件）                         | 🟢 比自然语言"帮我审查代码"意图更明确，可能触发专门的审查子代理 |
| /pr_comments        | 获取 PR 中的所有评论（需安装对应 skill/插件，非内置命令） | 🟡 不用切换到浏览器，直接在终端看同事的审查意见，然后说"根据第二条评论修改 @main.go" |
| /simplify [focus]   | 并行启动 3 个代理审查代码质量、复用、效率                 | 🟡 每次 PR 前运行，自动化最后一道质量关卡                     |
| /batch <指令>       | 大规模并行代码库迁移，每个单元独立 PR                     | 🔴 框架迁移、API 升级、全局重构                               |
| /sandbox            | 开启沙箱隔离                                              | 🔴 需要 OS 级文件系统隔离时                                   |
| /statusline         | 自定义状态栏                                              | 🟡 持续监控上下文使用情况                                     |
| /stats              | 查看使用统计与历史                                        | 🟢 查看用量和配额                                             |
| /install-github-app | 安装 Claude GitHub App                                    | 🔴 配置 GitHub Actions 集成                                   |
| /plugin             | 浏览插件市场                                              | 🟡 插件可打包 LSP、MCP、Skills、Agents、Hooks 为一体化能力包；团队可将常用插件配置纳入版本控制，确保成员环境一致 |

## CLI 启动参数

| 参数                                        | 说明                                                         | 常用度 |
| ------------------------------------------- | ------------------------------------------------------------ | ------ |
| claude                                      | 交互式启动                                                   | 🟢      |
| claude -p "prompt"                          | Headless 模式                                                | 🟡      |
| claude --continue                           | 继续当前目录最近的会话                                       | 🟢      |
| claude --resume                             | 选择并恢复会话                                               | 🟢      |
| claude --teleport                           | 将 Web 会话拉回本地终端                                      | 🟡      |
| claude --permission-mode plan               | 以 Plan Mode 启动                                            | 🟡      |
| claude --worktree [name]                    | 在 worktree 中启动                                           | 🔴      |
| claude -p "..." --output-format json        | JSON 输出（需配合 `-p`）                                     | 🟡      |
| claude -p "..." --output-format stream-json | 流式 JSON 输出（需配合 `-p`）                                | 🔴      |
| claude --allowedTools "Edit,Bash(*)"        | 指定工具免确认执行（不是限制可用工具；限制用 --tools 白名单或 --disallowedTools 黑名单） | 🔴      |
| claude --verbose                            | 调试输出                                                     | 🟡      |
| claude --dangerously-skip-permissions       | 跳过权限（强烈建议仅限隔离环境）                             | 🔴      |

## 附录 C 提示词速查表

| 场景         | 提示词模板                                                   | 难度 |
| ------------ | ------------------------------------------------------------ | ---- |
| 新项目探索   | 给我一个这个代码库的概览                                     | 🟢    |
| 理解架构     | 解释 @src/auth 目录的认证架构                                | 🟢    |
| 查找代码     | 找到处理用户认证的文件                                       | 🟢    |
| Bug 修复     | 错误信息: [粘贴]。找到根因，写失败测试，修复它               | 🟢    |
| 写测试       | 为 @path/to/file 编写测试，覆盖边界情况。不用 mock           | 🟢    |
| 代码审查     | 审查 @path/to/file 的安全性、性能和一致性                    | 🟢    |
| 重构         | 将 @path/to/file 重构为使用 [新模式]，保持行为不变           | 🟡    |
| 创建 PR      | 用描述性消息提交更改并创建 PR                                | 🟢    |
| 性能分析     | 分析 @path/to/file 的性能瓶颈并建议优化                      | 🟡    |
| 文档生成     | 为 @src/api/ 的公共函数添加 JSDoc 注释                       | 🟢    |
| 子代理调查   | 用子代理调查 [模块A] 和 [模块B] 的交互                       | 🟡    |
| 并行研究     | 使用独立的子代理并行研究 [A]、[B]、[C]                       | 🔴    |
| 采访模式     | 我想构建 [功能]。用 AskUserQuestion 对我进行详细采访         | 🟡    |
| 挑战方案     | grill me on these changes and don't make a PR until I pass your test | 🟡    |
| 证明有效     | prove to me this works. diff main 和 feature branch 的行为差异 | 🟡    |
| 推倒重来     | knowing everything you know now, scrap this and implement the elegant solution | 🟡    |
| 零切换修 Bug | 这是 Slack 上的 bug report：[粘贴]。Fix it.                  | 🟡    |
| 修 CI        | Go fix the failing CI tests.                                 | 🟢    |
| 并行算力     | [你的请求]。Use subagents.                                   | 🟡    |
| Git 历史     | 查看 @file 的 git 历史，总结它的 API 如何演变                | 🟡    |
| 深度思考     | /model → 调高 effort level → 输入复杂任务描述                | 🔴    |
| 批量 Lint    | claude -p "检查相对 main 的变更，报告拼写错误"               | 🔴    |