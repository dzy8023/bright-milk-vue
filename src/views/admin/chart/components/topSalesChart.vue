<template>
  <el-card>
    <template #header>销量排名TOP10</template>
    <div ref="topSalesChart" class="chart"></div>
  </el-card>
  <el-dialog top="2%" :destroy-on-close="true" :draggable="true" title="商品详情" v-model="dialogVisible"
    width="40%" :before-close="handleClose" center>
    <el-scrollbar max-height="460px">
      <milkSaleDetail :data="milk" />
    </el-scrollbar>
    <template #footer>
      <el-button type="primary" size="large" @click="dialogVisible = false">关闭</el-button>
      <el-button type="primary" size="large" @click="handleEdit">编辑</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import * as echarts from 'echarts';
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router';
import milkSaleDetail from './milkSaleDetail.vue';
const router = useRouter();
const props = defineProps({
  topSalesData: {
    type: Array,
    required: true
  },
  dateRange: {
    type: Array,
    required: true
  }
});
const topSalesChart = ref(null);
const dialogVisible = ref(false);
const milk = ref(null);
const handleClose = () => {
  dialogVisible.value = false;
};
const handleEdit = () => {
  ElMessage.success('编辑成功');
  router.push({
    path: '/admin/milk/add',
    query: { id: milk.value.milkId }
  })
};

const initTopSalesChart = () => {
  if (topSalesChart.value) {
    echarts.dispose(topSalesChart.value); // 销毁已有的图表实例
  }
  const chart = echarts.init(topSalesChart.value);
  const option = {
    grid: {
      height: props.topSalesData.length < 5 ? `${props.topSalesData.length * 12}%` : '90%',
      // top: '10%', // 设置上边距
      top: 'middle',// 设置下边距
      left: '3%',
      right: '4%',
      containLabel: true
    },
    tooltip: {
      trigger: props.topSalesData.length>0?'axis': 'none',
      axisPointer: {
        type: 'shadow'
      },
      formatter: function (params) {
        return params.map(function (item) {
          // 插入图片，布局为左侧为图片，右侧为文字内容
          return `<div style="display: flex; align-items: center;">
                    <img src="${item.value.image}" style="width: 60px; height: 60px; margin-right: 10px;" />
                    <span>${item.marker}${item.name}<br/>销量: ${item.value.number}</span>
                  </div>`;
        }).join('<br/>');
      }
    },
    legend: {},
    title: {
      text: '销量排名TOP10'
    },
    dataset: {
      source: props.topSalesData.length > 0 ? props.topSalesData : [{ name: "无数据", number: 0 }] // 添加默认数据
    },
    visualMap: {
      orient: 'horizontal',
      left: 'center',
      //判断是否有这个属性
      min: props.topSalesData.length > 0 && props.topSalesData[0].number ? props.topSalesData[0].number : 0,
      max: props.topSalesData.length > 0 && props.topSalesData[props.topSalesData.length - 1].number ? props.topSalesData[props.topSalesData.length - 1].number : 0,
      text: ['High Score', 'Low Score'],
      // Map the score column to color
      dimension: 'number',
      inRange: {
        color: ['#65B581', '#FFCE34', '#FD665F']
      }
    },
    xAxis: {
      axisLabel: { interval: 0, rotate: 30 },
      axisTick: {
        alignWithLabel: true
      },
    },
    yAxis: {
      type: 'category',
      // 添加点击事件
      triggerEvent: true,
    },
    series: {
      color: '#698dc8',
      type: 'bar',
      encode: { y: 'name', x: 'number' },
      itemStyle: {
        borderRadius: [0, 10, 10, 0],
      }
    }
  };
  chart.setOption(option);
  if (props.topSalesData.length > 0) { // 仅当有数据时注册事件

    chart.on('click', function (params) {
      if (params.componentType == "xAxis" || params.componentType == "yAxis") {
        props.topSalesData.forEach(item => {
          if (item.name === params.value) {
            ElMessage.info(`商品名称：${item.name}，商品ID：${item.milkId}`);
            milk.value = { ...item, term: props.dateRange };
            dialogVisible.value = true;
          }
        })
      } else {
        ElMessage.info(`商品名称：${params.name}，商品销量：${params.data.number}`);
      }
    });

    chart.on('mouseover', params => {
      if (params.componentType == "yAxis") {
        const yAxisItem = {
          value: params.value,
          textStyle: {
            color: '#2f6cfd',
            fontWeight: 'bold',
            fontSize: 13,
          }
        }
        let ydata = props.topSalesData.map(item => {
          return item.name === params.value ? yAxisItem : item.name; // 添加 return 语句
        });
        option.yAxis.data = ydata
        chart.setOption(option)
      }
    });

    chart.on('mouseout', params => {
      if (params.componentType == "yAxis") {
        let ydata = props.topSalesData.map(item => item.name);
        option.yAxis.data = ydata
        chart.setOption(option)
      }
    });
  }
};
watch(() => props.topSalesData, () => {
  initTopSalesChart();
});

onMounted(() => {
  initTopSalesChart();
});
</script>
