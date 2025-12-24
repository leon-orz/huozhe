import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Resident } from '@/types'
import { useBuildingStore } from './building'

export const usePopulationStore = defineStore('population', () => {
  const buildingStore = useBuildingStore()

  // 居民列表
  const residents = ref<Resident[]>([
    {
      id: 'hero',
      name: '主角',
      health: 100,
      maxHealth: 100,
      attack: 10,
      defense: 5,
      stamina: 100,
      skills: {
        gathering: 5,
        building: 5,
        crafting: 5,
        combat: 5,
      },
      status: 'idle',
    },
  ])

  // 计算属性
  const population = computed(() => residents.value.length)
  const maxPopulation = computed(
    () => 1 + buildingStore.totalPopulationBonus // 基础1个 + 建筑加成
  )

  const idleResidents = computed(() =>
    residents.value.filter((r) => r.status === 'idle')
  )

  const workingResidents = computed(() =>
    residents.value.filter((r) => r.status === 'working')
  )

  const adventuringResidents = computed(() =>
    residents.value.filter((r) => r.status === 'adventuring')
  )

  // 方法
  function getResident(id: string): Resident | undefined {
    return residents.value.find((r) => r.id === id)
  }

  function addResident(resident: Resident) {
    residents.value.push(resident)
  }

  function generateRandomResident(): Resident {
    const id = 'resident_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
    const names = ['艾伦', '贝拉', '卡尔', '戴安娜', '埃里克', '菲奥娜', '乔治', '汉娜']
    const randomName = names[Math.floor(Math.random() * names.length)]

    return {
      id,
      name: randomName,
      health: 80 + Math.floor(Math.random() * 40),
      maxHealth: 100,
      attack: 5 + Math.floor(Math.random() * 10),
      defense: 3 + Math.floor(Math.random() * 8),
      stamina: 100,
      skills: {
        gathering: 1 + Math.floor(Math.random() * 5),
        building: 1 + Math.floor(Math.random() * 5),
        crafting: 1 + Math.floor(Math.random() * 5),
        combat: 1 + Math.floor(Math.random() * 5),
      },
      status: 'idle',
    }
  }

  function removeResident(id: string) {
    const index = residents.value.findIndex((r) => r.id === id)
    if (index !== -1) {
      residents.value.splice(index, 1)
    }
  }

  function updateResidentStatus(
    id: string,
    status: Resident['status'],
    assignment?: string
  ) {
    const resident = getResident(id)
    if (resident) {
      resident.status = status
      resident.assignment = assignment
    }
  }

  function recoverStamina(id: string, amount: number) {
    const resident = getResident(id)
    if (resident) {
      resident.stamina = Math.min(100, resident.stamina + amount)
    }
  }

  function consumeStamina(id: string, amount: number): boolean {
    const resident = getResident(id)
    if (!resident || resident.stamina < amount) return false

    resident.stamina -= amount
    return true
  }

  function canRecruit(): boolean {
    return population.value < maxPopulation.value
  }

  function recruitResident(): boolean {
    if (!canRecruit()) return false

    addResident(generateRandomResident())
    return true
  }

  function resetPopulation() {
    residents.value = [
      {
        id: 'hero',
        name: '主角',
        health: 100,
        maxHealth: 100,
        attack: 10,
        defense: 5,
        stamina: 100,
        skills: {
          gathering: 5,
          building: 5,
          crafting: 5,
          combat: 5,
        },
        status: 'idle',
      },
    ]
  }

  return {
    // 状态
    residents,

    // 计算属性
    population,
    maxPopulation,
    idleResidents,
    workingResidents,
    adventuringResidents,

    // 方法
    getResident,
    addResident,
    generateRandomResident,
    removeResident,
    updateResidentStatus,
    recoverStamina,
    consumeStamina,
    canRecruit,
    recruitResident,
    resetPopulation,
  }
})
