<template>
  <el-descriptions :column="2" :border="true">
    <el-descriptions-item :rowspan="4">
      <el-image :src="data.image" />
    </el-descriptions-item>
    <el-descriptions-item label="牛奶名称:"> {{ data.name }} </el-descriptions-item>
    <el-descriptions-item label="分类类型:">{{ data.typeName }}</el-descriptions-item>
    <el-descriptions-item label="牛奶分类:">{{ data.categoryName }}</el-descriptions-item>
    <el-descriptions-item label="包装类型:">{{ data.packName }}</el-descriptions-item>
    <el-descriptions-item label="牛奶库存:">{{ data.amount }}</el-descriptions-item>
    <el-descriptions-item label="牛奶价格:">{{ data.price }}</el-descriptions-item>
    <el-descriptions-item label="规格(ml):">{{ data.standard }}</el-descriptions-item>
    <el-descriptions-item :label="saleLabel">
      <el-tag type="primary" effect="light">
        {{ data.number }}</el-tag>
    </el-descriptions-item>
    <el-descriptions-item label="选择日期" :span="2">
      <div class="block">
        <el-date-picker v-model="date" type="daterange" unlink-panels range-separator="To"
          start-placeholder="Start date" end-placeholder="End date" :shortcuts="shortcuts" size="small"
          format="YYYY-MM-DD" value-format="YYYY-MM-DD" />
        <el-button text type="primary" @click="handleQuery">查询</el-button>
      </div>
    </el-descriptions-item>
    <el-descriptions-item label="牛奶描述:" :span="2">{{ data.description }}</el-descriptions-item>
  </el-descriptions>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { ElMessage } from 'element-plus'
import { getMilkDisInfo, getMilkSaleDate } from '@/api/milk'

const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  }
})
const data = ref(props.data)
const saleLabel = ref('销量:')
const date = ref('')

const init = async () => {
  await getMilkDisInfo(data.value.milkId).then(res => {
    // 将data中的销量数据(number)与res.data合并
    data.value = { number: data.value.number, ...res.data }; // 使用对象合并
  })
}
const handleQuery = () => {
  if (date.value) {
    ElMessage.success('查询成功')
    saleLabel.value = `销量(${date.value[0].slice(5)}~${date.value[1].slice(5)}):`
    shortcuts.push({
      text: date.value[0].slice(5) + '~' + date.value[1].slice(5),
      value: () => {
        return [new Date(date.value[0]), new Date(date.value[1])]
      },
    })
    getMilkSaleDate({id:data.value.id,begin: date.value[0],end: date.value[1]}).then(res => {
      data.value.number= res.data.reduce((sum,item)=>sum+item.number,0);
    })
  }
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
  date.value = term
  saleLabel.value = `销量(${term[0].slice(5)}~${term[1].slice(5)}):`
  shortcuts.push({
    text: term[0].slice(5) + '~' + term[1].slice(5),
    value: () => {
      return [new Date(term[0]), new Date(term[1])]
    },
  })
  init()
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