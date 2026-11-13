# 《万族争道 V34》开发与自检报告

日期：2026-11-13

## 本轮实际实现
- 新增七条可切换的任务追踪：每日山居、灵溪河神旧誓、五位 NPC 的两章人物任务。
- 追踪状态 `trackedQuest` 保存于旧 `WZ27:` 格式；旧 V33 数据缺失字段时默认 `main`；恶意/损坏任务标识由白名单归一。
- 游戏 HUD 新增追踪卡片、追踪任务选择界面、地图寻路；追踪 NPC 以柔金边框标出。
- 寻路复用 `pathTo` / `clickTile` / `transfer`；无法直达的跨区域任务给出引导，不凭空瞬移。
- 新增 `window.V34` 兼容别名，保留 `V27` 至 `V33` 旧入口，既有原版文字 CRPG、种田、村镇、秘境均未移除。
- 建立 GitHub 工程结构：`AGENTS.md`、自定义项目 skill、官方 Agent Skills 的 CLI 安装脚本、GitHub Actions 静态检查及第三方技能预览工作流。

## 测试（已实际执行）
| 项目 | 结果 |
|---|---:|
| V33 回归脚本移植至 V34（3 手机视口） | 84/84 |
| V34 追踪、切换、旧存档迁移、存储失败回滚、恶意 ID、自动寻路（3 手机视口） | 52/52 |
| JavaScript 语法静态检查 | 28/28 内嵌脚本 |
| GitHub 项目 `scripts/verify.py` | 通过 |
| `scripts/build_v34.py` 可重建性，产出 SHA-256 一致 | 通过 |
| V34 项目内 Playwright 测试 | 52/52 |

说明：以上 136 项自动化断言不等于 136 个独立玩法；不同测试会重复覆盖基础功能。浏览器测试使用 Chromium + 模拟 localStorage；**未在实体 iPhone Safari 上跑满整季、完整战斗通关或长期保留文件持久化**。

## GitHub 集成情况
- GitHub 连接已经成功读取身份。
- 连接下**可访问仓库列表为空**，所以未上传到任何 GitHub 仓库，也未创建或提交 PR。
- 上游官方仓库已核实：`gamedev-skills/awesome-gamedev-agent-skills`，v2.0.0、Apache-2.0、79 项技能、Node.js >=22.20。
- GitHub 项目包内放了自动安装脚本与工作流，但当前运行环境无法访问 npm/GitHub，因此**未执行官方技能下载**。保留了项目原创的 `wanzu-canvas-game` skill 作为已存在的本地适配。
- 两个 GitHub Actions 文件的 YAML 在本地生成并经过文件检查，但云端工作流**尚未由用户的 GitHub 仓库触发**。

## 后续 P0
1. 获取用户授权的仓库（建议 Private），推送已审查的项目文件并实际跑一遍 GitHub Actions。
2. 检查官方 Agent Skills 安装产物并锁定版本，勿盲目引入 79 项影响上下文。
3. 根据 `game-ai` / `level-design` 深化跨区 NPC 自主寻路；根据 `save-systems` 开展 iPhone Safari 离线持久化实测。
4. 按项目自有像素美术规范扩大连续村镇，而非复制第三方游戏资产。
