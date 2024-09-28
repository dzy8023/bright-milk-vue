<template>
  <el-card>
    <div class="card-header">
      <span>订奶总览</span>
      <el-link :underline="false" href="/admin/orderMilk" class="detail-link">订奶管理</el-link>
    </div>
    <div class="data-grid1">
      <div class="left-right-data-card" v-for="(item, index) in orderMilkOverview" :key="index">
        <div class="data-title">
          <el-icon :size="20">
            <component :is="item.icon" />
          </el-icon>
          {{ item.title }}
        </div>
        <div class="data-value">{{ item.value }}</div>
      </div>
      <div class="add-button" @click="handleAdd">
        <el-icon :size="20" class="custom-icon">
          <plus />
        </el-icon>
        <div>新增</div>
      </div>
      <div class="left-right-data-card" v-for="(item, index) in orderMilkOverview" :key="index">
        <div class="data-title">
          <el-icon :size="20">
            <component :is="item.icon" />
          </el-icon>
          {{ item.title }}
        </div>
        <div class="data-value">{{ item.value }}</div>
      </div>
      <div class="add-button" @click="handleAdd">
        <el-icon :size="20" class="custom-icon">
          <plus />
        </el-icon>
        <div>新增</div>
      </div>
    </div>
  </el-card>
</template>
<script setup>
import { defineProps } from 'vue';
import { Plus } from '@element-plus/icons-vue';
import '@/styles/dashboard.scss';

const props = defineProps({
  currentDate: String,
  orderMilkOverview: Array
});

const handleAdd = () => {
  // 处理新增菜品的逻辑
  console.log('新增菜品');
};
</script>