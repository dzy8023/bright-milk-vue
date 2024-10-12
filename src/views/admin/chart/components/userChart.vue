<template>
    <el-card>
        <template #header>用户统计</template>
        <div ref="userChart" class="chart"></div>
    </el-card>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import * as echarts from 'echarts';

const props = defineProps({
    userData: {
        type: Object,
        required: true
    },
    dateRange: {
        type: Array,
        required: true
    }
});
const userChart = ref(null);
const initData = () => {
    let totalUsers = []
    let newUsers = []
    let temp = props.userData.totalUsers
        props.dateRange.forEach((item, index) => {
        const user = props.userData.newUsers.find(user => user.date === item);
        newUsers[index] = user ? user.newUser : 0
        temp += newUsers[index]
        totalUsers[index] = temp
    })
    return { totalUsers, newUsers }
}
const initUserChart = () => {
    if (userChart.value) {
        echarts.dispose(userChart.value); // 销毁已有的图表实例
    }
    const chart = echarts.init(userChart.value);
    const data = initData()
    const option = {
        title: {
            text: '用户统计'
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
            type: 'value'
        },
        series: [{
            name: '用户总量',
            data: data.totalUsers,
            type: 'line',
            emphasis: {
                color: '#5c7bd9',
                itemStyle: {
                    // 圆点颜色
                    color: '#ffe400',
                    borderWidth: 5,
                    borderColor: '#5c7bd9',
                },
            },
            symbolSize: data.totalUsers.length > 10 ? 0 : 10, //圆点大小
        }, {
            name: '新增用户',
            data: data.newUsers,
            type: 'line',
            emphasis: {
                color: '#FD7F7F',
                itemStyle: {
                    // 圆点颜色
                    color: '#ffe400',
                    borderWidth: 5,
                    borderColor: '#FD7F7F',
                },
            },
            symbolSize: data.newUsers.length > 10 ? 0 : 10, //圆点大小
        }]
    };
    chart.setOption(option);
};
onMounted(() => {
    initUserChart()
});
watch(() => props.userData, () => {
    initUserChart()
});

</script>
