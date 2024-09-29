<template>
  <el-descriptions :column="2" :border="true">
    <el-descriptions-item :rowspan="3" >
      <el-image  :src="data.image" />
    </el-descriptions-item>
    <el-descriptions-item label="牛奶名称:"> {{ data.name }} </el-descriptions-item>
    <el-descriptions-item label="分类类型:">低温奶</el-descriptions-item>
    <el-descriptions-item label="牛奶分类:">乳酸菌牛奶</el-descriptions-item>
    <el-descriptions-item label="牛奶价格:">5.6</el-descriptions-item>
    <el-descriptions-item label="包装类型:">杯装</el-descriptions-item>
    <el-descriptions-item label="规格(ml):">180</el-descriptions-item>
    <el-descriptions-item :label="saleLabel"><el-tag size="small">{{ data.number }}</el-tag></el-descriptions-item>
    <el-descriptions-item label="选择日期" :span="2">
      <div class="block">
        <el-date-picker v-model="date" type="daterange" unlink-panels range-separator="To"
          start-placeholder="Start date" end-placeholder="End date" :shortcuts="shortcuts" size="small"
          format="YYYY-MM-DD" value-format="YYYY-MM-DD" />
        <el-button text type="primary" size="small" @click="handleQuery">查询</el-button>
      </div>
    </el-descriptions-item>
    <el-descriptions-item label="牛奶描述:">牛牛牛呢家那位百度网盘，点击是哪位我都为你废话呢你发我就发你好我把覅胡法人卡非人非恶魔聚合凤凰男车标弗恩看你好，我是你们的管理员，欢迎你们光临！</el-descriptions-item>
  </el-descriptions>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { ElMessage } from 'element-plus'

const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  }
})
const data = ref(props.data)
const saleLabel = ref('销量:')
const date = ref('')
const handleQuery = () => {
  ElMessage.success('查询成功')
  console.log(date.value)
  shortcuts.push({
    text: date.value[0].slice(5) + '~' + date.value[1].slice(5),
    value: () => {
      return [new Date(date.value[0]), new Date(date.value[1])]
    },
  })
}
const shortcuts = [
  {
    text: 'Last week',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    },
  },
  {
    text: 'Last month',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    },
  },
  {
    text: 'Last 3 months',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      return [start, end]
    },
  },
]
onMounted(() => {
  const term = []
  data.value.term.forEach(element => {
    //取字符串后5位
    term.push(element.toISOString().split('T')[0])
  });
  console.log(term)
  date.value = term
  saleLabel.value = `销量(${term[0].slice(5)}~${term[1].slice(5)}):`
  shortcuts.push({
    text: term[0].slice(5) + '~' + term[1].slice(5),
    value: () => {
      return [new Date(term[0]), new Date(term[1])]
    },
  })
})




</script>
<style scoped lang="scss">

.demo-date-picker {
  display: flex;
  width: 100%;
  padding: 0;
  flex-wrap: wrap;
}

.demo-date-picker .block {
  padding: 30px 0;
  text-align: center;
  border-right: solid 1px var(--el-border-color);
  flex: 1;
}

.demo-date-picker .block:last-child {
  border-right: none;
}
</style>