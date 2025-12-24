<script setup lang='ts'>
import { useAdventureStore } from '@/stores/adventure'
import { usePopulationStore } from '@/stores/population'
import { computed } from 'vue'
import LevelCard from '@/components/LevelCard.vue'
import TeamList from '@/components/TeamList.vue'

const adventureStore = useAdventureStore()
const populationStore = usePopulationStore()

const levels = computed(() => adventureStore.availableLevels)
</script>

<template>
  <div class='adventure-view'>
    <h2 class='section-title'>冒险</h2>

    <!-- 探险小队 -->
    <section class='section'>
      <h3 class='section-subtitle'>探险小队</h3>
      <TeamList />
    </section>

    <!-- 冒险关卡 -->
    <section class='section'>
      <h3 class='section-subtitle'>关卡</h3>
      <div class='level-grid'>
        <LevelCard
          v-for='level in levels'
          :key='level.id'
          :level='level'
        />
      </div>
    </section>

    <!-- 探索结果 -->
    <section v-if='adventureStore.explorationResult' class='section result'>
      <h3 class='section-subtitle'>探索结果</h3>
      <p class='result-text'>{{ adventureStore.explorationResult }}</p>
    </section>
  </div>
</template>

<style scoped>
.adventure-view {
  max-width: 1200px;
  margin: 0 auto;
}

.section-title {
  font-size: 28px;
  margin-bottom: 20px;
  color: #e94560;
}

.section {
  background: #16213e;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
}

.section-subtitle {
  font-size: 18px;
  margin-bottom: 15px;
  color: #4cc9f0;
}

.level-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 15px;
}

.result {
  border: 2px solid #4cc9f0;
}

.result-text {
  font-size: 16px;
  color: #4cc9f0;
  padding: 10px;
  background: #0f3460;
  border-radius: 8px;
}
</style>
