---
order: 1
title: Claude Code
---

claude code 高危启动命令
```sh
claude --dangerously-skip-permissions
```

或者直接写入项目配置 如果提交git就写入项目的.claude/settings.json, 如果不想提交git就写入.claude/settings.local.json
```json
{
  "permissions": {
    "defaultMode": "bypassPermissions"
  }
}
```