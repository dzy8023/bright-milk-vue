<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="24">
        <div class="card-header">
          <el-button-group class="button-group">
            <el-button :type="selectedButton === '昨日' ? 'primary' : 'default'"
              @click="selectButton('昨日')">昨日</el-button>
            <el-button :type="selectedButton === '近7日' ? 'primary' : 'default'"
              @click="selectButton('近7日')">近7日</el-button>
            <el-button :type="selectedButton === '近30日' ? 'primary' : 'default'"
              @click="selectButton('近30日')">近30日</el-button>
            <el-button :type="selectedButton === '本周' ? 'primary' : 'default'"
              @click="selectButton('本周')">本周</el-button>
            <el-button :type="selectedButton === '本月' ? 'primary' : 'default'"
              @click="selectButton('本月')">本月</el-button>
          </el-button-group>
          <span class="date">已选时间: {{ selectedDateRange }}</span>
          <el-button type="default" class="export-button" @click="dialogVisible = true"
            :icon="Download">数据导出</el-button>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="section">
      <el-col :span="12">
        <RevenueChart :revenueData="revenueData" :dateRange="dateRange" />
      </el-col>
      <el-col :span="12">
        <UserChart :userData="userData" :dateRange="dateRange" />
      </el-col>
    </el-row>
    <el-row :gutter="20" class="section">
      <el-col :span="12">
        <OrderChart :orderOverviewData="orderOverviewData" />
      </el-col>
      <el-col :span="12">
        <TopSalesChart :topSalesData="topSalesData" :dateRange="[startDate, endDate]" />
      </el-col>
    </el-row>
  </div>
  <el-dialog title="数据导出" v-model="dialogVisible" width="30%" height="20%" center>
    <el-checkbox v-model="checkAll" :indeterminate="indeterminate" @change="handleCheckAll">全选</el-checkbox>
    <el-checkbox-group v-model="checkedList" @change="handleCheckedList">
      <el-checkbox v-for="item in charts" :label="item.name" :key="item.id" :value="item.id">{{ item.name
        }}</el-checkbox>
    </el-checkbox-group>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleExport" :disabled="checkedList.length === 0">导出</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { Download } from '@element-plus/icons-vue';
import '@/styles/dashboard.scss';
import RevenueChart from './components/revenueChart.vue';
import UserChart from './components/userChart.vue';
import OrderChart from './components/orderChart.vue';
import TopSalesChart from './components/topSalesChart.vue';
import { getChartData, exportChartData } from '@/api/chart';
import { ElMessage } from 'element-plus';

const selectedDateRange = ref(null)
const startDate = ref(null)
const endDate = ref(null)
const selectedButton = ref(null); // 默认选中“近7日”按钮
const dateRange = ref([])

const charts = [
  { id: 1, name: '营业额数据' },
  { id: 2, name: '新增用户数据' },
  { id: 3, name: '订单数据' },
  { id: 4, name: '销量数据' }
]
const dialogVisible = ref(false)
const checkAll = ref(false)
const indeterminate = ref(false)
const checkedList = ref([])

const handleCheckAll = (val) => {
  checkedList.value = val ? charts.map(item => item.id) : []
  indeterminate.value = false
}

