<template>
  <div class="cart-page">
    <div class="cart-container">
      <el-table :data="cartItems" style="width: 100%;justify-content: center;">
        <el-table-column prop="name" label="商品名称" width="120"></el-table-column>
        <el-table-column label="图片" prop="image">
          <template #default="{ row }">
            <el-image style="width: auto; height: 80px; border: none; cursor: pointer" :src="row.image">
              <template #error>
                <div class="image-slot">
                  <img :src="noImage" style="width: auto; height: 80px; border: none">
                </div>
              </template>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column label="数量" width="120">
          <template #default="{ row }">
            <span>{{ row.number }}</span>
          </template>
        </el-table-column>
        <el-table-column label="小计" width="120">
          <template #default="{ row }">
            <span>¥{{ row.amount }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="180">
          <template #default="{ row }">
            <span>{{ row.createTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template #default="{ row }">
            <el-button type="danger" @click="removeItem(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="cart-summary">
        <span>总价: ¥{{ totalPrice }}</span>
        <el-button type="primary" @click="submitOrder">提交订单</el-button>
      </div>
    </div>
  </div>
  <el-dialog v-model="visible" width="500px" class="pwdCon" :before-close="handleClose">
    <el-row>
      <el-col :span="12">
        订单号: {{ order.number }}
      </el-col>
      <el-col :span="12">
        订单状态: {{ orderStatus }}
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
      <el-button type="primary" @click="handlePay">确认支付</el-button>
    </el-row>
  </el-dialog>
</template>

<script setup>
import noImage from '@/assets/noImg.png'
import { ref, computed,onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { getShoppingCart, delShoppingCart } from '@/api/shoppingCart';
import { createOrder, payOrder } from '@/api/order';
import { refreshUserInfo } from '@/views/user/user'

// 示例购物车数据
const cartItems = ref([
]);
const order = ref({})
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
const orderStatus = computed(() => {
  const statusItem = status.value.find(item => item.id === order.value.status);
  return statusItem ? statusItem.name : '未知状态';
});
const visible = ref(false);
const handleClose = () => {
  ElMessageBox.confirm('确认退出支付？')
    .then(() => {
      visible.value = false;
    })
};

// 获取用户购物车数据
const getUserCart = async () => {
  await getShoppingCart().then(response => {
    cartItems.value = response.data;
  })
};
onMounted(() => {
  getUserCart();
})
// 计算总价
const totalPrice = computed(() => {
  return cartItems.value.reduce((total, item) => {
    return total + item.amount;
  }, 0).toFixed(2);
});
// 删除商品
const removeItem = async (item) => {
  // 删除购物车中的商品
  await delShoppingCart(item.id)
  getUserCart();
  cartItems.value = cartItems.value.filter(cartItem => cartItem.id !== item.id);
  ElMessage.success(`${item.name} 已从购物车中删除`);
};
const handlePay = () => {
  ElMessageBox.confirm('确认支付？').then(() => {
    // 执行支付逻辑
    payOrder(order.value.id).then(() => {
      ElMessage.success('订单支付成功');
      getUserCart()
      refreshUserInfo()
    })
    visible.value = false;
  })
};
// 提交订单
const submitOrder = async () => {
  if (cartItems.value.length === 0) {
    ElMessage.error('购物车为空，无法提交订单');
    return;
  }
  visible.value = true;
  await createOrder().then((res) => {
    console.log(res.data)
    order.value = res.data
    visible.value = true
  })
  getUserCart()
};
</script>

<style scoped>
.pwdCon {
  z-index: 2000;
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

.cart-page {
  display: flex;
  justify-content: center;
  /* align-items: center; */
  min-height: 100vh;
  background-color: #f5f5f5;
}

.cart-container {
  padding: 20px;
}

.cart-summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}

.no-input .el-input__inner {
  display: none;
}

.el-button {
  margin: 0 auto;
}
</style>