<template>
    <div class="HeadLable">
        <span class="goBack" @click="$router.back()"> <el-icon>
                <Back />
            </el-icon>返回</span>
        <span>{{ title }}</span>
    </div>
    <el-card>
        <el-form ref="ruleForm" :model="employee" :rules="rules" :inline="false" label-width="120px">
            <el-form-item prop="username" label="账号:">
                <el-input placeholder="请输入账号" v-model="employee.username"></el-input>
            </el-form-item>
            <el-form-item prop="name" label="员工姓名:">
                <el-input placeholder="请输入员工姓名" v-model="employee.name"></el-input>
            </el-form-item>
            <el-form-item prop="phone" label="电话号码:">
                <el-input placeholder="请输入电话号码" v-model="employee.phone"></el-input>
            </el-form-item>
            <el-form-item label="性别" prop="sex">
                <el-radio v-model="employee.sex" label="1">男</el-radio>
                <el-radio v-model="employee.sex" label="2">女</el-radio>
            </el-form-item>
            <el-form-item prop="idNumber" label="身份证号:">
                <el-input placeholder="请输入身份证号" v-model="employee.idNumber"></el-input>
            </el-form-item>
        </el-form>
        <el-row>
            <el-button @click="$router.back()">
                取消
            </el-button>
            <el-button type="primary" :class="{ continue: actionType === 'add' }" @click="submitForm()">
                保存
            </el-button>
            <el-button v-if="actionType == 'add'" type="primary" @click="submitForm('goAnd')">
                保存并继续添加
            </el-button>
        </el-row>
    </el-card>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Back } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router';
const router = useRouter()
import { addEmployee, updateEmployee, getEmployeeById } from '@/api/employee'

const title = ref('')
const ruleForm = ref(null)
//添加校验规则
const rules = {
    username: [
        { required: true, message: '请输入账号', trigger: 'blur' },
        { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
    ],
    name: [
        { required: true, message: '请输入员工姓名', trigger: 'blur' },
        { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
    ],
    phone: [
        {
            required: true, validator: (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入手机号'))
                } else if (!/^1[3456789]\d{9}$/.test(value)) {
                    callback(new Error('请输入正确的手机号'))
                } else {
                    callback()
                }
            }, trigger: 'blur'
        }
    ],
    idNumber: [
        {
            required: true, validator: (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入身份证号'))
                } else if (!/(^\d{15}$)|(^\d{18}$)|(^\d{17}(x|X)$)/.test(value)) {
                    callback(new Error('请输入正确的身份证号码'))
                } else {
                    callback()
                }
            }, trigger: 'blur'
        }
    ]
}
const employee = ref({
    id: '',
    username: '',
    name: '',
    phone: '',
    sex: '1',
    idNumber: ''
})
//创建时先判断是新增还是编辑
const actionType = ref('add')
const init = async () => {
    clearEmployee()
    const id = router.currentRoute.value.query?.id;
    title.value = "新增员工"
    if (id) {
        title.value = "编辑员工"
        actionType.value = 'edit'
        const res = await getEmployeeById(id)
        employee.value = res.data
    }
}
// 组件挂载时调用初始化函数
onMounted(() => {
    init()
})
const submitForm = async (goAnd) => {
    console.log(employee.value)
    await ruleForm.value.validate(async (valid) => {
        if (valid) {
            if (actionType.value === 'add') {
                addEmployee(employee.value).then(res => {
                    console.log(res)
                    ElMessage.success('新增成功')
                    if (goAnd !== 'goAnd') {
                        router.back()
                    }
                })
            } else {
                updateEmployee(employee.value).then(res => {
                    console.log(res)
                    ElMessage.success('编辑成功')
                    router.back()
                })
            }
            clearEmployee()
        } else {
            ElMessage.info('校验失败')
            console.log("校验失败")
        }
    })
}
const clearEmployee = () => {
    employee.value = {
        id: '',
        username: '',
        name: '',
        phone: '',
        sex: '1',
        idNumber: ''
    }
}
</script>
<style scoped lang="scss">
.HeadLable {
    // position: absolute;
    background: #f5f5f5;
    color: #333333;
    height: 48px;
    font-size: 18px;
    // width: 300px;
    padding-left: 22px;
    line-height: 64px;
    font-weight: 700;
    margin-bottom: 15px;
    top: 0px;
    left: 0px;
    opacity: 0;
    animation: opacity 200ms ease-out 500ms forwards;
    .goBack {
        border-right: solid 1px #d8dde3;
        padding-right: 14px;
        margin-right: 14px;
        font-size: 16px;
        color: #333333;
        cursor: pointer;
        font-weight: 400;
    }
}
.container {
      position: relative;
      z-index: 1;
      background: #fff;
      padding: 15px;
      border-radius: 4px;
    }
    .idNumber {
      margin-bottom: 39px;
    }
    .el-form-item {
      margin-bottom: 29px;
    }
    .el-input {
      width: 293px;
    }
    .el-row {
    .el-button:first-child {
        margin-left: 120px;
    }
}
@keyframes opacity {
    0% {
        opacity: 0;
        left: 80px;
    }

    100% {
        opacity: 1;
        left: 0;
    }
}
</style>