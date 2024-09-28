<template>
  <el-row :gutter="20" class="section">
    <el-col :span="24">
      <Overview :currentDate="currentDate" :todayData="todayData" />
    </el-col>
  </el-row>
  <el-row :gutter="20" class="section">
    <el-col :span="24">
      <OrderView :currentDate="currentDate" :orderManagement="orderManagement" />
    </el-col>
  </el-row>
  <el-row :gutter="20" class="section">
    <el-col :span="12">
      <MilkView :currentDate="currentDate" :milkOverview="milkOverview" />
    </el-col>
    <el-col :span="12">
      <OrderMilkView :currentDate="currentDate" :orderMilkOverview="orderMilkOverview" />
    </el-col>
  </el-row>
  <el-row :gutter="20" class="section">
    <el-col :span="12">
      <el-card>
        <div class="card-header">
            <span>今日订单</span>
            <span class="date">{{ currentDate }}</span>
        </div>
        <el-table :data="orderData" style="width: 100%">
          <el-table-column prop="orderId" label="订单号" />
          <el-table-column prop="phone" label="电话号码" />
          <el-table-column label="创建时间" prop="createTime" />
          <el-table-column label="订单状态">
            <template #default="{ row }">
              <span>{{ orderStatus(row.status) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="实付金额" prop="actualPayment"></el-table-column>
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
      </el-card>
    </el-col>
    <el-col :span="12">
      <el-card>
        <div class="card-header">
            <span>今日取奶</span>
            <span class="date">{{ currentDate }}</span>
        </div>
        <el-table :data="orderData" style="width: 100%">
          <el-table-column prop="orderId" label="订单号" />
          <el-table-column prop="phone" label="电话号码" />
          <el-table-column label="创建时间" prop="createTime" />
          <el-table-column label="订单状态">
            <template #default="{ row }">
              <span>{{ orderStatus(row.status) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="实付金额" prop="actualPayment"></el-table-column>
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
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup>
import '@/styles/dashboard.scss';
import { ref } from 'vue';
import { Document, Van, Finished, Close, List, Dish, Plus ,Discount} from '@element-plus/icons-vue';
import Overview from './components/overview.vue';
import OrderView from './components/orderview.vue';
import MilkView from './components/milkview.vue';
import OrderMilkView from './components/ordermilkview.vue';
// 引入子组件

const currentDate = ref(new Date().toLocaleDateString());

const todayData = ref([
  { title: '营业额', value: '¥ 0' },
  { title: '有效订单', value: '0' },
  { title: '订单完成率', value: '0%' },
  { title: '平均客单价', value: '¥ 0' },
  { title: '新增用户', value: '0' },
]);

const orderManagement = ref([
  { title: '待接单', value: '0', icon: Document },
  { title: '待派送', value: '0', icon: Van },
  { title: '已完成', value: '0', icon: Finished },
  { title: '已取消', value: '0', icon: Close },
  { title: '全部订单', value: '0', icon: List },
]);

const milkOverview = ref([
  { title: '已启售', value: '24', icon: Dish },
  { title: '已停售', value: '0', icon: Discount },
  
]);

const orderMilkOverview = ref([
  { title: '已启售', value: '0', icon: Dish },
  { title: '已停售', value: '1', icon: Discount },
]);
</script>
