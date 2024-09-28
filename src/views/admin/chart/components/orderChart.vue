<template>
    <el-card>
        <template #header>订单统计</template>
        <div ref="orderChart" class="chart"></div>
    </el-card>
</template>

<script setup>
import { ref, onMounted,watch } from 'vue';
import * as echarts from 'echarts';

const props = defineProps({
    orderOverviewData: {
        type: Array,
        required: true
    }
});
const orderChart = ref(null);
const color = ['#5c7bd9', '#9fe080', '#ffdc60'];
const data = props.orderOverviewData.map((item, index) => {
    return {
        value: item.value,
        name: item.name,
        itemStyle: {
            color: color[index],
            borderWidth: 5,
            shadowBlur: 20,
            borderColor: color[index],
            shadowColor: color[index],
        }
    }
});
const initOrderChart = () => {
    if (orderChart.value) {
    echarts.dispose(orderChart.value); // 销毁已有的图表实例
  }
    const chart = echarts.init(orderChart.value);
    const option = {
        color: color,
        title: {
            text: '订单统计'
        },
        tooltip: {
            trigger: 'item',
            formatter: '<i style="display: inline-block;width:10px;height:10px;border-radius: 50%; background-color:;margin-right: 5px;"></i>{b}<br/><i>{c}</i>  ({d}%)'
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            top: 'middle',
            textStyle: {
                color: '#333'
            }
        },
        series: [{
            type: 'pie',
            data: data,
            radius: '70%',
            center: ['50%', '50%'],
            label: {
                show: true,
                formatter: '{b}: {c}'
            }
        }]
    };
    chart.setOption(option);
};
watch(() => props.orderOverviewData, () => {
    initOrderChart();
});
onMounted(() => {
    initOrderChart();

});
</script>
