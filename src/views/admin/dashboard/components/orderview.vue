<template>
      <el-card>
        <div class="card-header">
            <span>订单管理</span>
            <span class="date">{{ currentDate }}</span>
            <el-link :underline="false" href="/admin/orders" class="detail-link">订单明细</el-link>
        </div>
        <div class="data-grid">
            <div class="up-down-data-card" v-for="(item, index) in orderManagement" :key="index">
                <div class="data-title">
                    <el-icon :size="20">
                        <component :is="item.icon" />
                    </el-icon>
                    {{ item.title }}
                </div>
                <div class="data-value">{{ item.value }}</div>
            </div>
        </div>
    </el-card>
</template>

<script setup>
import { defineProps } from 'vue';
const props = defineProps({
    currentDate: String,
    orderManagement: Array
});
</script>
