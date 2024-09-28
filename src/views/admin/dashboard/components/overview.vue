<template>
   <el-card>
          <div class="card-header">
            <span >今日数据</span>
            <span class="date">{{ currentDate }}</span>
            <el-link :underline="false" href="/admin/statistics" class="detail-link">详细数据</el-link>
          </div>
          <div class="data-grid data-item-grid">
            <div class="up-down-data-card" v-for="(item, index) in todayData" :key="index">
              <div class="data-title">{{ item.title }}</div>
              <div class="data-value">{{ item.value }}</div>
            </div>
          </div>
        </el-card>
</template>

<script setup>
import { defineProps } from 'vue';
const props = defineProps({
    currentDate: String,
    todayData: Array
});
</script>

