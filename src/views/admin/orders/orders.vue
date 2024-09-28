<template>
  <el-card style="max-width: 100%">
    <el-row>
      <el-col :span="7">
        订单状态：
        <el-select clearable @clear="getOrders" style="width: 150px" v-model="pageQueryData.status"
          placeholder="请选择订单状态">
          <el-option v-for="item in status" :label="item.name" :value="item.id" :key="item.id" >
          </el-option>
        </el-select>

        <el-button type="primary" @click="getOrders">
          <el-icon>
            <Search />
          </el-icon>
          &nbsp;查询</el-button>
      </el-col>
    </el-row>
    <el-table :data="orders" border style="width: 100%">
      <el-table-column label="序号" width="80" type="index" />
      <el-table-column label="订单号" prop="number"></el-table-column>
      <el-table-column label="电话号码" prop="phone"></el-table-column>
      <el-table-column label="实付金额" prop="actualPayment"></el-table-column>
      <el-table-column label="应收金额" prop="duePayment"></el-table-column>
      <el-table-column label="订单状态">
        <template #default="{ row }">
          <span>{{ orderStatus(row.status) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" prop="updateTime"></el-table-column>
      <el-table-column label="创建时间" prop="createTime" />
      <el-table-column label="操作" width="100">
        <template #default="{ row }">
          <el-button type="info" size="small" text @click="handleOrderInfo(row)">
            详情
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
  <el-dialog v-model="visible" width="500px" class="pwdCon" @close="visible = false">
    <el-row>
      <el-col :span="12">
        订单号: {{ order.number }}
      </el-col>
      <el-col :span="12">
        订单状态: {{ orderStatus(order.status) }}
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        用户名: {{ order.name }}
      </el-col>
      <el-col :span="12">
        电话号码: {{ order.phone }}
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        实付金额: {{ order.actualPayment }}
      </el-col>
      <el-col :span="12">
        应付金额: {{ order.duePayment }}
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        创建时间: {{ order.createTime }}
      </el-col>
      <el-col :span="12">
        更新时间: {{ order.updateTime }}
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        订单明细:
      </el-col>
    </el-row>
    <el-row>
      <el-table :data="order.orderDetailList" style="width: 100%;justify-content: center;">
        <el-table-column label="名称" width="100">
          <template #default="{ row }">
            <span>{{ row.name }}</span>
          </template>
        </el-table-column>
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
        <el-table-column label="数量" width="180">
          <template #default="{ row }">
            <span>{{ row.number }}</span>
          </template>
        </el-table-column>
        <el-table-column label="小计" width="180">
          <template #default="{ row }">
            <span>¥{{ row.amount }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-row>
      <el-button  type="primary" @click="visible = false">确认</el-button>
    </el-row>
  </el-dialog>
</template>
<script setup>
import noImage from '@/assets/noImg.png'
import { Search } from '@element-plus/icons-vue'
import { ref } from 'vue'
import {   adminPageQuery } from '@/api/order'

const order = ref({})
const orders = ref([])
const status = ref([{
  name: '待付款',
  id: 1
}, {
  name: '待完成',
  id: 2
}, {
  name: '已完成',
  id: 3
}, {
  name: '已取消',
  id: 4
}, {
  name: '退款',
  id: 5
}])
const orderStatus = (st) => {
  const statusItem = status.value.find(item => item.id === st);
  return statusItem ? statusItem.name : '未知状态';
};
const visible = ref(false);

const pageQueryData = ref({
  page: 1,
  total: 20,
  pageSize: 5,
  status: ''
})
//获取订单数据
const getOrders = async () => {
  await adminPageQuery(pageQueryData.value).then(res => {
    console.log(res)
    pageQueryData.value.total = res.data.total
    orders.value = res.data.records
  })
}

getOrders()
const handleSizeChange = (val) => {
  pageQueryData.value.pageSize = val
  getOrders()
}
const handleCurrentChange = (val) => {
  pageQueryData.value.page = val
  getOrders()
}
const handleOrderInfo = (row) => {
  visible.value = true
  order.value = row
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