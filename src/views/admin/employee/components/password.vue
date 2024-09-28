<template>
  <el-dialog
    title="修改密码"
    v-model:visible="visible"
    width="568px"
    class="pwdCon"
    @close="handlePwdClose"
  >
    <el-form :model="form" label-width="85px" :rules="rules" ref="formRef">
      <el-form-item label="原始密码：" prop="oldPassword">
        <el-input
          v-model="form.oldPassword"
          type="password"
          placeholder="请输入"
        ></el-input>
      </el-form-item>
      <el-form-item label="新密码：" prop="newPassword">
        <el-input
          v-model="form.newPassword"
          type="password"
          placeholder="6 - 20位密码，数字或字母，区分大小写"
        ></el-input>
      </el-form-item>
      <el-form-item label="确认密码：" prop="affirmPassword">
        <el-input
          v-model="form.affirmPassword"
          type="password"
          placeholder="请输入"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="handlePwdClose">取 消</el-button>
      <el-button type="primary" @click="handleSubmit">保 存</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref,watchEffect,watch, defineProps, defineEmits,} from 'vue';
import { ElMessage } from 'element-plus';
import { editPassword } from '@/api/employee';

const emit = defineEmits(['update:visible', 'password-changed']);
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
    required: true
  }
});

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
});

const form = ref({
  oldPassword: '',
  newPassword: '',
  affirmPassword: '',
});

const handlePwdClose = () => {
  emit('update:visible', false);
};

const handleSubmit = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      editPassword(form.value).then((res) => {
        ElMessage.success(res.message);
        emit('password-changed');
        handlePwdClose();
      });
    }
  });
};
watchEffect(() => {
  console.log('Dialog visible state:', props.visible);
});

// 监视 visible 变化
watch(() => props.visible, (newVal) => {
  console.log(`Dialog visible changed: ${newVal}`);
});


</script>

<style lang="scss">

  .pwdCon {
    z-index: 2000; /* 确保对话框显示在其他元素之上 */
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
</style>