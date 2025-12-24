# 火种 (huozhe)

一款基于 Vue 3 + TypeScript + Vite 构建的文本冒险游戏。玩家通过选择推进末日废土世界的叙事剧情，同时管理玩家属性和物品栏。

## 特性

- 沉浸式文本冒险体验
- 玩家属性系统（生命值、攻击力、防御力、等级、经验值）
- 物品栏管理
- 条件分支和剧情选择
- 场景历史记录
- 标志位系统追踪游戏状态

## 技术栈

- **Vue 3** - 响应式 UI 框架
- **TypeScript** - 类型安全
- **Vite** - 快速的开发构建工具
- **组合式 API** - 状态管理

## 项目结构

```
huozhe/
├── src/
│   ├── components/       # Vue 组件
│   │   └── game-container.vue
│   ├── composables/      # 组合式函数
│   │   └── use-game.ts   # 核心游戏逻辑
│   ├── config/           # 游戏配置
│   │   └── game-config.ts
│   ├── types/            # TypeScript 类型定义
│   │   └── game.ts
│   ├── App.vue
│   ├── main.ts
│   └── style.css
├── index.html
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## 开发

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

### 代码检查和格式化

```bash
# 代码检查并自动修复
npm run lint

# 代码格式化
npm run format
```

## 架构设计

游戏采用**场景化叙事架构**：

1. **类型层** (`src/types/game.ts`) - 定义游戏实体的 TypeScript 接口
2. **组合式函数层** (`src/composables/use-game.ts`) - 核心游戏逻辑，管理场景切换
3. **配置层** (`src/config/game-config.ts`) - 游戏内容，包含所有场景和剧情
4. **组件层** (`src/components/game-container.vue`) - 渲染 UI

### 核心概念

- **GameScene** - 场景，包含描述、选项和可选的 onEnter 回调
- **SceneChoice** - 玩家选项，支持条件函数控制可用性
- **GameState** - 响应式状态，包含当前场景、玩家属性、物品栏、历史记录和标志位
- **GameConfig** - 游戏配置，包含初始状态和场景注册表

## 代码风格

- 缩进：2 个空格
- 最大行宽：150 字符
- 编码：UTF-8
- 语言：用户可见内容使用中文，代码使用英文

## 许可证

MIT
