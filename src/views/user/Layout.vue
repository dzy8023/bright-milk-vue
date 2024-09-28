<template>
  <!-- element-plus容器 -->
  <el-container class="layout-container">
    <el-container>
      <!-- 头部区域 -->
      <el-header>
        <div>余额：<strong>{{ userInfoStore.info.balance }}</strong></div>
        <el-menu active-text-color="#ffd04b" background-color="#609dbf" text-color="#fff" :ellipsis="false"
          :default-active="def" mode="horizontal" router @select="refreshUserInfo">
          <el-menu-item index="/user/shoppingCart">
            <el-badge :value="200" :max="99" :offset="[0, 10]" class="item">
              <el-icon>
                  <ShoppingCart />
                </el-icon>
                购物车
            </el-badge>
          </el-menu-item>
          <el-menu-item index="/user/shop">
            <el-icon>
              <ShoppingCart />
            </el-icon>
            商城</el-menu-item>
          <el-menu-item index="/user/order">
            <el-icon>
              <Tickets />
            </el-icon>
            我的订单</el-menu-item>
          <el-menu-item @click="handleMsgCommand">
            <el-icon>
              <ChatDotRound />
            </el-icon>
            消息
          </el-menu-item>
          <el-menu-item>
            <!-- 下拉菜单 -->
            <!-- command:条目被点击后会触发，在事件函数上可以声明一个参数，接收条目对应指令 -->
            <el-dropdown placement="bottom-end" @command="handleCommand">
              <span class="el-dropdown__box">
                <div class="userName_box">{{ userInfoStore.info.name ? userInfoStore.info.name : '用户名'
                  }}
                </div>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="editInfo" :icon="EditPen">修改信息</el-dropdown-item>
                  <el-dropdown-item command="resetPassword" :icon="EditPen">修改密码</el-dropdown-item>
                  <el-dropdown-item command="logout" :icon="SwitchButton">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </el-menu-item>
        </el-menu>
      </el-header>
      <!-- 中间区域 -->
      <el-main>
        <router-view>
        </router-view>
      </el-main>
      <!-- 底部区域 -->
      <!-- 修改密码 -->
      <el-dialog title="修改密码" v-model="visible" width="400px" class="pwdCon" @close="handlePwdClose">
        <el-form :model="form" label-width="85px" :rules="rules" ref="formRef">
          <el-form-item label="原始密码：" prop="oldPassword" show-password>
            <el-input v-model="form.oldPassword" type="password" placeholder="请输入" clearable show-password></el-input>
          </el-form-item>
          <el-form-item label="新密码：" prop="newPassword">
            <el-input v-model="form.newPassword" type="password" placeholder="6 - 20位密码，数字或字母，区分大小写" clearable
              show-password></el-input>
          </el-form-item>
          <el-form-item label="确认密码：" prop="affirmPassword">
            <el-input v-model="form.affirmPassword" type="password" placeholder="请输入" clearable
              show-password></el-input>
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="handlePwdClose">取 消</el-button>
          <el-button type="primary" @click="handleSubmit">保 存</el-button>
        </template>
      </el-dialog>
      <el-dialog title="修改信息" v-model="infoVisible" width="400px" class="pwdCon" @close="handleInfoClose">
        <el-form :model="form" label-width="100px" :rules="rules" ref="formRef">
          <el-form-item label="姓名：" prop="name">
            <el-input v-model="form.name" placeholder="请输入姓名" clearable></el-input>
          </el-form-item>
          <el-form-item label="电话号码：" prop="phone">
            <el-input v-model="form.phone" placeholder="请输入电话号码" clearable></el-input>
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="handleInfoClose">取 消</el-button>
          <el-button type="primary" @click="handleInfoSubmit">保 存</el-button>
        </template>

      </el-dialog>
      <el-dialog title="聊天对话框" v-model="chatVisible" width="500px" class="chatCon" @close="handleChatClose">
        <div class="chat-content">
          <div class="messages">
            <div class="message" v-for="(msg, index) in messages" :key="index">
              <span class="username">{{ msg.username }}:</span>
              <span class="text">{{ msg.message }}</span>
            </div>
          </div>
          <el-input ref="messageInput" type="textarea" maxlength="200" show-word-limit :autosize="{ minRows: 1 }"
            style="width: 100%;" v-model="newMessage" placeholder="输入消息..." @keyup="handleKeyUp" clearable
            class="message-input" />
        </div>
        <template #footer>
          <el-button @click="handleChatClose">关闭</el-button>
          <el-button type="primary" @click="sendMessage">发送</el-button>
        </template>
      </el-dialog>
      <el-footer>光明牛奶订购系统 ©2024</el-footer>
    </el-container>
  </el-container>
</template>

<script setup>
import {
  EditPen,
  SwitchButton,
  ShoppingCart,
  Tickets,
  ChatDotRound
} from '@element-plus/icons-vue';
import { nextTick } from 'vue';
import { useUserInfoStore } from '@/stores/userInfo.js';
const userInfoStore = useUserInfoStore();
import { useTokenStore } from '@/stores/token.js';
const tokenStore = useTokenStore();
import { ElMessageBox, ElMessage } from 'element-plus';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();
import { editPassword } from '@/api/employee';
import { updateUserInfo, sendMessageService, getUserInfo } from '@/api/user'
import { refreshUserInfo } from '@/views/user/user'
const def = ref('');
const visible = ref(false);
const infoVisible = ref(false)
const chatVisible = ref(false)

