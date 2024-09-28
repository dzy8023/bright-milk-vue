<template>
  <el-card>
    <template #header>营业额统计</template>
    <div ref="revenueChart" class="chart"></div>
  </el-card>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import * as echarts from 'echarts';

const props = defineProps({
  revenueData: {
    type: Array,
    required: true,
    default: () => []
  },
  dateRange: {
    type: Array,
    required: true,
    default: () => []
  }
});
const revenueChart = ref(null);

const initData = () => {
  let data = []
  props.dateRange.forEach((item, index) => {
    const revenue = props.revenueData.find(revenue => revenue.date === item);
    data[index] = revenue ? revenue.amount : 0
  })
  return data
}
const initRevenueChart = () => {
  if (revenueChart.value) {
    echarts.dispose(revenueChart.value); // 销毁已有的图表实例
  }
  const chart = echarts.init(revenueChart.value);
  const data = initData()
  const option = {
    title: {
      text: '营业额统计'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'line',
      lineStyle: {
        color: '#ffc200',
        width: 1.5,
        shadowColor: 'rgba(255, 242, 105, 0.8)',
        shadowBlur: 10
      }
    }
  },
    legend: {
      orient: 'vertical',
      left: 'right',
      top: 'top',
      textStyle: {
        color: '#333'
      }
    },
    xAxis: {
      type: 'category',
      data: props.dateRange,
      axisTick: {
        alignWithLabel: true
      }
    },
    yAxis: {
      type: 'value',
      axisTick: {
        show: false
      },
      axisLine: {
        lineStyle: {
          color: '#57617B'
        }
      },
    },
    series: [{
      name: '营业额',
      data: data,
      type: 'line',
      itemStyle: {
        color: '#fd7f7f',
      },
      emphasis: {
        itemStyle: {
          color: '#ffe400',
          borderWidth: 5,
          borderColor: '#fd7f7f',
        }
      },
      symbolSize: data.length > 10 ? 0 : 10, //圆点大小
    }, {
    name: '营业额',
    data: data,
    showBackground: true,
    label: {
      show: true,
      position: 'top',
      color: '#333'
      },
    type: 'bar'
    }]
  };
chart.setOption(option);
};
onMounted(() => {
  initRevenueChart();
});
watch([() => props.revenueData], () => {
  initRevenueChart();
});
</script>
