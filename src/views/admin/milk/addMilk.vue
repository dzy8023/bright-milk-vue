<template>
    <el-card>
        <el-form ref="ruleForm" :model="milkModel" :rules="rules" :inline="true" label-width="120px">
            <el-row>
                <el-col :span="6">
                    <el-form-item label="牛奶名称:" prop="name">
                        <el-input clearable v-model="milkModel.name" placeholder="请输入牛奶名称" />
                    </el-form-item>
                </el-col>
                <el-col :span="14">
                    <el-form-item label="分类类型" prop="type">
                        <el-select clearable @change="typeChangeHandel" v-model="milkModel.type" placeholder="请选择分类">
                            <el-option v-for="item in typeOption" :label="item.label" :value="item.value" :key="item.value" >
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="6">
                    <el-form-item label="牛奶分类:" prop="categoryId">
                        <el-select clearable v-model="milkModel.categoryId" value-key="value"
                            @change="this.$forceUpdate()" placeholder="请选择牛奶分类">
                            <el-option v-for="item in categoryOption" :key="item.value" :label="item.label"
                                :value="item.value" />
                        </el-select>
                    </el-form-item></el-col>
                <el-col :span="14">
                    <el-form-item label="牛奶价格:" prop="price">
                        <el-input clearable v-model="milkModel.price" placeholder="请设置菜品价格" />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="6">
                    <el-form-item label="包装类型:" prop="packId">
                        <el-select clearable v-model="milkModel.packId" placeholder="请选择包装类型">
                            <el-option v-for="item in packOption" :key="item.value" :label="item.label"
                                :value="item.value" />
                        </el-select>
                    </el-form-item></el-col>
                <el-col :span="14">
                    <el-form-item label="规格(ml):" prop="standard">
                        <el-input clearable v-model="milkModel.standard" placeholder="请设置牛奶规格" />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-form-item label="牛奶图片:" prop="image">
                    <el-upload class="img-uploader" action="/api/admin/common/upload"
                        :headers="{ 'token': tokenStore.token }" :data="{ 'type': 'milk' }" :show-file-list="false"
                        :on-success="handleImgSuccess" :before-upload="beforeImgUpload">
                        <img v-if="milkModel.image" :src="milkModel.image" class="image" />
                        <el-icon v-else class="img-uploader-icon">
                            <Plus />
                        </el-icon>
                    </el-upload>
                </el-form-item>
            </el-row>
            <el-row>
                <el-col>
                    <el-button type="danger" :icon="Delete" size="large" @click="handleDeleteImg">
                        删除图片
                    </el-button>
                </el-col>
            </el-row>
            <el-row>
                <el-col>
                    <el-form-item label="牛奶描述:" prop="description">
                        <el-input v-model="milkModel.description" style="width: 400px;" type="textarea" :rows="5"
                            maxlength="200" placeholder="菜品描述，最长200字" />
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <el-row>
            <el-button @click="handleCancel">
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
import { useTokenStore } from '@/stores/token';
import { Plus, Delete,  } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router';
const router = useRouter()
const tokenStore = useTokenStore()
import { getPackList, addMilk, updateMilk, getMilkById } from '@/api/milk'
import { categoryList } from '@/api/category';
import { delImg } from '@/api/common';

