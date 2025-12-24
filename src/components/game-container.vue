<script setup lang="ts">
import { useGame } from '@/composables/use-game'
import { DEFAULT_CONFIG } from '@/config/game-config'
import type { SceneChoice } from '@/types/game'

const { state, currentScene, selectChoice, resetGame } = useGame(DEFAULT_CONFIG)

/**
 * 处理玩家选择
 */
function handleChoice(choice: SceneChoice) {
  selectChoice(choice.id)
}
</script>

<template>
  <div class="game-container">
    <header class="game-header">
      <h1 class="game-title">火种</h1>
      <div class="player-stats">
        <span class="stat">生命: {{ state.playerAttributes.health }}/{{ state.playerAttributes.maxHealth }}</span>
        <span class="stat">攻击: {{ state.playerAttributes.attack }}</span>
        <span class="stat">等级: {{ state.playerAttributes.level }}</span>
      </div>
    </header>

    <main class="game-main">
      <div v-if="currentScene" class="scene">
        <div class="scene-description">
          {{ currentScene.description }}
        </div>

        <div class="choices">
          <button
            v-for="choice in currentScene.choices"
            :key="choice.id"
            class="choice-button"
            :disabled="choice.condition && !choice.condition()"
            @click="handleChoice(choice)"
          >
            {{ choice.text }}
          </button>
        </div>
      </div>

      <div v-else class="error">
        <p>场景未找到: {{ state.currentSceneId }}</p>
        <button class="reset-button" @click="resetGame">重新开始</button>
      </div>
    </main>

    <footer class="game-footer">
      <button class="reset-button" @click="resetGame">重新开始</button>
    </footer>
  </div>
</template>

<style scoped>
.game-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
}

.game-header {
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #333;
}

.game-title {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: #ff6b35;
}

.player-stats {
  display: flex;
  gap: 1.5rem;
  font-size: 0.9rem;
  color: #888;
}

.stat {
  padding: 0.25rem 0.75rem;
  background: #2a2a2a;
  border-radius: 4px;
}

.game-main {
  flex: 1;
  overflow-y: auto;
}

.scene {
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.scene-description {
  font-size: 1.1rem;
  line-height: 1.8;
  margin-bottom: 2rem;
  white-space: pre-line;
  color: #d0d0d0;
}

.choices {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.choice-button {
  padding: 1rem 1.5rem;
  font-size: 1rem;
  background: #2a2a2a;
  border: 1px solid #444;
  border-radius: 8px;
  color: #e0e0e0;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
}

.choice-button:hover:not(:disabled) {
  background: #3a3a3a;
  border-color: #ff6b35;
  transform: translateX(4px);
}

.choice-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.error {
  text-align: center;
  padding: 2rem;
  color: #ff6b6b;
}

.game-footer {
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #333;
  display: flex;
  justify-content: center;
}

.reset-button {
  padding: 0.5rem 1.5rem;
  font-size: 0.9rem;
  background: transparent;
  border: 1px solid #444;
  border-radius: 4px;
  color: #888;
  cursor: pointer;
  transition: all 0.2s ease;
}

.reset-button:hover {
  border-color: #ff6b35;
  color: #ff6b35;
}
</style>
