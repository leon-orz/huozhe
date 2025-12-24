import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { ResourceStore, ResourceType } from '@/types'
import { ResourceType as RT } from '@/types'

export const useResourceStore = defineStore('resource', () => {
  // 资源存储
  const resources = ref<ResourceStore>({
    [RT.WOOD]: 0,
    [RT.STONE]: 0,
    [RT.FOOD]: 10, // 初始食物
    [RT.WATER]: 10, // 初始水
    [RT.IRON]: 0,
    [RT.CRYSTAL]: 0,
  })

  // 资源上限（可以通过建筑提升）
  const maxStorage = ref(100)

  // 资源名称映射
  const resourceNames: Record<ResourceType, string> = {
    [RT.WOOD]: '木材',
    [RT.STONE]: '石头',
    [RT.FOOD]: '食物',
    [RT.WATER]: '水',
    [RT.IRON]: '铁矿',
    [RT.CRYSTAL]: '水晶',
  }

  // 计算属性
  const totalResources = computed(() => {
    return Object.values(resources.value).reduce((sum, val) => sum + val, 0)
  })

  const storageUsed = computed(() => totalResources.value)
  const storagePercentage = computed(() => {
    return (totalResources.value / maxStorage.value) * 100
  })

  // 方法
  function getResource(type: ResourceType): number {
    return resources.value[type] || 0
  }

  function addResource(type: ResourceType, amount: number) {
    const current = resources.value[type] || 0
    const newAmount = Math.min(current + amount, maxStorage.value)
    resources.value[type] = Math.max(0, newAmount)
    return newAmount - current // 实际添加的数量
  }

  function consumeResource(type: ResourceType, amount: number): boolean {
    const current = resources.value[type] || 0
    if (current < amount) return false

    resources.value[type] = current - amount
    return true
  }

  function canAfford(cost: ResourceStore): boolean {
    for (const [key, amount] of Object.entries(cost)) {
      if ((resources.value[key] || 0) < amount) {
        return false
      }
    }
    return true
  }

  function payCost(cost: ResourceStore): boolean {
    if (!canAfford(cost)) return false

    for (const [key, amount] of Object.entries(cost)) {
      resources.value[key] = (resources.value[key] || 0) - amount
    }
    return true
  }

  function increaseMaxStorage(amount: number) {
    maxStorage.value += amount
  }

  function getResourceName(type: ResourceType): string {
    return resourceNames[type]
  }

  function resetResources() {
    resources.value = {
      [RT.WOOD]: 0,
      [RT.STONE]: 0,
      [RT.FOOD]: 10,
      [RT.WATER]: 10,
      [RT.IRON]: 0,
      [RT.CRYSTAL]: 0,
    }
    maxStorage.value = 100
  }

  return {
    // 状态
    resources,
    maxStorage,

    // 计算属性
    totalResources,
    storageUsed,
    storagePercentage,

    // 方法
    getResource,
    addResource,
    consumeResource,
    canAfford,
    payCost,
    increaseMaxStorage,
    getResourceName,
    resetResources,
  }
})
