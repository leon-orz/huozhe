import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { GameState } from '@/types'

export const useGameStore = defineStore('game', () => {
  // 游戏时间
  const gameTime = ref(0)
  const lastUpdate = ref(Date.now())
  const gameSpeed = ref(1)

  // 是否暂停
  const isPaused = ref(false)

  // 当前页面
  const currentPage = ref<'shelter' | 'adventure'>('shelter')

  // 计算属性
  const isPlaying = computed(() => !isPaused.value)

  // 方法
  function pauseGame() {
    isPaused.value = true
  }

  function resumeGame() {
    isPaused.value = false
    lastUpdate.value = Date.now()
  }

  function togglePause() {
    if (isPaused.value) {
      resumeGame()
    } else {
      pauseGame()
    }
  }

  function updateGameTime() {
    if (isPaused.value) return

    const now = Date.now()
    const delta = (now - lastUpdate.value) / 1000 // 转换为秒
    gameTime.value += delta * gameSpeed.value
    lastUpdate.value = now
  }

  function navigateTo(page: 'shelter' | 'adventure') {
    currentPage.value = page
  }

  function resetGame() {
    gameTime.value = 0
    lastUpdate.value = Date.now()
    isPaused.value = false
    currentPage.value = 'shelter'
  }

  return {
    // 状态
    gameTime,
    lastUpdate,
    gameSpeed,
    isPaused,
    currentPage,

    // 计算属性
    isPlaying,

    // 方法
    pauseGame,
    resumeGame,
    togglePause,
    updateGameTime,
    navigateTo,
    resetGame,
  }
})
