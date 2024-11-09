<template>
    订奶管理
    <autocompleteInput v-model="text" style="width: 150px;" :load-data="loadData" @clear="clear" @select="select" focus
        clearable placeholder="请输入牛奶名称" />
    <autocompleteInput v-model="text" :load-data="loadData" @clear="clear" @select="select" clearable
        placeholder="输入提示" />
    <h2>{{ text }}</h2>
</template>
<script setup>
import autocompleteInput from '@/components/autocompleteInput.vue'
import { ElMessage } from 'element-plus';
import { ref, } from 'vue'
import { getAllMilkName } from '@/api/milk';
const text = ref('')

const select = (item) => {
    ElMessage('选择成功: ' + text.value) // 使用 text.value 获取值
}
const clear = () => {
}
const loadData = () => {
    return new Promise((resolve, reject) => {
        getAllMilkName().then(res => {
            const data = res.data.map(item => {
                return {
                    value: item,
                }
            })
            resolve(data)
        }).catch(err => {
            reject(err)
        })
    })
}
</script>