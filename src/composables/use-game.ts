import { ref, computed } from 'vue'
import type { GameState, GameScene, GameConfig } from '@/types/game'
import { DEFAULT_CONFIG } from '@/config/game-config'

/**
 * 游戏核心逻辑
 */
export function useGame(config: GameConfig = DEFAULT_CONFIG) {
  const state = ref<GameState>({
    currentSceneId: config.initialSceneId,
    playerAttributes: {
      health: 100,
      maxHealth: 100,
      attack: 10,
      defense: 5,
      level: 1,
      experience: 0,
      ...config.initialAttributes
    },
    inventory: [],
    history: [],
    flags: {}
  })

  const currentScene = computed<GameScene | null>(() => {
    return config.scenes[state.value.currentSceneId] || null
  })

  /**
   * 切换到指定场景
   */
  const goToScene = (sceneId: string) => {
    const scene = config.scenes[sceneId]
    if (!scene) return

    state.value.history.push(state.value.currentSceneId)
    state.value.currentSceneId = sceneId

    if (scene.onEnter) {
      scene.onEnter()
    }
  }

  /**
   * 选择场景选项
   */
  const selectChoice = (choiceId: string) => {
    const scene = currentScene.value
    if (!scene) return

    const choice = scene.choices.find((c) => c.id === choiceId)
    if (!choice) return

    if (choice.condition && !choice.condition()) {
      return
    }

    goToScene(choice.nextSceneId)
  }

  /**
   * 重置游戏
   */
  const resetGame = () => {
    state.value = {
      currentSceneId: config.initialSceneId,
      playerAttributes: {
        health: 100,
        maxHealth: 100,
        attack: 10,
        defense: 5,
        level: 1,
        experience: 0,
        ...config.initialAttributes
      },
      inventory: [],
      history: [],
      flags: {}
    }
  }

  return {
    state,
    currentScene,
    goToScene,
    selectChoice,
    resetGame
  }
}
