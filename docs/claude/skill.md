# Skill 编写指南

Skill（技能）是给 Claude Code 的一组可复用能力：你把「做某类任务的步骤、规范、脚本」写进一个文件夹，Claude 在识别到相关意图时自动调用它。本页介绍 Skill 的标准目录结构、`SKILL.md` 各字段含义，以及一个可直接套用的示例。

## 什么是 Skill

一个 Skill 就是**一个文件夹**，文件夹里必须有一个 `SKILL.md` 作为入口。`SKILL.md` 由两部分组成：

- **frontmatter**（YAML 元信息）：告诉 Claude 这个 Skill 叫什么、什么时候用。
- **正文**（Markdown）：具体的执行步骤、约定与注意事项。

Claude 平时只读取 frontmatter 里的 `name` 与 `description`（成本极低）；只有当任务命中描述时，才进一步加载正文和附属文件。这种「按需加载」机制叫**渐进式披露（progressive disclosure）**，因此正文可以写得很详细而不必担心拖慢日常对话。

## 标准目录结构

```text
skill-name/                 # Skill 目录，文件夹名即 Skill 名（小写 kebab-case）
├── SKILL.md                # 【必需】入口文件：frontmatter + 执行说明
├── reference.md            # 【可选】更详细的参考资料，正文用到时再被读取
├── scripts/                # 【可选】可执行脚本，供 Claude 通过 Bash 调用
│   └── process.py
└── assets/                 # 【可选】模板、样例、配置等静态资源
    └── template.md
```

::: tip 只有 `SKILL.md` 是必需的
最简单的 Skill 可以只有一个 `SKILL.md` 文件。`reference.md`、`scripts/`、`assets/` 都是按需添加——当步骤复杂到需要拆分、或需要调用脚本/套用模板时才建。
:::

存放位置决定了 Skill 的作用范围：

| 位置 | 作用范围 |
| --- | --- |
| `~/.claude/skills/<skill-name>/` | 个人全局，所有项目可用 |
| `<项目>/.claude/skills/<skill-name>/` | 仅当前项目可用，可随仓库提交共享 |

## SKILL.md 字段说明

`SKILL.md` 顶部的 frontmatter 用 `---` 包裹。**所有字段都是可选的**，只有 `description` 强烈推荐填写——Claude 靠它判断何时自动加载这个 Skill。下表按用途分组列出 Claude Code 支持的全部字段。

### 基础与触发

| 字段 | 必填 | 默认 | 说明 |
| --- | --- | --- | --- |
| `name` | 否 | 目录名 | Skill 在列表中的**显示名**。注意：除插件根目录外，它不改变你 `/` 后输入的命令名（命令名来自目录名）。 |
| `description` | 推荐 | 正文首段 | 说明**做什么、何时用**，Claude 据此决定是否自动调用。与 `when_to_use` 合计在列表中按 **1536 字符**截断，故把核心用途写在最前。 |
| `when_to_use` | 否 | — | 补充触发场景，如典型触发语或示例请求。追加在 `description` 之后，同样计入 1536 字符上限。 |
| `paths` | 否 | — | glob 模式，**限定自动激活的时机**：仅当处理匹配文件时才自动加载。逗号分隔字符串或 YAML 列表。 |

### 调用控制

| 字段 | 必填 | 默认 | 说明 |
| --- | --- | --- | --- |
| `disable-model-invocation` | 否 | `false` | 设为 `true` 后 **Claude 不再自动加载**该 Skill，**只能由你手动 `/name` 触发**。适合有副作用、需自己把控时机的流程（如 `/commit`、`/deploy`）。也会阻止它被预加载进子代理。 |
| `user-invocable` | 否 | `true` | 设为 `false` 则**从 `/` 菜单隐藏，只有 Claude 能调用**。适合「背景知识」类 Skill——用户不需要也不该直接当命令执行。 |

### 参数传递

| 字段 | 必填 | 默认 | 说明 |
| --- | --- | --- | --- |
| `argument-hint` | 否 | — | 自动补全时显示的参数提示，如 `[issue-number]` 或 `[filename] [format]`。 |
| `arguments` | 否 | — | 声明命名位置参数，供正文用 `$name` 替换。空格分隔字符串或 YAML 列表，按顺序映射位置。 |

### 工具与执行环境

