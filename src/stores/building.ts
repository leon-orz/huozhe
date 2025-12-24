import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Building, BuildingType, ResourceStore } from '@/types'
import { BuildingType as BT, ResourceType as RT } from '@/types'
import { useResourceStore } from './resource'

// 建筑配置定义
const BUILDING_CONFIGS: Record<BuildingType, Omit<Building, 'level'>> = {
  // 采集设施
  [BT.WOOD_CAMP]: {
    id: BT.WOOD_CAMP,
    name: '伐木场',
    description: '自动采集木材',
    maxLevel: 10,
    buildCost: { [RT.WOOD]: 10, [RT.STONE]: 5 },
    buildTime: 5,
    production: { resource: RT.WOOD, amount: 1, interval: 3 },
  },
  [BT.STONE_MINE]: {
    id: BT.STONE_MINE,
    name: '采石场',
    description: '自动采集石头',
    maxLevel: 10,
    buildCost: { [RT.WOOD]: 15, [RT.STONE]: 0 },
    buildTime: 10,
    production: { resource: RT.STONE, amount: 1, interval: 5 },
  },
  [BT.WATER_WELL]: {
    id: BT.WATER_WELL,
    name: '水井',
    description: '自动生产水',
    maxLevel: 5,
    buildCost: { [RT.WOOD]: 20, [RT.STONE]: 10 },
    buildTime: 15,
    production: { resource: RT.WATER, amount: 2, interval: 10 },
  },
  [BT.IRON_MINE]: {
    id: BT.IRON_MINE,
    name: '铁矿',
    description: '自动开采铁矿（需要科技解锁）',
    maxLevel: 10,
    buildCost: { [RT.WOOD]: 50, [RT.STONE]: 50, [RT.IRON]: 0 },
    buildTime: 30,
    production: { resource: RT.IRON, amount: 1, interval: 15 },
  },

  // 生产设施
  [BT.FARM]: {
    id: BT.FARM,
    name: '农场',
    description: '生产食物',
    maxLevel: 10,
    buildCost: { [RT.WOOD]: 30, [RT.STONE]: 20 },
    buildTime: 20,
    production: { resource: RT.FOOD, amount: 3, interval: 10 },
  },
  [BT.WORKSHOP]: {
    id: BT.WORKSHOP,
    name: '工坊',
    description: '用于制造工具和装备',
    maxLevel: 5,
    buildCost: { [RT.WOOD]: 50, [RT.STONE]: 30 },
    buildTime: 30,
  },

  // 居住设施
  [BT.TENT]: {
    id: BT.TENT,
    name: '帐篷',
    description: '提供 2 个居住位',
    maxLevel: 5,
    buildCost: { [RT.WOOD]: 20, [RT.STONE]: 0 },
    buildTime: 10,
    effect: { type: 'population', value: 2 },
  },
  [BT.HOUSE]: {
    id: BT.HOUSE,
    name: '房屋',
    description: '提供 5 个居住位（需要科技解锁）',
    maxLevel: 10,
    buildCost: { [RT.WOOD]: 100, [RT.STONE]: 50 },
    buildTime: 60,
    effect: { type: 'population', value: 5 },
  },

  // 特殊设施
  [BT.STORAGE]: {
    id: BT.STORAGE,
    name: '仓库',
    description: '增加 100 资源存储上限',
    maxLevel: 10,
    buildCost: { [RT.WOOD]: 50, [RT.STONE]: 50 },
    buildTime: 30,
    effect: { type: 'storage', value: 100 },
  },
  [BT.LAB]: {
    id: BT.LAB,
    name: '实验室',
    description: '用于研发科技',
    maxLevel: 1,
    buildCost: { [RT.WOOD]: 200, [RT.STONE]: 100, [RT.IRON]: 50 },
    buildTime: 120,
  },
}

export const useBuildingStore = defineStore('building', () => {
  const resourceStore = useResourceStore()

  // 建筑实例
  const buildings = ref<Record<BuildingType, Building | null>>({
    [BT.WOOD_CAMP]: null,
    [BT.STONE_MINE]: null,
    [BT.WATER_WELL]: null,
    [BT.IRON_MINE]: null,
    [BT.FARM]: null,
    [BT.WORKSHOP]: null,
    [BT.TENT]: null,
    [BT.HOUSE]: null,
    [BT.STORAGE]: null,
    [BT.LAB]: null,
  })

  // 建造队列（简化版本，暂不支持队列）
  const isBuilding = ref(false)

  // 计算属性
  const builtBuildings = computed(() => {
    return Object.values(buildings.value).filter((b) => b !== null) as Building[]
  })

  const totalPopulationBonus = computed(() => {
    return builtBuildings.value
      .filter((b) => b.effect?.type === 'population')
      .reduce((sum, b) => sum + (b.effect?.value || 0), 0)
  })

  const totalStorageBonus = computed(() => {
    return builtBuildings.value
      .filter((b) => b.effect?.type === 'storage')
      .reduce((sum, b) => sum + (b.effect?.value || 0), 0)
  })

  // 方法
  function getBuilding(type: BuildingType): Building | null {
    return buildings.value[type]
  }

  function canBuild(type: BuildingType): boolean {
    const config = BUILDING_CONFIGS[type]
    const existing = buildings.value[type]

    // 检查是否已达到最大等级
    if (existing && existing.level >= existing.maxLevel) {
      return false
    }

    // 检查资源是否足够
    return resourceStore.canAfford(config.buildCost)
  }

  function build(type: BuildingType): boolean {
    if (!canBuild(type)) return false

    const config = BUILDING_CONFIGS[type]
    const existing = buildings.value[type]

    // 扣除资源
    if (!resourceStore.payCost(config.buildCost)) {
      return false
    }

    // 建造或升级
    if (existing) {
      existing.level++
      // 升级后成本增加（简化处理）
      existing.buildCost = Object.entries(config.buildCost).reduce((cost, [key, val]) => {
        cost[key] = Math.floor(val * (existing.level + 1) * 1.5)
        return cost
      }, {} as ResourceStore)
    } else {
      buildings.value[type] = {
        ...config,
        level: 1,
        buildCost: { ...config.buildCost },
      }

      // 应用效果
      if (config.effect?.type === 'storage') {
        resourceStore.increaseMaxStorage(config.effect.value)
      }
    }

    return true
  }

  function getBuildingInfo(type: BuildingType) {
    return BUILDING_CONFIGS[type]
  }

  function getAllBuildingConfigs() {
    return BUILDING_CONFIGS
  }

  // 生产循环（由游戏循环调用）
  function updateProduction(deltaTime: number) {
    builtBuildings.value.forEach((building) => {
      if (!building.production) return

      const { resource, amount, interval } = building.production
      const productionAmount = (amount * deltaTime * building.level) / interval
      resourceStore.addResource(resource, productionAmount)
    })
  }

  function resetBuildings() {
    Object.keys(buildings.value).forEach((key) => {
      buildings.value[key as BuildingType] = null
    })
  }

  return {
    // 状态
    buildings,
    isBuilding,

    // 计算属性
    builtBuildings,
    totalPopulationBonus,
    totalStorageBonus,

    // 方法
    getBuilding,
    canBuild,
    build,
    getBuildingInfo,
    getAllBuildingConfigs,
    updateProduction,
    resetBuildings,
  }
})
