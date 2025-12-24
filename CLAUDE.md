# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

**huozhe (火种)** 是一款基于 Vue 3 + TypeScript + Vite 构建的文本冒险游戏。玩家通过选择推进末日废土世界的叙事剧情，同时管理玩家属性（生命值、攻击力、防御力、等级）和物品栏。

## 开发命令

```bash
# 启动开发服务器
npm run dev

# 生产环境构建（会先运行类型检查再构建）
npm run build

# 预览生产构建
npm run preview

# 代码检查并自动修复
npm run lint

# 代码格式化
npm run format
```

## 架构设计

### 核心设计模式

游戏采用**场景化叙事架构**，通过 Vue 3 组合式 API (Composables) 集中管理状态：

1. **类型层** (`src/types/game.ts`)：定义游戏实体的所有 TypeScript 接口
   - `GameScene`：场景，包含描述、选项和可选的 onEnter 回调
   - `SceneChoice`：玩家选项，支持条件函数
   - `GameState`：响应式状态（当前场景ID、玩家属性、物品栏、历史记录、标志位）
   - `PlayerAttributes`：玩家属性（生命值、攻击力、防御力、等级、经验值）
   - `GameConfig`：游戏配置，包含初始状态和场景注册表

2. **组合式函数层** (`src/composables/use-game.ts`)：核心游戏逻辑
   - `useGame(config)` 工厂函数创建独立游戏实例
   - 通过 `goToScene()` 和 `selectChoice()` 管理场景切换
   - 暴露响应式 `state` 和计算属性 `currentScene`

3. **配置层** (`src/config/game-config.ts`)：游戏内容
   - `DEFAULT_CONFIG` 包含所有游戏场景（叙事文本、选项、分支）
   - 扩展或替换此对象可创建不同的游戏剧情

4. **组件层**：单一 `game-container.vue` 组件渲染 UI
   - 使用 composable 获取状态和操作方法
   - 组件中不包含业务逻辑

### 关键架构决策

- **场景 ID 查找**：所有场景存储为 `Record<string, GameScene>`，通过 ID 访问
- **条件选项**：`SceneChoice.condition()` 返回布尔值控制选项可用性
- **场景回调**：`GameScene.onEnter()` 在场景激活时执行
- **历史记录**：`state.history` 维护已访问场景 ID 的栈
- **标志位系统**：`state.flags` 是通用记录对象，用于追踪游戏事件/变量

### 导入路径别名

Vite 将 `@/` 解析为 `src/`（在 `vite.config.ts` 和 `tsconfig.json` 中配置）

## 代码风格

- **缩进**：2 个空格（ESLint 强制）
- **最大行宽**：150 字符（ESLint 警告）
- **语言**：用户可见内容使用中文，代码使用英文
- **格式化**：Prettier 配置（无分号、单引号、省略尾随逗号）
