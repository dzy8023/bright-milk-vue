<template>
  <el-card style="max-width: 100%">
    <el-row>
      <el-col :span="14">
        分类名称：
        <el-input v-model="pageQueryData.name" @clear="pageQuery" clearable style="width: 200px" placeholder="请输入分类名"></el-input>
        分类类型：
        <el-select clearable @clear="pageQuery" style="width: 200px" v-model="pageQueryData.type" placeholder="请选择">
          <el-option v-for="item in typeOptions" :label="item.label" :value="item.value" :key="item.value">
          </el-option>
        </el-select>
        <el-button type="primary" @click="pageQuery">
          <el-icon>
            <Search />
          </el-icon>
          &nbsp;查询</el-button>
      </el-col>
      <el-col :span="10">
        <el-button type="primary" @click="showAddDialog">+ 添加分类</el-button>
      </el-col>
    </el-row>
    <el-table :data="categorys" border style="width: 100%">
      <el-table-column label="序号" width="100" type="index" />
      <el-table-column label="分类名称" prop="name"></el-table-column>
      <el-table-column label="分类类型" prop="type">
         <template #default="{ row }">
          {{ getTypeLabel(row.type) }}
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="status">
        <template #default="{ row }">
          <span :style="{ color: row.status === 1 ? 'green' : 'red' }">
            {{ row.status === 1 ? '启用' : '禁用' }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作时间" prop="updateTime"></el-table-column>
      <el-table-column label="操作" width="200">
        <template #default="{ row }">
          <el-button type="info" size="small" text @click="showEditDialog(row)">
            修改
          </el-button>
          <el-button type="danger" size="small" @click="handleDel(row.id)" text>
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
    <!-- 添加分类弹窗 -->
    <el-dialog v-model="dialogVisible" :title="title" width="30%" :before-close="handleClose" :destroy-on-close="true">
      <el-form ref="categoryForm" :model="categoryModel" :rules="rules" label-width="100px" style="padding-right: 30px">
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="categoryModel.name" clearable minlength="1" maxlength="10"></el-input>
        </el-form-item>
        <el-form-item label="分类类型" prop="type">
          <el-select clearable style="width: 200px" v-model="categoryModel.type" placeholder="请选择">
            <el-option v-for="item in typeOptions" :label="item.label" :value="item.value" :key="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click=" clearCategoryModel()">取消</el-button>
          <el-button type="primary" @click="title == '添加分类' ? handleAdd() : handleEdit()"> 确认
          </el-button>
        </span>
      </template>
    </el-dialog>
  </el-card>
</template>
<script setup>
import { Search } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useTokenStore } from '@/stores/token.js'
const typeOptions = ref([{
  label: '低温奶',
  value: 1
}, {
  label: '常温奶',
  value: 2
}])
const getTypeLabel = (typeValue) => {
  const option = typeOptions.value.find(option => option.value === typeValue);
  return option ? option.label : '未知类型';
};
const pageQueryData = ref({
  page: 1,
  total: 20,
  pageSize: 5,
  name: '',
  type: ''
})
//定义变量，控制标题展示
const title = ref('');
//控制添加分类弹窗
const dialogVisible = ref(false)

//添加分类数据模型
const categoryModel = ref({
  id: '',
  name: '',
  type: ''
})

const categorys = ref([])
const categoryForm = ref(null)

//关闭弹窗执行的操作
const handleClose = (done) => {
  clearCategoryModel();
  done();
}
const clearCategoryModel = () => {
  dialogVisible.value = false;
  categoryModel.value = {
    id: '',
    name: '',
    type: ''
  }
}
const showEditDialog = (row) => {
  dialogVisible.value = true;
  title.value = '修改分类';
  categoryModel.value = {
    id: row.id,
    name: row.name,
    type: row.type
  }
}
const showAddDialog = () => {
  dialogVisible.value = true;
  title.value = '添加分类';
}

//添加校验规则
const rules = {
  name: [
    { required: true, message: '请输入分类名称', trigger: 'blur' },
    { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '请输入分类别名', trigger: 'blur' },
  ],
}
import { categoryPageQuery, startOrStopCategory, deleteCategory, addCategory, updateCategory } from '@/api/category.js'
//获取分类数据
const pageQuery = async () => {
  console.log(pageQueryData.value)
  const res = await categoryPageQuery(pageQueryData.value)
    categorys.value = res.data.records
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

//删除分类
const handleDel = (id) => {
  console.log(id)
  ElMessageBox.confirm(
    '你确定要删除该分类信息吗？',
    '温馨提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(async () => {
    //删除分类
    await deleteCategory(id).then(res => {
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
    `你确定要${row.status === 1 ? '禁用' : '启用'}该分类信息吗？`,
    '温馨提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(async () => {
    row.status = row.status === 1 ? 0 : 1;
    await startOrStopCategory(row).then(res => {
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

//添加分类
const handleAdd = async () => {
  await categoryForm.value.validate(async (valid) => {
    if (valid) {
      console.log(categoryModel.value);
      //添加分类
      addCategory(categoryModel.value).then(res => {
        ElMessage.success(res.msg ? res.msg : '添加成功')
        pageQuery()
        clearCategoryModel()
        return true
      })
    }
    return false
  })
}

//修改分类
const handleEdit = async () => {
  await categoryForm.value.validate(async (valid) => {
    if (valid) {
      console.log(categoryModel.value);
      //添加分类
      await updateCategory(categoryModel.value).then(res => {
        ElMessage.success(res.msg ? res.msg : '修改成功')
        pageQuery()
        clearCategoryModel()
        return true
      })
    }
    return false
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
