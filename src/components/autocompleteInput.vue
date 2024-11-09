<template>
    <el-autocomplete v-if="props.focus" ref="inputFocusOn" v-model="internalValue" :fetch-suggestions="querySearch"
        :clearable="clearable" :popper-class="noResults ? 'platform-auto-complete' : ''" @clear="handleClear"
        class="inline-input" @keyup.enter="handleSelect(internalValue)" :placeholder="placeholder" :debounce="500"
        @select="handleSelect" @focus="handleFocus">
        <template v-slot:empty v-if="noResults">
            <el-empty description="empty" />
        </template>
    </el-autocomplete>
    <el-autocomplete v-else ref="inputFocusOn" v-model="internalValue" :fetch-suggestions="querySearch"
        :clearable="clearable" :popper-class="noResults ? 'platform-auto-complete' : ''" :trigger-on-focus="false"
        class="inline-input" @keyup.enter="handleSelect(internalValue)" @clear="handleClear" :placeholder="placeholder"
        :debounce="500" @select="handleSelect" @focus="handleFocus">
        <template v-slot:empty v-if="noResults">
            <el-empty description="empty" />
        </template>
    </el-autocomplete>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

// 定义餐厅项的接口
interface RestaurantItem {
    value: string; // 必需的属性
    [key: string]: any; // 允许其他任意属性
}

// 定义 Props 接口
interface Props {
    modelValue: string; // 接收父组件的值
    placeholder?: string; // 接收 placeholder 属性
    focus?: boolean; // 接收 focus 属性
    clearable?: boolean; // 接收 clearable 属性
    loadData?: () => Promise<RestaurantItem[]>; // 修改为返回 Promise 的函数
}

// 使用 defineProps 定义 props
const props = defineProps<Props>()

const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void;
    (e: 'select', item: RestaurantItem): void; // 更新 item 的类型
    (e: 'clear'): void,
}>()

const internalValue = ref<string>(props.modelValue) // 用于第一个输入框的内部值
const noResults = ref<boolean>(false)
const inputFocusOn = ref<any>(null)

// 监听 props 的变化，更新内部值
watch(() => props.modelValue, (newValue) => {
    internalValue.value = newValue
})
const handleClear = () => {
    emit('update:modelValue', '') // 更新父组件的值
    emit('clear')
}
const handleSelect = (item: RestaurantItem | string) => {
    inputFocusOn.value?.blur()
    if (typeof item === 'string') {
        emit('update:modelValue', item) // 更新父组件的值
        emit('select', { value: item }) // 触发 select 事件
    } else {
        emit('update:modelValue', item.value) // 更新父组件的值
        emit('select', item) // 触发 select 事件 
    }
}
const restaurants = ref<RestaurantItem[]>([]) // 存储餐厅数据

const querySearch = (queryString: string, cb: (results: RestaurantItem[]) => void) => {
    const results = queryString
        ? restaurants.value.filter(createFilter(queryString))
        : restaurants.value
    noResults.value = results.length === 0
    cb(results.length === 0 ? [{ value: '无匹配数据' }] : results)
}

const createFilter = (queryString: string) => {
    return (restaurant: RestaurantItem) => {
        return (
            restaurant.value.toLowerCase().includes(queryString.toLowerCase())
        )
    }
}
const handleFocus = () => {
    if (restaurants.value.length === 0) { // 确保只加载一次
        props.loadData?.().then((data) => {
            restaurants.value = data
        }).catch((error) => {
            restaurants.value = loadAll() // 加载所有餐厅数据
        })
    }
}
const loadAll = () => {
    return [
        { value: 'vue', link: 'https://github.com/vuejs/vue', description: 'A progressive framework for building user interfaces.' },
        { value: 'element', link: 'https://github.com/ElemeFE/element', description: 'A Vue 2.0 UI Toolkit for Web.' },
        { value: 'cooking', link: 'https://github.com/ElemeFE/cooking', description: 'A CLI for building Vue.js applications.' },
        { value: 'mint-ui', link: 'https://github.com/ElemeFE/mint-ui', description: 'A mobile UI toolkit for Vue.js.' },
        { value: 'vuex', link: 'https://github.com/vuejs/vuex', description: 'State management pattern + library for Vue.js applications.' },
        { value: 'vue-router', link: 'https://github.com/vuejs/vue-router', description: 'The official router for Vue.js.' },
        { value: 'babel', link: 'https://github.com/babel/babel', description: 'A JavaScript compiler.' },
    ]
}
</script>

<style lang="scss">
.platform-auto-complete {
    .el-autocomplete-suggestion__wrap {
        padding: 5px 0;
        ul li {
            pointer-events: none; // 阻止可点击事件
            .default {
                text-align: center;
                color: #999;
            }

            &:hover {
                background-color: #fff;
            }
        }
    }
}
</style>
