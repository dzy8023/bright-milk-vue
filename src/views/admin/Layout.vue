<template>
    <!-- element-plus容器 -->
    <el-container class="layout-container">
        <!-- 左侧菜单 -->
        <el-aside width="200px">
            <div class="el-aside__logo"></div>
            <!-- element-plus菜单标签 -->
            <el-menu active-text-color="#ffd04b" background-color="#232323" text-color="#fff" router
                :default-active="def">
                <!-- 菜单项 -->
                <el-menu-item index="/admin/dashboard">
                    <el-icon>
                        <DataBoard />
                    </el-icon>
                    <span>工作台1</span>
                </el-menu-item>
                <el-menu-item index="/admin/statistics">
                    <el-icon>
                        <DataAnalysis />
                    </el-icon>
                    <span>数据统计1</span>
                </el-menu-item>
                <el-menu-item index="/admin/orders">
                    <el-icon>
                        <List />
                    </el-icon>
                    <span>订单管理</span>
                </el-menu-item>
                <el-menu-item index="/admin/orderMilk">
                    <el-icon>
                        <Tickets />
                    </el-icon>
                    <span>订奶管理</span>
                </el-menu-item>
                <el-menu-item index="/admin/milk">
                    <el-icon>
                        <Goods />
                    </el-icon>
                    <span>牛奶管理</span>
                </el-menu-item>
                <el-menu-item index="/admin/category">
                    <el-icon>
                        <Management />
                    </el-icon>
                    <span>分类管理</span>
                </el-menu-item>
                <!-- 子菜单 -->
                <el-sub-menu index="1">
                    <template #title>
                        <el-icon>
                            <UserFilled />
                        </el-icon>
                        <span>个人中心</span>
                    </template>
                    <el-menu-item index="/admin/employee">
                        <el-icon>
                            <User />
                        </el-icon>
                        <span>员工管理</span>
                    </el-menu-item>
                    <el-menu-item index="/admin/user">
                        <el-icon>
                            <Crop />
                        </el-icon>
                        <span>用户管理</span>
                    </el-menu-item>
                </el-sub-menu>
            </el-menu>
        </el-aside>
        <!-- 右侧主区域 -->
        <el-container>
            <!-- 头部区域 -->
            <el-header>
                <div class="employee-status">
                    <div class="employee-info">
                        <span class="employee-name">{{ adminInfoStore.info.name }}</span>
                    </div>
                    <div class="notification-switch">
                        <span class="switch-label">消息通知</span>
                        <el-switch v-model="notice" :before-change="handleNoticeChange" class="custom-switch"
                            inline-prompt :loading="switchLoading" :active-action-icon="Bell"
                            :inactive-action-icon="MuteNotification" />
                    </div>
                </div>

                <!-- 下拉菜单 -->
                <!-- command:条目被点击后会触发，在事件函数上可以声明一个参数，接收条目对应指令 -->
                <el-dropdown placement="bottom-end" @command="handleCommand">
                    <span class="el-dropdown__box">
                        <div class="userName_box">{{ adminInfoStore.info.userName ? adminInfoStore.info.userName : '用户名'
                            }}
                        </div>
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item command="resetPassword" :icon="EditPen">修改密码</el-dropdown-item>
                            <el-dropdown-item command="logout" :icon="SwitchButton">退出登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
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
                        <el-input v-model="form.oldPassword" type="password" placeholder="请输入" clearable
                            show-password></el-input>
                    </el-form-item>
                    <el-form-item label="新密码：" prop="newPassword">
                        <el-input v-model="form.newPassword" type="password" placeholder="6 - 20位密码，数字或字母，区分大小写"
                            clearable show-password></el-input>
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
            <el-footer>光明牛奶订购系统 ©2024</el-footer>
        </el-container>
    </el-container>
</template>

<script setup>
import {
    Management,
    UserFilled,
    User,
    Crop,
    EditPen,
    SwitchButton,
    DataBoard,
    DataAnalysis,
    List,
    Goods,
    MuteNotification,
    Bell,
    Tickets
} from '@element-plus/icons-vue';

import { useAdminInfoStore } from '@/stores/adminInfo.js';
const adminInfoStore = useAdminInfoStore();
import { useTokenStore } from '@/stores/token.js';
const tokenStore = useTokenStore();
import { ElMessageBox, ElMessage, ElNotification } from 'element-plus';
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();
import { editPassword, unsubscribeNotice } from '@/api/employee';
import { h } from 'vue'
import { EventSourcePolyfill } from 'event-source-polyfill';

