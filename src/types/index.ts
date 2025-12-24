/**
 * 游戏核心类型定义
 */

/** 资源类型 */
export enum ResourceType {
  WOOD = 'wood', // 木材
  STONE = 'stone', // 石头
  FOOD = 'food', // 食物
  WATER = 'water', // 水
  IRON = 'iron', // 铁矿
  CRYSTAL = 'crystal', // 水晶（特殊资源）
}

/** 资源存储 */
export interface ResourceStore {
  [key: string]: number
}

/** 建筑类型 */
export enum BuildingType {
  // 采集设施
  WOOD_CAMP = 'wood_camp', // 伐木场
  STONE_MINE = 'stone_mine', // 采石场
  WATER_WELL = 'water_well', // 水井
  IRON_MINE = 'iron_mine', // 铁矿

  // 生产设施
  FARM = 'farm', // 农场
  WORKSHOP = 'workshop', // 工坊

  // 居住设施
  TENT = 'tent', // 帐篷
  HOUSE = 'house', // 房屋

  // 特殊设施
  STORAGE = 'storage', // 仓库
  LAB = 'lab', // 实验室（科技）
}

/** 建筑定义 */
export interface Building {
  id: BuildingType
  name: string
  description: string
  level: number
  maxLevel: number

  // 建造需求
  buildCost: ResourceStore
  buildTime: number // 秒

  // 生产配置
  production?: {
    resource: ResourceType
    amount: number
    interval: number // 生产间隔（秒）
  }

  // 特殊效果
  effect?: {
    type: 'storage' | 'population' | 'production_boost'
    value: number
  }
}

/** 科技类型 */
export interface Technology {
  id: string
  name: string
  description: string
  cost: ResourceStore
  researchTime: number // 研究时间（秒）
  unlockedBuildings: BuildingType[] // 解锁的建筑
  requirements: string[] // 前置科技
}

/** 居民属性 */
export interface Resident {
  id: string
  name: string
  health: number
  maxHealth: number
  attack: number
  defense: number
  stamina: number // 体力（0-100）

  // 技能（影响不同工作的效率）
  skills: {
    gathering: number // 采集
    building: number // 建造
    crafting: number // 制造
    combat: number // 战斗
  }

  // 状态
  status: 'idle' | 'working' | 'adventuring' | 'resting'
  assignment?: string // 分配的建筑ID或任务ID
}

/** 冒险关卡 */
export interface AdventureLevel {
  id: string
  name: string
  description: string
  difficulty: number // 难度 1-10
  recommendedPower: number // 推荐战力

  // 探索需求
  staminaCost: number // 体力消耗

  // 奖励
  rewards: {
    resources: ResourceStore
    specialItems?: string[]
  }

  // 敌人
  enemies: Enemy[]
}

/** 敌人 */
export interface Enemy {
  id: string
  name: string
  health: number
  attack: number
  defense: number
}

/** 探险小队 */
export interface AdventureTeam {
  id: string
  name: string
  members: string[] // 居民ID列表
  currentLevelId?: string // 当前关卡ID
  status: 'idle' | 'exploring' | 'in_combat'
  progress?: number // 探索进度 0-100
}

/** 游戏状态 */
export interface GameState {
  // 时间
  gameTime: number // 游戏时间（秒）
  lastUpdate: number // 上次更新时间戳

  // 资源
  resources: ResourceStore

  // 人口
  population: number
  maxPopulation: number
  residents: Resident[]

  // 建筑
  buildings: Record<BuildingType, Building | null>

  // 科技
  technologies: string[] // 已解锁的科技ID列表

  // 冒险
  teams: AdventureTeam[]
  completedLevels: string[] // 已完成的关卡

  // 游戏设置
  gameSpeed: number // 游戏速度倍率
}
