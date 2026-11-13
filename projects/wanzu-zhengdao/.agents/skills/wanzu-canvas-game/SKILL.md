---
name: wanzu-canvas-game
description: Work on the Wanzu Zhengdao custom HTML Canvas cultivation life-sim game. Use for changes to NPC quests, crop systems, mobile input, offline saves, sprite rules, and V27-V34 compatibility.
---

# Wanzu Canvas Game (project-local adapter)

This skill is **original project guidance**, not copied from `awesome-gamedev-agent-skills` and not an engine plugin.

## Development workflow
1. Read `AGENTS.md` and inspect the `index.html` engine and `source/V34_pixel_module.js` before modifying.
2. Select 1–3 relevant upstream official skills (if installed): `save-systems`, `game-ai`, `game-ui-ux`, `input-systems`, `level-design`, `create-game-assets`, `dialogue-systems`, `rpg`.
3. Preserve the existing custom Canvas APIs; never introduce Phaser/Unity/Godot API calls without a deliberate migration.
4. Update authoritative save schema migration, gameplay and rendering paths together.
5. Rebuild and run static verification; then test mobile viewport, old save compatibility and storage fault rollback.
6. Document what was tested, what was not tested, and any manual iPhone test still needed.

## Check
Run `python scripts/verify.py`. If modifying touch, UI or saves, also run `tests/test_v34.py` in a Playwright/Chromium environment.
