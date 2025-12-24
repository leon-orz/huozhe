/**
 * 游戏基础类型定义
 */

/** 游戏场景 */
export interface GameScene {
  id: string
  description: string
  choices: SceneChoice[]
  onEnter?: () => void
}

/** 场景选项 */
export interface SceneChoice {
  id: string
  text: string
  nextSceneId: string
  condition?: () => boolean
}

/** 游戏状态 */
export interface GameState {
  currentSceneId: string
  playerAttributes: PlayerAttributes
  inventory: string[]
  history: string[]
  flags: Record<string, boolean | number | string>
}

/** 玩家属性 */
export interface PlayerAttributes {
  health: number
  maxHealth: number
  attack: number
  defense: number
  level: number
  experience: number
}

/** 游戏配置 */
export interface GameConfig {
  initialSceneId: string
  initialAttributes: Partial<PlayerAttributes>
  scenes: Record<string, GameScene>
}