const messages = ref([
  { username: '用户1', message: '你好！' },
  { username: '用户2', message: '你好，有什么可以帮忙的吗？' }
]);
const newMessage = ref('');

const messageInput = ref(null);
const handleMsgCommand = () => {
  chatVisible.value = true;
  // 聚焦
  nextTick(() => {
    setTimeout(() => {
      if (messageInput.value) {
        messageInput.value.focus();
      }
    }, 0); // 延迟执行
  });
};

const handleChatClose = () => {
  chatVisible.value = false;
};
const handleKeyUp = (event) => {
  if (event.ctrlKey && event.key === 'Enter') {
    sendMessage();
  }
};
const sendMessage = () => {
  if (newMessage.value.trim() !== '') {
    // ,userId:1
    sendMessageService({ message: newMessage.value }).then((res) => {
      console.log(res);
      ElMessage.success(res.data);
      messages.value.push({ username: '我', message: newMessage.value });
      newMessage.value = '';
    })
  }
};

// 条目被点击后调用的函数
const handleCommand = (command) => {
  // 判断指令
  if (command === 'logout') {
    // 退出登录
    ElMessageBox.confirm(
      '你确定要退出登录吗？',
      '温馨提示',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }
    ).then(async () => {
      // 退出登录
      // 1.清空pinia中的数据
      tokenStore.removeToken(); // 清空token
      userInfoStore.removeInfo(); // 清空用户信息
      // 2.跳转到登录页面
      router.push('/login');
      ElMessage({
        type: 'success',
        message: '退出成功',
      });
    })
  } else if (command === 'resetPassword') {
    visible.value = true;
  } else if (command === 'editInfo') {
    infoVisible.value = true
  }
};
const formRef = ref(null);

const validatePwd = (rule, value, callback) => {
  const reg = /^[0-9A-Za-z]{6,20}$/;
  if (!value) {
    callback(new Error('请输入'));
  } else if (!reg.test(value)) {
    callback(new Error('6 - 20位密码，数字或字母，区分大小写'));
  } else {
    callback();
  }
};

const validatePass2 = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请再次输入密码'));
  } else if (value !== form.value.newPassword) { // 注意这里的 this 应该是 form.value
    callback(new Error('密码不一致，请重新输入密码'));
  } else {
    callback();
  }
};

const rules = ref({
  oldPassword: [{ validator: validatePwd, trigger: 'blur' }],
  newPassword: [{ validator: validatePwd, trigger: 'blur' }],
  affirmPassword: [{ validator: validatePass2, trigger: 'blur' }],
  name: [{
    required: true, message: '请输入姓名', trigger: 'blur'
  }, {
    min: 2, max: 10, message: '用户名长度在2到10个字符', trigger: 'blur'
  }],
  phone: [{
    required: true, message: '请输入电话号码', trigger: 'blur'
  }, {
    pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur'
  }],
});

const form = ref({
  oldPassword: '',
  newPassword: '',
  affirmPassword: '',
  name: '',
  phone: '',
});
const clearForm = () => {
  form.value = {
    oldPassword: '',
    newPassword: '',
    affirmPassword: '',
    name: '',
    phone: '',
  }
}

const handlePwdClose = () => {
  visible.value = false;
  formRef.value.resetFields();
  clearForm()
};
const handleInfoClose = () => {
  infoVisible.value = false;
  formRef.value.resetFields();
  clearForm()
}
const handleInfoSubmit = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      updateUserInfo(form.value).then((res) => {
        ElMessage.success(res.message);
        handleInfoClose();
      });
    }
  });
}
const handleSubmit = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      editPassword(form.value).then((res) => {
        ElMessage.success(res.message);
        handlePwdClose();
      });
    }
  });
};
onMounted(() => {
  def.value = router.currentRoute.value.path;
  refreshUserInfo()
});
</script>


<style lang="scss" scoped>
.el-menu {
  border: none;
  //靠右
  margin-left: auto;
}

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

.layout-container {
  height: 100vh;

  .el-aside {
    background-color: #232323;

    &__logo {
      height: 120px;
      background: url('@/assets/logo.png') no-repeat center / 120px auto;
    }

    .el-menu {
      border-right: none;
      justify-content: end;

    }
  }

  .el-header {
    background-color: #ffc200;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .el-dropdown__box {
      height: 40px;
      width: 80px;
      background: #dada0c;
      padding: 5px;
      font-size: 18px;
      color: #333;
      border: none;
      border-radius: 5px;

      .userName_box {
        width: 100%;
        height: 100%;
        display: flex;
        //没有边框
        border: none;
        align-items: center;
        justify-content: center;
      }
    }

    .el-dropdown__box:hover {
      background-color: #cbea1d;
      color: #ffffff;
      cursor: pointer;
    }
  }

  .el-footer {
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: #666;
  }
}
</style>