const handleCheckedList = (val) => {
  indeterminate.value = val.length > 0 && val.length < charts.length
  checkAll.value = val.length === charts.length
}
const handleExport = async () => {
  const params = {
    dateRange: { begin: startDate.value.toISOString().split('T')[0], end: endDate.value.toISOString().split('T')[0] },
    type: checkedList.value.join(',')
  }
  exportChartData(params).then(response => {
    if (response.data) {
      const blob = new Blob([response.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      // 兼容不同浏览器的URL对象
      const url = window.URL || window.webkitURL || window.moxURL;
      const href = url.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = href;
      // 获取响应头中的 content-disposition，获取文件名，处理中文名编码问题
      const contentDisposition = response.headers['content-disposition'];
      const fileName = contentDisposition.split('filename=')[1].split(';')[0]; // 修改此行
      const decodedFileName = decodeURIComponent(fileName); 
      a.download = decodedFileName; 
      document.body.appendChild(a); 
      a.click();
      URL.revokeObjectURL(a.href);
      document.body.removeChild(a);
      ElMessage.success('导出成功')
    } else {
      ElMessage.error('导出失败')
    }
  });
  dialogVisible.value = false;
}

onMounted(() => {
  nextTick(() => {
    selectButton('近7日')
  })
})
const init = async () => {
  const params = {
    begin: startDate.value.toISOString().split('T')[0],
    end: endDate.value.toISOString().split('T')[0]
  }
  try {
    const res = await getChartData(params);
    let data = []
    res.data.revenueData.forEach(item => {
      data.push({ date: item.date, amount: item.turnover })
    });
    revenueData.value = data
    data = []
    res.data.newUserData.forEach(item => {
      data.push({ date: item.date, newUser: item.newUser })
    });
    userData.value = {
      totalUsers: res.data.totalUserData,
      newUsers: data
    }
    data = []
    res.data.orderData.forEach(item => {
      data.push({ name: item.status, value: item.count })
    });
    orderOverviewData.value = data
    topSalesData.value = res.data.saleData
  } catch (error) {
    console.error("获取数据失败:", error); // 添加错误处理
  }
}
const selectButton = async (button) => {
  const now = new Date()
  let start, end;
  selectedButton.value = button;
  if (button === '昨日') {
    // 昨日
    start = new Date(now);
    start.setDate(now.getDate() - 1);
    end = new Date(start);
  } else if (button === '近7日') {
    // 近7日
    start = new Date(now);
    start.setDate(now.getDate() - 7);
    end = new Date(now);
    end.setDate(now.getDate() - 1)
  } else if (button === '近30日') {
    // 近30日
    start = new Date(now);
    start.setDate(now.getDate() - 30);
    end = new Date(now);
    end.setDate(now.getDate() - 1)
  } else if (button === '本周') {
    // 本周
    start = new Date(now);
    start.setDate(now.getDate() - 6 + (7 - now.getDay()) % 7);
    end = new Date(now);
    end.setDate(now.getDate() + (7 - now.getDay()) % 7);
  } else if (button === '本月') {
    // 本月
    start = new Date(now.getFullYear(), now.getMonth(), 2);
    end = new Date(now.getFullYear(), now.getMonth() + 1);
  }
  startDate.value = start;
  endDate.value = end;
  selectedDateRange.value = `${start.toISOString().split('T')[0]} 至 ${end.toISOString().split('T')[0]}`
  dateRange.value = getDateRange(start, end)
  init()
};
const getDateRange = (start, end) => {
  const range = [];
  const current = new Date(start);
  while (current <= end) {
    range.push(new Date(current).toISOString().split('T')[0]);
    current.setDate(current.getDate() + 1);
  }
  return range;
};

const revenueData = ref([
  { date: '2024-09-19', amount: 18.9 },
  { date: '2024-09-20', amount: 22.5 },
  { date: '2024-09-21', amount: 47.5 }
]);
const userData = ref({
  totalUsers: 5,
  newUsers: [
    { date: '2024-09-19', newUsers: 2 },
    { date: '2024-09-20', newUsers: 3 },
    { date: '2024-09-21', newUser: 1 }]
})

const orderOverviewData = ref([
  { name: '订单完成率', value: 1048 },
  { name: '有效订单', value: 735 },
  { name: '订单总数', value: 581 }
]);
const topSalesData = ref([
  { milkId: 72, name: '新鲜牧场', image: 'http://127.0.0.1:9000/bright-milk/702b9f58-51f0-447b-8329-485bac6a55c7.jpg', number: 2 },
  { milkId: 73, name: '莫斯利安', image: 'http://127.0.0.1:9000/bright-milk/20c0919e-1e9b-4281-bd7b-a52b623cd78a.jpg', number: 4 },
  { milkId: 70, name: '如实', image: 'http://127.0.0.1:9000/bright-milk/d5efde2a-e04d-4a6c-b865-d7e9a0a86e1b.jpg', number: 8 }

]);
</script>
