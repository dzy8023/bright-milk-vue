<template>
  <el-card style="max-width: 100%">
    <el-row>
      <el-col :span="17">
        订单状态：
        <el-select clearable @clear="getOrders" style="width: 150px" v-model="pageQueryData.status"
          placeholder="请选择订单状态" @change="getOrders">
          <el-option v-for="item in status" :label="item.name" :value="item.id" :key="item.id">
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
      <el-table-column label="订单状态">
        <template #default="{ row }">
          <span>{{ orderStatus(row.status) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" prop="updateTime"></el-table-column>
      <el-table-column label="创建时间" prop="createTime" />
      <el-table-column label="操作" width="250">
        <template #default="{ row }">
          <el-button type="primary" :disabled="row.status != '1'" size="small" @click="handlePay(row.id)" text>
            支付
          </el-button>
          <el-button type="info" size="small" text @click="handleOrderInfo(row)">
            详情
          </el-button>
          <el-button type="danger" :disabled="!(row.status == '1')" size="small" @click="handleDel(row.id)" text>
            删除
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
      <el-button v-if="order.status == '1'" type="primary" @click="handlePay(order.id)">确认支付</el-button>
      <div v-else >
        <el-button type="primary" @click="visible = false">确认</el-button>
        <el-button type="success" @click="handleOneMore">再来一单</el-button>
      </div>
      
    </el-row>
  </el-dialog>
</template>
<script setup>
import noImage from '@/assets/noImg.png'
import { Search } from '@element-plus/icons-vue'
import { ref, onMounted, watch } from 'vue'
import { refreshUserInfo } from '@/views/user/user'
import { ElMessage, ElMessageBox } from 'element-plus'
import { pageQuery, payOrder, deleteOrder, getOrderById,oneMoreOrder } from '@/api/order'
import { useRouter } from 'vue-router';
const router = useRouter();

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
  name: '已退款',
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
  await pageQuery(pageQueryData.value).then(res => {
    console.log(res)
    pageQueryData.value.total = res.data.total
    orders.value = res.data.records
  })
}
// 监听路由参数变化
watch(() => router.currentRoute.value.query?.orderId, (newOrderId) => {
  if (newOrderId) {
    visitOrderInfo(newOrderId);
  }
});
const visitOrderInfo = (orderId) => {
  order.value = {}
  if (orderId) {
    orders.value.forEach(item => {
      if (String(item.id) === String(orderId)) { // 确保数据类型一致
        order.value = item;
        visible.value = true;
      }
    });
    if (!visible.value) {
      getOrderById(orderId).then(res => {
        console.log(res)
        order.value = res.data
        visible.value = true;
        // 移除路由参数
      })
    }
    router.replace({ path: '/user/order', query: {} });
  }
}
onMounted(async () => {
  await getOrders(); // 确保订单数据已加载
  const orderId = router.currentRoute.value.query?.orderId; // 获取当前路由的查询参数
  if (orderId) {
    visitOrderInfo(orderId);
  }
});
const handleOneMore = () => {
  visible.value = false
  oneMoreOrder(order.value.id).then(res => {
    ElMessage.success(res.msg ? res.msg : '再来一单成功')
    router.push({ path: '/user/shoppingCart' });
  })
}
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
const handlePay = async (id) => {
  ElMessageBox.confirm(
    '你确定要支付该订单吗？',
    '温馨提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(async () => {
    //删除牛奶
    await payOrder(id).then(res => {
      ElMessage.success(res.msg ? res.msg : '支付成功')
      visible.value = false
      //刷新订单
      getOrders()
      refreshUserInfo()
    })
  })
}
//删除订单
const handleDel = (id) => {
  console.log(id)
  ElMessageBox.confirm(
    '你确定要删除该订单信息吗？',
    '温馨提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(async () => {
    //删除牛奶
    await deleteOrder(id).then(res => {
      ElMessage.success(res.msg ? res.msg : '删除成功')
      getOrders()
    })
  })
}
</script>
<style lang="scss" scoped>
.pwdCon {
  z-index: 2000;

  /* 确保对话框显示在其他元素之上 */
  .el-dialog__body {
    padding-top: 60px;
    padding: 60px 100px 0;
  }

  .el-input__inner {
    padding: 0 12px;
  }

  .el-form-item {
    margin-bottom: 26px;
  }

  .el-form-item__label {
    text-align: left;
  }

  .el-dialog__footer {
    padding-top: 14px;
  }
}

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