const def = ref(router.currentRoute.value.path); // 初始化为当前路由路径
const visible = ref(false);
const notice = ref(false);
const eventSource = ref(null);
const switchLoading = ref(false);
const index=["/admin/dashboard","/admin/statistics","/admin/orders","/admin/orderMilk","/admin/milk","/admin/category","/admin/employee","/admin/user"]

//使用sse
const initSSE = () => {
    return new Promise((resolve, reject) => {
        eventSource.value = new EventSourcePolyfill('/api/admin/sse/subscribe', {
            headers: {
                'Token': tokenStore.token
            }
        });
        eventSource.value.onopen = (event) => {
            console.log('连接成功');
            resolve(true);
        };
        eventSource.value.onmessage = (event) => {
            try {
                console.log('接收到消息:', event);
                const data = JSON.parse(event.data);
                ElNotification({
                    title: `用户 【${data.publisherId}】`,
                    message: h('div', [h('span', { style: 'color: teal' }, `发布消息：`), data.message,
                     h('br'), h('span', { style: 'color: teal' }, `发布时间：`),data.publishTime
                    ]),
                    duration: 2000
                });
            } catch (error) {
                console.error('解析消息失败:', error);
            }
        };
        eventSource.value.onerror = (error) => {
            console.error('SSE 错误:', error);
            notice.value = false;
            eventSource.value.close();
            eventSource.value = null;
            reject(error);
        };
    });
};

const closeSSE = () => {
    if (eventSource.value) {
        eventSource.value.close();
        unsubscribeNotice().then((res) => {
            console.log('连接关闭');
        })
        eventSource.value = null;
    }
}

const handleNoticeChange = () => {
    switchLoading.value = true;
    return new Promise((resolve, reject) => {
        const delay = 1000 + Math.random() * 1500; // 1.5-2.5秒的随机延迟
        setTimeout(() => {
            switchLoading.value = false;
            if (!notice.value) {
                initSSE().then(() => {
                    resolve(true);
                }).catch((error) => {
                    ElMessage.error('连接失败');
                    reject(error);
                });
            } else {
                closeSSE();
                resolve(true);
            }
        }, delay);
    });
}

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
            adminInfoStore.removeInfo(); // 清空用户信息
            // 2.跳转到登录页面
            router.push('/login');
            ElMessage({
                type: 'success',
                message: '退出成功',
            });
        }).catch(() => {
            ElMessage({
                type: 'info',
                message: '操作取消',
            });
        });
    } else if (command === 'resetPassword') {
        visible.value = true;
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
});

const form = ref({
    oldPassword: '',
    newPassword: '',
    affirmPassword: '',
});
const handlePwdClose = () => {
    visible.value = false;
    formRef.value.resetFields();
};
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
    if (!notice.value) {
        switchLoading.value = true;
        setTimeout(() => {
            switchLoading.value = false;
            initSSE().then(()=>{
                notice.value = true;
            }).catch((error) => {
                ElMessage.error('连接失败');
            });
        }, 1000);
    }
});
onUnmounted(() => {
    closeSSE();
});

// 监听路由变化
watch(() => router.currentRoute.value.path, (newPath) => {
    if(index.includes(newPath)){
    def.value = newPath; // 更新选中的菜单项
    }
});
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

.layout-container {
    height: 100vh;

    .el-aside {
        background-color: #232323;

        &__logo {
            height: 120px;
            background: url('@/assets/bright_milk.png') no-repeat center / 120px auto;
        }

        .el-menu {
            border-right: none;
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

.employee-status {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 10px 20px;
}

.employee-info {
    font-size: 20px;
    font-weight: bold;
    color: #333;
    margin-right: 20px;
}

.notification-switch {
    display: flex;
    align-items: center;
    background-color: #ffffff;
    padding: 6px 15px;
    border-radius: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    .switch-label {
        font-size: 16px;
        font-weight: 500;
        color: #333;
        margin-right: 12px;
    }

    .custom-switch {
        --el-switch-on-color: #4caf50;
        --el-switch-off-color: #989494;
        transform: scale(1.5); // 稍微放大开关
    }
}

// 响应式设计
@media (max-width: 768px) {
    .employee-status {
        flex-direction: column;
        align-items: flex-start;
        padding: 15px;
    }

    .employee-title {
        margin-bottom: 10px;
    }

    .notification-switch {
        width: 100%;
        justify-content: space-between;
    }
}
</style>