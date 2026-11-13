# GitHub / Agent Skills 连接状态（2026-11-13）

## 已确认

- GitHub 连接的账号：`huowu666-ops`。
- 仓库：<https://github.com/huowu666-ops/awesome-gamedev-agent-skills>。
- 经 GitHub API 验证：仓库存在，可读取 README，具有 `pull / push / admin` 权限，默认分支 `main`，**公开仓库（Public）**。
- README 记录的技能来源是 `gamedev-skills/awesome-gamedev-agent-skills`（Apache-2.0），包括 router 与跨引擎技能集合。
- 本项目仍采用自研 HTML Canvas 2D 引擎，不为技能而强制改用 Phaser/Godot/Unity。

## 项目技能接入

本交付包已将 `scripts/install-agent-skills.sh` 与 README 中的安装命令改成用户自己的 fork：

```bash
npx skills add huowu666-ops/awesome-gamedev-agent-skills
```

若在已安装 Node.js >=22.20 的开发电脑或 GitHub Codespaces，可运行：

```bash
bash scripts/install-agent-skills.sh
```

脚本把技能复制到项目的 AI agent 技能目录，不影响浏览器内的游戏，不会直接修改远端 GitHub 仓库。
`.github/workflows/skills-preview.yml` 提供手动运行的预览工作流，仅上传预览 artifact；不会自动提交。
**本会话未执行 npm 安装，也未把代码上传至用户的仓库。**

## 推荐的技能路由

| 工作任务 | 推荐的技能 |
|---|---|
| 游戏策划与剧情 | `rpg`, `dialogue-systems` |
| NPC 行走/避让 | `game-ai`, `level-design` |
| 存档升级、失败回滚 | `save-systems` |
| UI/UX、手机操作 | `game-ui-ux`, `input-systems` |
| 美术资产规范 | `create-game-assets` |
| 性能剖析 | `performance-optimization` |

## 仓库隔离和隐私

**不要把《万族争道》完整源码/素材上传到公开的技能库仓库。** 建议单独创建 Private 游戏仓库（例如 `huowu666-ops/wanzu-zhengdao`），将本开发包解压到游戏仓库根目录，再在 Actions 下启用静态检查和技能预览。游戏与技能库可保持两个独立版本历史。

上游第三方代码和素材版权各自独立；若未来实际复制 SKILL.md 文件，请保留对应许可与署名。
