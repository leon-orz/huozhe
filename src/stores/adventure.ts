import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { AdventureLevel, AdventureTeam, Enemy } from '@/types'
import { usePopulationStore } from './population'
import { useResourceStore } from './resource'
import { ResourceType as RT } from '@/types'

// 关卡配置
const ADVENTURE_LEVELS: AdventureLevel[] = [
  {
    id: 'forest_1',
    name: '迷雾森林',
    description: '附近的森林，有一些野兽出没',
    difficulty: 1,
    recommendedPower: 20,
    staminaCost: 20,
    rewards: {
      resources: {
        [RT.WOOD]: 20,
        [RT.FOOD]: 10,
      },
    },
    enemies: [
      { id: 'wolf_1', name: '野狼', health: 30, attack: 8, defense: 3 },
    ],
  },
  {
    id: 'ruins_1',
    name: '废弃矿坑',
    description: '一个废弃的矿坑，可能有石头和铁矿',
    difficulty: 3,
    recommendedPower: 50,
    staminaCost: 30,
    rewards: {
      resources: {
        [RT.STONE]: 30,
        [RT.IRON]: 10,
      },
    },
    enemies: [
      { id: 'goblin_1', name: '哥布林', health: 40, attack: 12, defense: 5 },
      { id: 'goblin_2', name: '哥布林', health: 35, attack: 10, defense: 4 },
    ],
  },
  {
    id: 'crystal_cave',
    name: '水晶洞穴',
    description: '传说中的水晶洞穴，有稀有资源',
    difficulty: 8,
    recommendedPower: 150,
    staminaCost: 50,
    rewards: {
      resources: {
        [RT.CRYSTAL]: 5,
        [RT.IRON]: 50,
      },
      specialItems: ['水晶碎片'],
    },
    enemies: [
      { id: 'crystal_golem', name: '水晶魔像', health: 200, attack: 30, defense: 20 },
    ],
  },
]

export const useAdventureStore = defineStore('adventure', () => {
  const populationStore = usePopulationStore()
  const resourceStore = useResourceStore()

  // 探险小队
  const teams = ref<AdventureTeam[]>([
    {
      id: 'main_team',
      name: '主队',
      members: [],
      status: 'idle',
    },
  ])

  // 已完成的关卡
  const completedLevels = ref<string[]>([])

  // 当前探索状态
  const currentLevel = ref<AdventureLevel | null>(null)
  const explorationProgress = ref(0)
  const explorationResult = ref<string | null>(null)

  // 计算属性
  const availableLevels = computed(() => {
    return ADVENTURE_LEVELS
  })

  const idleTeams = computed(() =>
    teams.value.filter((t) => t.status === 'idle')
  )

  const exploringTeams = computed(() =>
    teams.value.filter((t) => t.status === 'exploring')
  )

  // 方法
  function getLevel(id: string): AdventureLevel | undefined {
    return ADVENTURE_LEVELS.find((l) => l.id === id)
  }

  function getTeam(id: string): AdventureTeam | undefined {
    return teams.value.find((t) => t.id === id)
  }

  function createTeam(name: string): AdventureTeam {
    const team: AdventureTeam = {
      id: 'team_' + Date.now(),
      name,
      members: [],
      status: 'idle',
    }
    teams.value.push(team)
    return team
  }

  function addMemberToTeam(teamId: string, residentId: string): boolean {
    const team = getTeam(teamId)
    const resident = populationStore.getResident(residentId)

    if (!team || !resident || resident.status !== 'idle') {
      return false
    }

    team.members.push(residentId)
    return true
  }

  function removeMemberFromTeam(teamId: string, residentId: string): boolean {
    const team = getTeam(teamId)
    if (!team) return false

    const index = team.members.indexOf(residentId)
    if (index === -1) return false

    team.members.splice(index, 1)
    return true
  }

  function calculateTeamPower(teamId: string): number {
    const team = getTeam(teamId)
    if (!team) return 0

    return team.members.reduce((total, memberId) => {
      const resident = populationStore.getResident(memberId)
      if (!resident) return total

      return (
        total +
        resident.attack * 2 +
        resident.defense +
        resident.health / 10
      )
    }, 0)
  }

  function canStartExploration(teamId: string, levelId: string): boolean {
    const team = getTeam(teamId)
    const level = getLevel(levelId)

    if (!team || !level || team.status !== 'idle' || team.members.length === 0) {
      return false
    }

    // 检查体力
    for (const memberId of team.members) {
      const resident = populationStore.getResident(memberId)
      if (!resident || resident.stamina < level.staminaCost) {
        return false
      }
    }

    return true
  }

  function startExploration(teamId: string, levelId: string): boolean {
    if (!canStartExploration(teamId, levelId)) return false

    const team = getTeam(teamId)!
    const level = getLevel(levelId)!

    // 消耗体力
    for (const memberId of team.members) {
      populationStore.consumeStamina(memberId, level.staminaCost)
      populationStore.updateResidentStatus(memberId, 'adventuring', teamId)
    }

    team.status = 'exploring'
    team.currentLevelId = levelId
    currentLevel.value = level
    explorationProgress.value = 0

    return true
  }

  function completeExploration(teamId: string, success: boolean): boolean {
    const team = getTeam(teamId)
    if (!team || team.status !== 'exploring') return false

    const level = getLevel(team.currentLevelId!)
    if (!level) return false

    if (success) {
      // 获取奖励
      for (const [resource, amount] of Object.entries(level.rewards.resources)) {
        resourceStore.addResource(resource as RT, amount)
      }

      completedLevels.value.push(level.id)
      explorationResult.value = '探索成功！获得资源奖励。'
    } else {
      explorationResult.value = '探索失败，队伍被迫撤退。'
    }

    // 恢复居民状态
    for (const memberId of team.members) {
      populationStore.updateResidentStatus(memberId, 'idle')
    }

    team.status = 'idle'
    team.currentLevelId = undefined
    currentLevel.value = null

    return true
  }

  function simulateExploration(teamId: string): void {
    const team = getTeam(teamId)
    if (!team || team.status !== 'exploring') return

    const level = getLevel(team.currentLevelId!)
    if (!level) return

    const teamPower = calculateTeamPower(teamId)
    const successRate = Math.min(0.9, teamPower / (level.recommendedPower * 2))
    const success = Math.random() < successRate

    completeExploration(teamId, success)
  }

  function getAllLevels() {
    return ADVENTURE_LEVELS
  }

  function isLevelCompleted(levelId: string): boolean {
    return completedLevels.value.includes(levelId)
  }

  function resetAdventures() {
    teams.value = [
      {
        id: 'main_team',
        name: '主队',
        members: [],
        status: 'idle',
      },
    ]
    completedLevels.value = []
    currentLevel.value = null
    explorationProgress.value = 0
    explorationResult.value = null
  }

  return {
    // 状态
    teams,
    completedLevels,
    currentLevel,
    explorationProgress,
    explorationResult,

    // 计算属性
    availableLevels,
    idleTeams,
    exploringTeams,

    // 方法
    getLevel,
    getTeam,
    createTeam,
    addMemberToTeam,
    removeMemberFromTeam,
    calculateTeamPower,
    canStartExploration,
    startExploration,
    completeExploration,
    simulateExploration,
    getAllLevels,
    isLevelCompleted,
    resetAdventures,
  }
})
