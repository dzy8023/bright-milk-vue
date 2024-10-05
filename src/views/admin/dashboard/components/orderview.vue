<template>        
        <div class="data-grid">
            <div class="up-down-data-card" v-for="(item, index) in orderManagement" :key="index">
                <div class="data-title">
                    <el-icon :size="20" >
                        <component :is="item.icon" />
                    </el-icon>
                    {{ item.title }}
                </div>
                <div class="data-value">{{ item.value }}</div>
            </div>
        </div>
</template>

<script setup>

const props = defineProps({
    orderManagement: Array
});


</script>
