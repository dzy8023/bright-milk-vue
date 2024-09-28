<template>
  <el-card style="max-width: 100%">
    <el-row>
      <el-col :span="14">
        员工名称：
        <el-input v-model="pageQueryData.name" @clear="pageQuery" clearable style="width: 200px" placeholder="请输入员工名"></el-input>
        <el-button type="primary" @click="pageQuery">
          <el-icon>
            <Search />
          </el-icon>
          &nbsp;查询</el-button>
      </el-col>
      <el-col :span="10">
        <el-button type="primary" @click="inAddEmployee('add')">+ 添加员工</el-button>
      </el-col>
    </el-row>
    <el-table :data="employees" border style="width: 100%">
      <el-table-column label="序号" width="100" type="index" />
      <el-table-column label="员工名称" prop="name"></el-table-column>
      <el-table-column label="员工账号" prop="username"></el-table-column>
      <el-table-column label="手机号" prop="phone"></el-table-column>
      <el-table-column label="账号状态" prop="status">
        <template #default="{ row }">
          <span :style="{ color: row.status === 1 ? 'green' : 'red' }">
            {{ row.status === 1 ? '启用' : '禁用' }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作时间" prop="updateTime"></el-table-column>
      <el-table-column label="操作" width="200">
        <template #default="{ row }">
          <el-button :disabled="row.username==='admin'" type="info" size="small" text @click="inAddEmployee(row.id)">
            修改
          </el-button>
          <el-button :disabled="row.username==='admin'" type="danger" size="small" @click="handleDel(row.id)" text>
            删除
          </el-button>
          <el-button :disabled="row.username==='admin'" :type="row.status == '0' ? 'success' : 'danger'" size="small" text @click="handleStartOrStop(row)">
            {{ row.status == '0' ? '启用' : '禁用' }}
          </el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="没有数据" />
      </template>
    </el-table>
    <!-- 分页条 -->
    <div class="pagination-container">
      <el-pagination 
       v-model:current-page="pageQueryData.page" 
       v-model:page-size="pageQueryData.pageSize"
        :page-sizes="[3, 5, 10, 15]" 
        layout="jumper, total, sizes, prev, pager, next" 
        background
        :total="pageQueryData.total" 
        @size-change="handleSizeChange"
         @current-change="handleCurrentChange" />
    </div>
  </el-card>
</template>
<script setup>
import { Search } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router';
const router = useRouter()
import { employeePageQuery ,deleteEmployee,startOrStopEmployee} from '@/api/employee';
const pageQueryData = ref({
  page: 1,
  total: 20,
  pageSize: 5,
  name: '',
})
const employees = ref([])

const inAddEmployee = (st) => {
  console.log(st)
  if (st === 'add') {
    router.push({
      path: '/admin/employee/add',
    })
  } else {
    router.push({
      path: '/admin/employee/add',
      query: { id: st }
    })
  }
}

//分页查询
const pageQuery = async () => {
  console.log(pageQueryData.value)
  const res = await employeePageQuery(pageQueryData.value)
    console.log(res.data);
    employees.value = res.data.records
    pageQueryData.value.total = res.data.total
}
pageQuery()

const handleSizeChange = (val) => {
  console.log(val)
  pageQueryData.value.pageSize = val
  pageQuery()
}
const handleCurrentChange = (val) => {
  console.log(val)
  pageQueryData.value.page = val
  pageQuery()
}

//删除员工
const handleDel = (id) => {
  console.log(id)
  ElMessageBox.confirm(
    '你确定要删除该员工信息吗？',
    '温馨提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(async () => {
    //删除分类
    await deleteEmployee(id).then(res => {
      ElMessage.success(res.msg?res.msg:'删除成功')
      pageQuery()
    })
  }).catch(() => {
      ElMessage({
        type: 'info',
        message: '操作取消',
      })
    })
}

//启用禁用
const handleStartOrStop = (row) => {
  console.log(row)
  ElMessageBox.confirm(
    `你确定要${row.status === 1 ? '禁用' : '启用'}该员工吗？`,
    '温馨提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(async () => {
    row.status = row.status === 1 ? 0 : 1;
    await startOrStopEmployee(row).then(res => {
      ElMessage.success(res.msg?res.msg:`${row.status === 1 ? '启用' : '禁用'}成功`)
      pageQuery()
    })
  }).catch(() => {
    ElMessage({
      type: 'info',
      message: '操作取消',
    })
  })
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