| 字段 | 必填 | 默认 | 说明 |
| --- | --- | --- | --- |
| `allowed-tools` | 否 | — | Skill 激活时**免确认**即可使用的工具。它只是免去授权提示，**不限制**其它工具的可用性。空格/逗号分隔或 YAML 列表。 |
| `disallowed-tools` | 否 | — | Skill 激活期间**从工具池移除**的工具（如让后台循环 Skill 永不调用 `AskUserQuestion`）。下次发消息后恢复。 |
| `model` | 否 | 会话模型 | Skill 激活时切换的模型，仅当前回合生效，下次 prompt 恢复会话模型。取值同 `/model`，或 `inherit`。 |
| `effort` | 否 | 继承会话 | 激活时的努力级别，覆盖会话设置。可选 `low` / `medium` / `high` / `xhigh` / `max`（取决于模型）。 |
| `context` | 否 | — | 设为 `fork` 则在**派生的子代理上下文**中运行该 Skill。 |
| `agent` | 否 | — | 当 `context: fork` 时，指定使用的子代理类型。 |
| `hooks` | 否 | — | 绑定到该 Skill 生命周期的 hooks。 |
| `shell` | 否 | `bash` | 正文内联命令（`` !`command` ``、` ```! ` 块）使用的 shell，可选 `bash` 或 `powershell`。 |

::: warning `description` 是命中率的关键
Claude 是否自动触发某个 Skill，几乎只取决于 `description`（和 `when_to_use`）。建议同时写清「做什么」和「什么时候用」，并带上典型触发语，例如：「提取 PDF 文本与表格。当用户需要读取、解析或分析 PDF 文档时使用。」
:::

### 控制由谁调用

默认情况下**你和 Claude 都能**调用一个 Skill：你可以 `/skill-name` 手动触发，Claude 也会在相关时自动加载。`disable-model-invocation` 与 `user-invocable` 两个字段用来收窄这一行为，它们还影响 Skill 描述是否常驻上下文：

| frontmatter | 你能调用 | Claude 能调用 | 何时载入上下文 |
| --- | --- | --- | --- |
| （默认） | 能 | 能 | 描述常驻上下文，调用时载入完整正文 |
| `disable-model-invocation: true` | 能 | 否 | 描述**不**进上下文，仅你调用时载入正文 |
| `user-invocable: false` | 否 | 能 | 描述常驻上下文，调用时载入完整正文 |

::: tip 对应前面的两类 Skill
**任务型**（如 `/commit`、`/push`）通常加 `disable-model-invocation: true`，避免 Claude 擅自执行有副作用的动作；**参考型**的背景知识若不适合当命令用，则可加 `user-invocable: false` 只供 Claude 内部参考。
:::

## 参考型与任务型 Skill

按正文承担的职责，Skill 大致分两类。理解这个区别有助于决定正文该写「知识」还是「步骤」。

**参考型（reference）**：为 Claude 提供**查阅用的事实、规范或知识**，让它在回答相关问题时检索调用。

- 正文以**知识、数据、约定**为主，而非操作流程。
- 触发后 Claude 主要据此**作答或决策**，通常不一定改动文件。
- 例：`claude-api`（提供模型 id、定价、参数等参考）。

**任务型（task / workflow）**：按一套**固定流程执行操作**，完成一件具体的事。

- 正文以**有序的步骤清单**为主，常调用脚本、读写文件。
- 往往对应一个 slash 命令，由用户主动触发（如 `/commit`、`/push`）。
- 例：`commit`、`push`、`new-doc`。

| 维度 | 参考型 | 任务型 |
| --- | --- | --- |
| 正文核心 | 知识 / 规范 / 数据 | 有序执行步骤 |
| 触发方式 | 命中问题时自动检索 | 多由用户 `/命令` 主动调用 |
| 典型产出 | 回答、判断依据 | 改动文件、执行命令 |
| 是否常带脚本 | 较少 | 常见（`scripts/`） |
| 例子 | `claude-api` | `commit`、`push` |

::: tip 两类并非互斥
同一个 Skill 可以兼具两面——先给出规范（参考），再给出据此执行的步骤（任务）。分类只是帮助你想清楚「正文重点写什么」，不必生硬归类。
:::

## 使用示例

下面是一个完整的 `SKILL.md`，演示 frontmatter 与正文的写法：

```markdown
---
name: pdf-extract
description: 提取 PDF 中的文本与表格。当用户需要读取、解析或分析 PDF 文档时使用。
allowed-tools: Read, Bash
---

# PDF 提取

把 PDF 转成可处理的文本，再按需要交给后续步骤。

## 步骤

1. 用 `scripts/extract.py` 将目标 PDF 转为纯文本：

   ```bash
   python scripts/extract.py <pdf 路径> > /tmp/out.txt
   ```

2. 读取 `/tmp/out.txt`，按用户需求总结、检索或抽取表格。
3. 输出结果时保留原文的章节层级。

## 注意

- 扫描件（图片型 PDF）无法直接抽取文本，需先提示用户改用 OCR。
```

对应的目录：

```text
pdf-extract/
├── SKILL.md
└── scripts/
    └── extract.py
```

把这个文件夹放进 `~/.claude/skills/`（全局）或项目的 `.claude/skills/`（随仓库共享）后，当你说「帮我解析这份 PDF」时，Claude 就会自动加载并按上面的步骤执行。

::: details 本站自己的 Skill 在哪里？
本仓库的 `.claude/skills/` 下就放着 `new-doc`、`commit`、`push` 等 Skill——你输入 `/new-doc`、`/commit` 时调用的正是它们，可作为现成范例参考。
:::
