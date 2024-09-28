<script setup>
import { User, Cellphone, Lock } from '@element-plus/icons-vue'
import { nextTick, ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
//控制用户与员工登录
const isUser = ref(false)
//控制注册与登录表单的显示， 默认显示登录
const isRegister = ref(false)
//是否在加载中
const loading = ref(false)
//定义员工数据模型
const employeeData = ref({
    username: 'admin',
    password: '123456',
    rePassword: ''
})
//定义用户数据模型
const userData = ref({
    name: '',
    phone: '15270168006',
    password: '123456',
    rePassword: ''
})

//记住我
const rememberMe = ref(false)
//校验密码的函数
const checkRePassword = (rule, value, callback) => {
    if (value === "") {
        callback(new Error('请再次确认密码'));
    } else if (value !== userData.value.password) {
        callback(new Error('两次输入的密码不一致'));
    } else {
        callback();
    }
}

//定义表单校验规则
const rules = {
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
    username: [{
        required: true, message: '请输入用户名', trigger: 'blur'
    },
    {
        min: 4, max: 15, message: '用户名长度在4到15个字符', trigger: 'blur'
    }],
    password: [{
        required: true, message: '请输入密码', trigger: 'blur'
    },
    {
        min: 6, max: 16, message: '密码长度在6到15个字符', trigger: 'blur'
    }],
    rePassword: [
        { validator: checkRePassword, trigger: 'blur' }
    ]
}

//调用后台接口，完成注册
import { userRegisterService, userLoginService } from '@/api/user.js'
import { employeeLoginService } from '@/api/employee.js'
//登录
//绑定数据，复用注册表单的数据模型
//表单数据校验
//登录函数
import { useTokenStore } from '@/stores/token.js'
const tokenStore = useTokenStore();
import { useRouter } from 'vue-router';
import { useAdminInfoStore } from '@/stores/adminInfo.js';
const adminInfoStore = useAdminInfoStore();
import { useUserInfoStore } from '@/stores/userInfo.js'
const userInfoStore = useUserInfoStore();
const userRegisterForm = ref(null);
const userLoginForm = ref(null);
const employeeLoginForm = ref(null);

const router = useRouter()
const focusFirstInput = () => {
    nextTick(() => {
        const firstInput = document.querySelector('input');
        if (firstInput) {
            firstInput.focus({ preventScroll: true });
        }
    });
}

const register = async () => {
    await userRegisterForm.value.validate(async (valid) => {
        if (valid) {
            loading.value = true;
            //校验通过，调用后台接口
            await userRegisterService(userData.value).then((result) => {
                console.log(result.data)
                //注册成功后，跳转到登录页面
                ElMessage.success(result.message ? result.message : '注册成功');
                //跳转到首页
                router.push('/login');
                loading.value = false;
            }).catch(() => {
                loading.value = false;
            })
        }
    })
}

const userLogin = async () => {
    await userLoginForm.value.validate(async (valid) => {
        if (valid) {
            loading.value = true;
            //校验通过，调用后台接口
            await userLoginService(userData.value).then((result) => {
                //注册成功后，跳转到登录页面
                ElMessage.success(result.message ? result.message : '登录成功');
                console.log(result.data);
                //将token存储到pinia中
                tokenStore.setToken(result.data.token);
                let info = {
                    id: result.data.id,
                    name: result.data.name,
                    balance: result.data.balance
                }
                userInfoStore.setInfo(info);
                //跳转到首页
                router.push('/user');
                loading.value = false;
            }).catch(() => {
                loading.value = false;
            })
        }
    })
}

const employeeLogin = async () => {
    await employeeLoginForm.value.validate(async (valid) => {
        if (valid) {
            loading.value = true;
            //校验通过，调用后台接口
            await employeeLoginService(employeeData.value).then((result) => {
                ElMessage.success(result.message ? result.message : '登录成功');
                console.log(result.data);
                //将token存储到pinia中
                tokenStore.setToken(result.data.token);
                let info = {
                    id: result.data.id,
                    userName: result.data.userName,
                    name: result.data.name
                }
                adminInfoStore.setInfo(info)
                console.log(tokenStore.token);
                //跳转到首页
                router.push('/admin');
            }).catch(() => {
                loading.value = false;
            })
        }
    })
}
//清空数据模型的数据
const clearData = () => {
    employeeData.value = {
        username: '',
        password: ''
    };
    userData.value = {
        name: '',
        phone: '',
        password: '',
        rePassword: ''
    }
}
const selectUser = () => {
    if (!isUser.value) {
        clearData();
    }
    isUser.value = true;
    focusFirstInput(); // 切换后聚焦
    }
const selectEmployee = () => {
    if (isUser.value) {
        clearData();
    }
    isUser.value = false;
    focusFirstInput(); // 切换后聚焦
}
onMounted(() => {
    focusFirstInput();
});

</script>
<template>
    <el-row class="login-page">
        <el-col :span="12" class="bg"></el-col>
        <el-col :span="6" :offset="3" class="form">
            <h1>
                <span :class="{ active: isUser }" @click="selectUser">用户</span>
                /
                <span :class="{ active: !isUser }" @click="selectEmployee">员工</span>
            </h1>
            <!-- 用户注册 -->
            <!-- scroll-to-error 当校验失败时，滚动到第一个错误表单项 -->
            <el-form ref="userRegisterForm" size="large" autocomplete="off" v-if="isRegister && isUser"
                :model="userData" :rules="rules">
                <el-form-item prop="name">
                    <el-input :prefix-icon="User" placeholder="姓名" v-model="userData.name"></el-input>
                </el-form-item>
                <el-form-item prop="phone">
                    <el-input :prefix-icon="Cellphone" placeholder="请输入电话号码" v-model="userData.phone"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input :prefix-icon="Lock" type="password" placeholder="请输入密码" v-model="userData.password"
                        show-password></el-input>
                </el-form-item>
                <el-form-item prop="rePassword">
                    <el-input :prefix-icon="Lock" type="password" placeholder="请再次输入密码" v-model="userData.rePassword"
                        show-password @keyup.enter="register"></el-input>
                </el-form-item>
                <!-- 注册按钮 -->
                <el-form-item>
                    <el-button class="button" type="primary" auto-insert-space :loading="loading" @click="register">
                        <span v-if="!loading">注册</span>
                        <span v-else>注册中...</span>
                    </el-button>
                </el-form-item>
                <el-form-item class="flex">
                    <el-link type="info" :underline="false" @click="isRegister = false; clearData()">
                        ← 返回
                    </el-link>
                </el-form-item>
            </el-form>
            <!-- 用户登录表单 -->
            <el-form ref="userLoginForm" size="large" autocomplete="off" v-else-if="isUser" :model="userData"
                :rules="rules">
                <el-form-item prop="phone">
                    <el-input :prefix-icon="Cellphone" placeholder="请输入电话号码" v-model="userData.phone"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input :prefix-icon="Lock" type="password" placeholder="请输入密码" v-model="userData.password"
                        show-password @keyup.enter="userLogin"></el-input>
                </el-form-item>
                <el-form-item class="flex">
                    <div class="flex">
                        <el-checkbox v-model="rememberMe">记住我</el-checkbox>
                        <el-link type="primary" :underline="false">忘记密码？</el-link>
                    </div>
                </el-form-item>
                <!-- 登录按钮 -->
                <el-form-item>
                    <el-button class="button" type="primary" auto-insert-space :loading="loading" @click="userLogin">
                        <span v-if="!loading">登录</span>
                        <span v-else>登录中...</span>
                    </el-button>
                </el-form-item>
                <el-form-item class="flex">
                    <el-link type="info" :underline="false" @click="isRegister = true;focusFirstInput();  clearData()">
                        注册 →
                    </el-link>
                </el-form-item>
            </el-form>
            <!-- 员工登录 -->
            <el-form ref="employeeLoginForm" size="large" autocomplete="off" v-else :model="employeeData"
                :rules="rules">
                <el-form-item prop="username">
                    <el-input :prefix-icon="User" placeholder="请输入用户名" v-model="employeeData.username"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input name="password" :prefix-icon="Lock" type="password" placeholder="请输入密码"
                        v-model="employeeData.password" show-password  @keyup.enter="employeeLogin"></el-input>
                </el-form-item>
                <el-form-item class="flex">
                    <div class="flex">
                        <el-checkbox v-model="rememberMe">记住我</el-checkbox>
                    </div>
                </el-form-item>
                <!-- 登录按钮 -->
                <el-form-item>
                    <el-button class="button" type="primary" auto-insert-space :loading="loading"
                        @click="employeeLogin">
                        <span v-if="!loading">登录</span>
                        <span v-else>登录中...</span>
                    </el-button>
                </el-form-item>
                <el-form-item class="flex">
                    <el-link type="primary" :underline="false">忘记密码？</el-link>
                </el-form-item>
            </el-form>
        </el-col>
    </el-row>
</template>

<style lang="scss" scoped>
/* 样式 */
.login-page {
    height: 100vh;
    background-color: #fff;

    .bg {
        background: url('@/assets/bright_milk2.png') no-repeat 50% center / 300px auto,
            url('@/assets/login_bg.jpg') no-repeat center / cover;
        border-radius: 0 20px 20px 0;

        .el-link {
            position: absolute;
            bottom: 10px;
            left: 10px;
            font-size: 14px;
        }
    }

    .form {
        display: flex;
        flex-direction: column;
        justify-content: center;
        user-select: none;

        .title {
            margin: 0 auto;
        }

        .button {
            width: 100%;
        }

        .flex {
            width: 100%;
            display: flex;
            justify-content: space-between;
        }
    }

    h1 {
        span {
            cursor: pointer;
            transition: color 0.2s;
        }

        .active {
            color: black;
        }

        span:not(.active) {
            color: grey;
        }
    }
}
</style>