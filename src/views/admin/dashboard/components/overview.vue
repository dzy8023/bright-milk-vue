<template>
  <div class="data-grid data-item-grid">
    <div class="up-down-data-card" v-for="(item, index) in todayData" :key="index">
      <div class="data-title">{{ item.title }}</div>
      <div class="data-value">{{ item.value }}</div>
    </div>
  </div>
</template>

<script setup>

const props = defineProps({
  todayData: Array
});




</script>