const ruleForm = ref(null)
//添加校验规则
const rules = {
    name: [
        { required: true, message: '请输入分类名称', trigger: 'blur' },
        { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
    ],
    categoryId: [
        { required: true, message: '请输入分类别名', trigger: 'blur' },
    ],
    price: [
        {
            required: true,
            // 'message': '请填写菜品价格',
            validator: (rules, value, callback) => {
                const reg = /^([1-9]\d{0,5}|0)(\.\d{1,2})?$/
                if (!reg.test(value) || Number(value) <= 0) {
                    callback(
                        new Error(
                            '牛奶价格格式有误，请输入大于零且最多保留两位小数的金额'
                        )
                    )
                } else {
                    callback()
                }
            },
            trigger: 'blur'
        }
    ],
    image: [
        { required: true, message: '请上传牛奶图片', trigger: 'blur' },
    ],
    type: [
        { required: true, message: '请输入分类类型', trigger: 'blur' },
    ],
    standard: [
        {
            required: true,
            // 'message': '请填写菜品价格',
            validator: (rules, value, callback) => {
                const reg = /^([1-9]\d{0,4}|0)?$/
                if (!reg.test(value) || Number(value) <= 0) {
                    callback(
                        new Error(
                            '牛奶规格格式有误，请输入最多保留5位数的正整数'
                        )
                    )
                } else {
                    callback()
                }
            },
            trigger: 'blur'
        }
    ],
    packId: [
        { required: true, message: '请输入包装方式', trigger: 'blur' },
    ]
}
const milkModel = ref({
    id: '',
    name: '',
    type: '',
    categoryId: '',
    price: '',
    standard: '',
    packId: '',
    image: '',
    description: '',
})
const typeOption = ref([{
    label: '低温奶',
    value: '1'
}, {
    label: '常温奶',
    value: '2'
}])
const categoryOption = ref([])
const packOption = ref([])
//创建时先判断是新增还是编辑
const actionType = ref('add')
const init = async () => {
    clearMilkModel()
    const id = router.currentRoute.value.query?.id;
    //获取包装数据
    await getPackList().then(res => {
        transformData(res, packOption)
    })
    if (id) {
        ElMessage.success('编辑')
        actionType.value = 'edit'
        const res = await getMilkById(id)
        milkModel.value = res.data
        //数据类型要与categoryOption与typeOption中对应的字段类型一致
        milkModel.value.type = milkModel.value.type.toString()
        milkModel.value.categoryId = milkModel.value.categoryId.toString()
        milkModel.value.packId=milkModel.value.packId.toString()
        //获取分类数据
        const cRes = await categoryList(res.data.type)
        transformData(cRes, categoryOption)
        oldImg.value = milkModel.value.image
    }
}
const transformData = (res, obj) => {
    obj.value = []
    for (let i = 0; i < res.data.length; i++) {
        obj.value.push({
            label: res.data[i].name,
            //类型要与milkModel中对应的字段类型一致
            value: res.data[i].id.toString()
        })
    }
}
const typeChangeHandel = async () => {
    const res = await categoryList(milkModel.value.type)
    transformData(res, categoryOption)
    milkModel.value.categoryId = ''
}

// 组件挂载时调用初始化函数
onMounted(() => {
    init()
})
const submitForm = async (goAnd) => {
    console.log(milkModel.value)
    await ruleForm.value.validate(async (valid) => {
        if (valid) {
            console.log("校验通过")
            if (milkModel.value.image !== oldImg && oldImg !== '') {
                await delImg(oldImg.image)
            }
            if (actionType.value === 'add') {
                addMilk(milkModel.value).then(res => {
                    console.log(res)
                    ElMessage.success('新增成功')
                    if (goAnd !== 'goAnd') {
                        router.push('/admin/milk')
                    }
                    milkModel.value.image = ''
                    milkModel.value.name = ''
                })
            } else {
                updateMilk(milkModel.value).then(res => {
                    console.log(res)
                    ElMessage.success('编辑成功')
                    router.push('/admin/milk')
                })
            }
        } else {
            ElMessage.info('校验失败')
            console.log("校验失败")
        }
    })
}
const handleCancel = async () => {
    if (milkModel.value.image !== '' && milkModel.value.image!==oldImg.value) {
        await delImg(milkModel.value.image)
    }
    router.back()
}
const oldImg = ref('')
const beforeImgUpload = (rawFile) => {
    if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png' && rawFile.type !== 'image/gif') {
        ElMessage.error('Milk picture must be JPG format!')
        return false
    } else if (rawFile.size / 1024 / 1024 > 5) {
        ElMessage.error('Milk picture size can not exceed 5MB!')
        return false
    }
    return true
}
const handleImgSuccess = async (res) => {
    ElMessage.success("上传成功")
    console.log(res)
    if (oldImg !== milkModel.value.image) {
        await delImg(milkModel.value.image)
    }
    milkModel.value.image = res.data
}

const handleDeleteImg = async () => {
    milkModel.value.image = ''
}

const clearMilkModel = () => {
    milkModel.value = {
        id: '',
        name: '',
        type: '',
        categoryId: '',
        price: '',
        standard: '',
        packId: '',
        image: '',
        description: '',
    }
}
</script>
<style scoped lang="scss">
.el-row {
    .el-col {
        margin-bottom: 5px;
    }

    .el-form-item {
        //靠左
        float: left;
    }

    .el-select {
        width: 150px
    }

    .el-input {
        width: 150px
    }

    .el-button:first-child {
        margin-left: 120px;
    }
}
</style>
<style scoped>
.img-uploader .image {
    width: 178px;
    height: 178px;
    display: block;
}
</style>
<style>
.img-uploader .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
}

.img-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
}

.el-icon.img-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    text-align: center;
}
</style>