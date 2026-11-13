# 《万族争道》V34 — AI 开发协作约定

## 引擎检测
这是 **原生 HTML + CSS + JavaScript + Canvas 2D** 的自研网页游戏，单文件 `index.html` 可离线启动。**不是 Phaser / PixiJS / Godot / Unity**；禁止未经要求迁移引擎。游戏同时包含旧版文字 CRPG、原版动作试炼及 V27–V34 像素生活模块。

## 外部技能库
技能来源：你的 GitHub 仓库 `huowu666-ops/awesome-gamedev-agent-skills`；上游 `gamedev-skills/awesome-gamedev-agent-skills`，Apache-2.0。项目含安装脚本 `scripts/install-agent-skills.sh`。安装前应先审查其代码和许可证；安装需要联网和 Node.js >=22.20。

适用的技能组合：
- UI、触控、导航：`game-ui-ux` + `input-systems`
- 存档、迁移、损坏校验：`save-systems`
- NPC 巡游、寻路与碰撞：`game-ai` + `level-design`
- 像素素材统一与检验：`create-game-assets`
- 五族人物任务与对话：`dialogue-systems` + `rpg`
- 长期运行卡顿：`performance-optimization`（先测量）
- 关卡迭代：`game-docs`（只在文档任务中使用）

所有技能只提供**设计与检查流程**。不要假定本自研 Canvas 引擎存在其它引擎的 API。

## 不可破坏的约束
1. 保留 `window.V27`–`window.V34` 兼容调用；不覆盖旧版文字游戏全局 `S`、`SAVE_KEY`、`FT`。
2. 继续接受 `WZ27:` 存档码和 `wanzu_v27_pixel_sanctuary` 键。新字段必须加入 `fresh()` 与 `validated()`，白名单校验。
3. 所有付费、奖励、任务阶段更新须通过写盘成功后才交换状态的 `change()` 事务；失败时不得扣款或给奖励。
4. 种田与战斗可独立毕业（各自条件）；不会强制其中一条依赖另一条。
5. 图片保持最近邻像素缩放，无外部 HTTP 运行依赖。尽量保留 32×32 人物、64×64 地图瓦片、16×16 图标规范。
6. 主要交互测试覆盖 320×640、375×667、390×844；检查横向溢出、目标可触达、键盘／触控、存档导入和 `localStorage` 故障。
7. 禁止在 GitHub issue / 日志中上传玩家的完整存档码或账户凭据。

## 构建与检查
```bash
python scripts/build_v34.py
python scripts/verify.py
```
可选的浏览器专项测试：在有 Python Playwright + Chromium 的环境运行 `python tests/test_v34.py`。不具有这些依赖时不能将其称为“已跑通过”。

## 版本推进
新内容按“源码评审 → 修复 → 单元/模拟测试 → 触控回归 → 日志总结”的顺序。新版本必须说明已完成与未完成事项，切忌用夸张的测试断言替代实体 iPhone Safari 验证。

## 同仓库公开协作
- 你已明确同意将游戏与 Agent Skills 放在同一个公开仓库中。本项目专属目录为 `projects/wanzu-zhengdao/`，绝不覆盖技能库根目录与已有文件。
- 游戏新增工作流使用根目录 `.github/workflows/wanzu-verify.yml`，不要覆盖上游同名工作流。
- 原有玩家存档码、口令、令牌和私密数据不得提交。
- GitHub 集成目前读取可用，但文件写入和创建分支均被 403 拒绝；请不要误称已提交。
