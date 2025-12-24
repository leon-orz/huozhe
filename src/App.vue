<script setup lang='ts'>
import { onMounted, onUnmounted } from 'vue'
import { useGameStore } from '@/stores/game'
import { useResourceStore } from '@/stores/resource'
import { useBuildingStore } from '@/stores/building'
import ShelterView from '@/views/ShelterView.vue'
import AdventureView from '@/views/AdventureView.vue'

const gameStore = useGameStore()
const resourceStore = useResourceStore()
const buildingStore = useBuildingStore()

let gameInterval: number | null = null

// 游戏循环
function gameLoop() {
  if (gameStore.isPaused) return

  gameStore.updateGameTime()

  // 更新建筑生产（每秒）
  buildingStore.updateProduction(1)
}

onMounted(() => {
  // 启动游戏循环（每秒执行一次）
  gameInterval = setInterval(gameLoop, 1000) as unknown as number
})

onUnmounted(() => {
  if (gameInterval) {
    clearInterval(gameInterval)
  }
})
</script>

<template>
  <div class='app'>
    <!-- 顶部状态栏 -->
    <header class='header'>
      <div class='header-title'>活着</div>
      <div class='header-resources'>
        <div class='resource-item' v-for='(amount, type) in resourceStore.resources' :key='type'>
          <span class='resource-name'>{{ resourceStore.getResourceName(type) }}:</span>
          <span class='resource-amount'>{{ Math.floor(amount) }}</span>
        </div>
      </div>
      <div class='header-info'>
        <span>人口: {{ resourceStore.population }}/{{ resourceStore.maxPopulation }}</span>
        <span>存储: {{ Math.floor(resourceStore.storageUsed) }}/{{ resourceStore.maxStorage }}</span>
      </div>
    </header>

    <!-- 主内容区域 -->
    <main class='main'>
      <ShelterView v-if='gameStore.currentPage === "shelter"' />
      <AdventureView v-if='gameStore.currentPage === "adventure"' />
    </main>

    <!-- 底部导航 -->
    <nav class='nav'>
      <button
        class='nav-button'
        :class='{ active: gameStore.currentPage === "shelter" }'
        @click='gameStore.navigateTo("shelter")'
      >
        避难所
      </button>
      <button
        class='nav-button'
        :class='{ active: gameStore.currentPage === "adventure" }'
        @click='gameStore.navigateTo("adventure")'
      >
        冒险
      </button>
    </nav>
  </div>
</template>

<style scoped>
.app {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #1a1a2e;
  color: #eee;
}

.header {
  background: #16213e;
  padding: 15px 20px;
  border-bottom: 2px solid #0f3460;
}

.header-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #e94560;
}

.header-resources {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 8px;
}

.resource-item {
  display: flex;
  gap: 5px;
  font-size: 14px;
}

.resource-name {
  color: #aaa;
}

.resource-amount {
  color: #4cc9f0;
  font-weight: bold;
}

.header-info {
  display: flex;
  gap: 15px;
  font-size: 13px;
  color: #aaa;
}

.main {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.nav {
  background: #16213e;
  border-top: 2px solid #0f3460;
  display: flex;
  justify-content: center;
  gap: 20px;
  padding: 10px;
}

.nav-button {
  padding: 12px 30px;
  font-size: 16px;
  background: #0f3460;
  color: #eee;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.nav-button:hover {
  background: #1a4a7a;
}

.nav-button.active {
  background: #e94560;
  font-weight: bold;
}
</style>
