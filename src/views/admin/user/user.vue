<template>
  <el-card style="max-width: 100%">
    <el-row>
      <el-col :span="14">
        用户姓名：
        <el-input v-model="pageQueryData.name" @clear="pageQuery" clearable 
          placeholder="请输入员工名"></el-input>
        电话号码:
        <el-input v-model="pageQueryData.phone" @clear="pageQuery" clearable
          placeholder="请输入员工名"></el-input>
        <el-button type="primary" @click="pageQuery">
          <el-icon>
            <Search />
          </el-icon>
          &nbsp;查询</el-button>
      </el-col>
      <el-col :span="10">
        <el-button type="primary" @click="visible = true">+ 用户充值</el-button>
      </el-col>
    </el-row>
    <el-table :data="users" border style="width: 100%">
      <el-table-column label="序号" width="100" type="index" />
      <el-table-column label="用户名称" prop="name"></el-table-column>
      <el-table-column label="手机号" prop="phone"></el-table-column>
      <el-table-column label="余额" prop="balance"></el-table-column>
      <el-table-column label="创建时间" prop="status">
        <template #default="{ row }">
          <span :style="{ color: row.status === 1 ? 'green' : 'red' }">
            {{ row.status === 1 ? '启用' : '禁用' }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作时间" prop="createTime"></el-table-column>
      <el-table-column label="操作" width="240">
        <template #default="{ row }">
          <el-button type="info" size="small" text @click="handleReset(row)">
            重置密码
          </el-button>
          <el-button :disabled="row.status === '1'" type="danger" size="small" @click="handleDel(row.id)" text>
            删除
          </el-button>
          <el-button :type="row.status == '0' ? 'success' : 'danger'" size="small" text @click="handleStartOrStop(row)">
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
      <el-pagination v-model:current-page="pageQueryData.page" v-model:page-size="pageQueryData.pageSize"
        :page-sizes="[3, 5, 10, 15]" layout="jumper, total, sizes, prev, pager, next" background
        :total="pageQueryData.total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
  </el-card>
  <el-dialog title="用户充值" v-model="visible" width="400px" class="pwdCon" @close="handleCancel">
    <el-form :model="form" label-width="100px" :rules="rules" ref="formRef">
      <el-form-item label="电话号码：" prop="phone" >
        <el-input v-model="form.phone" type="phone"  placeholder="请输入用户电话" clearable></el-input>
      </el-form-item>
      <el-form-item label="充值金额：" prop="charge">
        <el-input v-model="form.charge" type="number" placeholder="请输入至多3位数的金额" clearable></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="handleCancel">取 消</el-button>
      <el-button type="primary" @click="handleSubmit">保 存</el-button>
    </template>
  </el-dialog>
</template>
<script setup>
import { Search } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { userPageQuery, deleteUser, startOrStopUser, restPassword, userCharge } from '@/api/user';
const pageQueryData = ref({
  page: 1,
  total: 20,
  pageSize: 5,
  name: '',
  phone: ''
})
const users = ref([])
const visible = ref(false)
const form = ref({ phone: '', charge: '' })
const rules = ref({
  phone: [
    { required: true, message: '请输入电话号码', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入11位数的电话号码', trigger: 'blur' },
  ],
  charge: [
    { required: true, message: '请输入充值金额', trigger: 'blur' },
    {pattern: /^[1-9]\d{1,2}$/, message: '请输入至多3位数的金额', trigger: 'blur' },
  ],
})

const formRef = ref(null);
//分页查询
const pageQuery = async () => {
  console.log(pageQueryData.value)
  const res = await userPageQuery(pageQueryData.value)
  console.log(res.data);
  users.value = res.data.records
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

//删除用户
const handleDel = (id) => {
  console.log(id)
  ElMessageBox.confirm(
    '你确定要删除该用户信息吗？',
    '温馨提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(async () => {
    //删除用户
    await deleteUser(id).then(res => {
      ElMessage.success(res.msg ? res.msg : '删除成功')
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
    `你确定要${row.status === 1 ? '禁用' : '启用'}该用户吗？`,
    '温馨提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(async () => {
    row.status = row.status === 1 ? 0 : 1;
    await startOrStopUser(row).then(res => {
      ElMessage.success(res.msg ? res.msg : `${row.status === 1 ? '启用' : '禁用'}成功`)
      pageQuery()
    })
  }).catch(() => {
    ElMessage({
      type: 'info',
      message: '操作取消',
    })
  })
}

const handleCancel=()=>{
  visible.value=false
  form.value={ phone: '', charge: '' }
  formRef.value.resetFields()
}
const handleSubmit=()=>{
  formRef.value.validate(async (valid) => {
    if (valid) {
      userCharge(form.value).then((res)=>{
        ElMessage.success(res.msg?res.msg:"充值成功");
        handleCancel();
        pageQuery();
      })
    }
  })
}
const handleReset=(row)=>{
  console.log(row)
  ElMessageBox.confirm(
    `你确定要重置该用户密码吗？`,
    '温馨提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(async () => {
    //重置密码
    await restPassword(row.id).then(res => {
      ElMessage.success(res.msg ? res.msg : '重置成功')
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
  width: 185px;
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  /* 根据需要调整 */
}
</style>
