<script setup lang='ts'>
import { useResourceStore } from '@/stores/resource'
import { useBuildingStore } from '@/stores/building'
import { usePopulationStore } from '@/stores/population'
import { computed } from 'vue'
import BuildingCard from '@/components/BuildingCard.vue'
import ResidentList from '@/components/ResidentList.vue'

const resourceStore = useResourceStore()
const buildingStore = useBuildingStore()
const populationStore = usePopulationStore()

// 建筑分类
const gatheringBuildings = ['wood_camp', 'stone_mine', 'water_well', 'iron_mine']
const productionBuildings = ['farm', 'workshop']
const livingBuildings = ['tent', 'house']
const specialBuildings = ['storage', 'lab']
</script>

<template>
  <div class='shelter-view'>
    <h2 class='section-title'>避难所</h2>

    <!-- 资源概览 -->
    <section class='section'>
      <h3 class='section-subtitle'>资源</h3>
      <div class='resource-grid'>
        <div class='resource-card' v-for='(amount, type) in resourceStore.resources' :key='type'>
          <div class='resource-card-name'>{{ resourceStore.getResourceName(type) }}</div>
          <div class='resource-card-amount'>{{ Math.floor(amount) }} / {{ resourceStore.maxStorage }}</div>
          <div class='resource-card-bar'>
            <div
              class='resource-card-fill'
              :style='{ width: (amount / resourceStore.maxStorage * 100) + "%" }'
            ></div>
          </div>
        </div>
      </div>
    </section>

    <!-- 人口管理 -->
    <section class='section'>
      <h3 class='section-subtitle'>
        人口 ({{ populationStore.population }} / {{ populationStore.maxPopulation }})
      </h3>
      <ResidentList />
    </section>

    <!-- 采集设施 -->
    <section class='section'>
      <h3 class='section-subtitle'>采集设施</h3>
      <div class='building-grid'>
        <BuildingCard
          v-for='buildingType in gatheringBuildings'
          :key='buildingType'
          :building-type='buildingType'
        />
      </div>
    </section>

    <!-- 生产设施 -->
    <section class='section'>
      <h3 class='section-subtitle'>生产设施</h3>
      <div class='building-grid'>
        <BuildingCard
          v-for='buildingType in productionBuildings'
          :key='buildingType'
          :building-type='buildingType'
        />
      </div>
    </section>

    <!-- 居住设施 -->
    <section class='section'>
      <h3 class='section-subtitle'>居住设施</h3>
      <div class='building-grid'>
        <BuildingCard
          v-for='buildingType in livingBuildings'
          :key='buildingType'
          :building-type='buildingType'
        />
      </div>
    </section>

    <!-- 特殊设施 -->
    <section class='section'>
      <h3 class='section-subtitle'>特殊设施</h3>
      <div class='building-grid'>
        <BuildingCard
          v-for='buildingType in specialBuildings'
          :key='buildingType'
          :building-type='buildingType'
        />
      </div>
    </section>
  </div>
</template>

<style scoped>
.shelter-view {
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

.resource-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 15px;
}

.resource-card {
  background: #0f3460;
  border-radius: 8px;
  padding: 12px;
}

.resource-card-name {
  font-size: 14px;
  color: #aaa;
  margin-bottom: 5px;
}

.resource-card-amount {
  font-size: 18px;
  font-weight: bold;
  color: #4cc9f0;
  margin-bottom: 8px;
}

.resource-card-bar {
  height: 8px;
  background: #1a1a2e;
  border-radius: 4px;
  overflow: hidden;
}

.resource-card-fill {
  height: 100%;
  background: linear-gradient(90deg, #4cc9f0, #4361ee);
  transition: width 0.3s;
}

.building-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 15px;
}
</style>
