<template>
  <el-card style="max-width: 100%">
    <el-row>
      <el-col :span="17">
        牛奶名称：
        <el-input v-model="pageQueryData.name" @clear="pageQuery" clearable style="width: 150px"
          placeholder="请输入牛奶名称"></el-input>
        分类类型：
        <el-select clearable @clear="pageQuery" style="width: 150px" v-model="pageQueryData.categoryId"
          placeholder="请选择分类">
          <el-option v-for="item in categoryOption" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        售卖状态：
        <el-select clearable @clear="pageQuery" style="width: 100px" v-model="pageQueryData.status" placeholder="售卖状态">
          <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <el-button type="primary" @click="pageQuery">
          <el-icon>
            <Search />
          </el-icon>
          &nbsp;查询</el-button>
      </el-col>
      <el-col :span="7">
        <el-button type="primary" @click="inAddMilk('add')">+ 添加牛奶</el-button>
      </el-col>
    </el-row>
    <el-table :data="milks" border style="width: 100%">
      <el-table-column label="序号" width="80" type="index" />
      <el-table-column label="牛奶名称" prop="name"></el-table-column>
      <el-table-column label="图片" prop="image">
        <template #default="{ row }">
          <el-image style="width: auto; height: 50px; border: none; cursor: pointer" :src="row.image">
            <template #error>
              <div class="image-slot">
                <img :src="noImage" style="width: auto; height: 50px; border: none">
              </div>
            </template>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column label="牛奶分类" prop="categoryName" />
      <el-table-column label="售价" prop="price">
        <template #default="{ row }">
          <span>￥{{ row.price.toFixed(2) * 100 / 100 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="售卖状态" prop="status">
        <template #default="{ row }">
          <span :style="{ color: row.status == '0' ? 'red' : 'green' }">
            {{ row.status == '0' ? '停售' : '启售' }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="库存" prop="amount"></el-table-column>
      <el-table-column label="操作时间" prop="updateTime" width="180"></el-table-column>
      <el-table-column label="操作" width="250">
        <template #default="{ row }">
          <el-button type="info" size="small" text @click="inAddMilk(row.id)">
            修改
          </el-button>
          <el-button type="danger" size="small" @click="handleDel(row.id)" text>
            删除
          </el-button>
          <el-button :type="row.status == '0' ? 'success' : 'danger'" size="small" text @click="handleStartOrStop(row)">
            {{ row.status == '0' ? '起售' : '停售' }}
          </el-button>
          <el-button type="primary" size="small" text @click="dialogVisible = true, milk.id = row.id, milk.amount = ''">
            进货
          </el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="没有数据" />
      </template>
    </el-table>
    <!-- 分页条 -->
    <div class="pagination-container">
      <el-pagination v-model:current-page="pageQueryData.page" v-model:page-size="pageQueryData.pageSize"
        :page-sizes="[3, 5, 10, 15]" layout="jumper, total, sizes, prev, pager, next" background
        :total="pageQueryData.total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
  </el-card>
  <el-dialog v-model="dialogVisible" title="进货" width="250">
    <el-input v-model="milk.amount" type="number" clearable style="width: 150px,center" placeholder="请输入至多3位数的牛奶数量"></el-input>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleAddAmount">
          确认
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script setup>
import noImage from '@/assets/noImg.png'
import { useRouter } from 'vue-router';
const router = useRouter()
import { Search } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
const milk = ref({
  id: '',
  amount: ''
})
const dialogVisible = ref(false)

const categoryOption = ref([{
  label: '优倍',
  value: 1
}, {
  label: '维他',
  value: 2
}])
const statusOptions = ref([{
  label: '停售',
  value: 0
}, {
  label: '启售',
  value: 1
}])
//根据id获取label
const getCategoryLabel = (categoryId) => {
  const option = categoryOption.value.find(option => option.value === categoryId);
  return option ? option.label : '未知类型';
};
const pageQueryData = ref({
  page: 1,
  total: 20,
  pageSize: 5,
  name: '',
  categoryId: '',
  status: ''
})
//添加分类数据模型
const milks = ref([])
const inAddMilk = (st) => {
  console.log(st)
  if (st === 'add') {
    router.push({
      path: '/admin/milk/add',
    })
  } else {
    router.push({
      path: '/admin/milk/add',
      query: { id: st }
    })
  }
}

import { categoryList } from '@/api/category.js'
import { milkPageQuery, deleteMilk, addMilkAmount, updateMilk, startOrStopMilk, getMilkById } from '@/api/milk.js'

//获取分类数据
const pageQuery = async () => {
  //获取分类数据
  const res1 = await categoryList()
  categoryOption.value = []
  for (let i = 0; i < res1.data.length; i++) {
    categoryOption.value.push({
      label: res1.data[i].name,
      value: res1.data[i].id
    })
  }
  console.log(categoryOption.value)
  // 获取牛奶数据
  const res2 = await milkPageQuery(pageQueryData.value)
  console.log(res2.data.records)
  milks.value = res2.data.records
  console.log(milks.value);
  for (let i = 0; i < milks.value.length; i++) {
    milks.value[i].categoryName = getCategoryLabel(milks.value[i].categoryId)
  }
  pageQueryData.value.total = res2.data.total
}
pageQuery()
const handleSizeChange = (val) => {
  pageQueryData.value.pageSize = val
  pageQuery()
}
const handleCurrentChange = (val) => {
  pageQueryData.value.page = val
  pageQuery()
}


//删除分类
const handleDel = (id) => {
  console.log(id)
  ElMessageBox.confirm(
    '你确定要删除该牛奶信息吗？',
    '温馨提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(async () => {
    //删除牛奶
    await deleteMilk(id).then(res => {
      ElMessage.success(res.msg ? res.msg : '删除成功')
      pageQuery()
    })
  })
}
//启用禁用
const handleStartOrStop = (row) => {
  console.log(row)
  ElMessageBox.confirm(
    `你确定要${row.status === 1 ? '禁用' : '启用'}该牛奶信息吗？`,
    '温馨提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(async () => {
    row.status = row.status === 1 ? 0 : 1;
    await startOrStopMilk(row).then(res => {
      ElMessage.success(res.msg ? res.msg : `${row.status === 1 ? '启用' : '禁用'}成功`)
      pageQuery()
    })
  })
}
const handleAddAmount = () => {
  console.log(milk.value.amount)
  if (/^[1-9]\d{0,2}$/.test(milk.value.amount)) {
    milk.amount = parseInt(milk.value.amount)
    ElMessageBox.confirm(
      `你确定要增加${milk.amount}数量的牛奶吗？`,
      '温馨提示',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }
    ).then(async () => {
      addMilkAmount(milk.value)
      ElMessage.success('增加成功')
      dialogVisible.value = false
      pageQuery()
    })
  } else {
    ElMessage.error('非法输入')
  }
}

</script>
<style lang="scss" scoped>
.disabled-text {
  color: #bac0cd !important;
}

.el-row {
  margin-bottom: 20px;

  .el-button {
    margin-left: 20px;
    min-width: 80px;
    //位置靠右
    float: right;
  }
}

.el-row:last-child {
  margin-bottom: 0;
}

.el-select {
  width: 100%;
  margin-right: 20px;
}

.el-col {
  border-radius: 4px;
}

.el-input {
  margin-right: 20px;
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  /* 根据需要调整 */
}
</style>
