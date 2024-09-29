<template>
    <div v-infinite-scroll="onLazyLoad" :infinite-scroll-disabled="false" :infinite-scroll-immediate="false">
        <el-row :gutter="20">
            <el-col :span="6" v-for="milk in milks" :key="milk.id">
                <el-card :body-style="{ padding: '20px' }">
                    <div class="milk-image" @click="showMilkDetails(milk)"><el-image
                            style=" border: none; cursor: pointer" :src="milk.image">
                            <template #error>
                                <div class="image-slot">
                                    <img :src="noImage" style=" border: none">
                                </div>
                            </template>
                        </el-image></div>

                    <div class="milk-info">
                        <h4 @click="showMilkDetails(milk)">牛奶名称: <span>{{ milk.name }}</span></h4>
                        <el-row>
                            <el-col :span="12">
                                <p>牛奶分类: {{ milk.categoryName }}</p>
                            </el-col>
                            <p>包装类型: {{ milk.packName }}</p>
                        </el-row>
                        <p>价格: ¥{{ milk.price }}</p>
                    </div>
                    <div class="milk-actions">
                        <el-input-number style="width: 100px;" v-model="milk.quantity" :min="1" :max="99"
                            @change="updateQuantity(milk, $event)">
                        </el-input-number>
                        <el-button type="success" @click="addToCart(milk)">添加到购物车</el-button>
                    </div>
                </el-card>
            </el-col>
            <template #empty>
                <el-empty description="没有数据" />
            </template>
        </el-row>
        <p class="textP" v-if="pageQueryData.loading">加载中...</p>
        <p class="textP" v-if="pageQueryData.finished">没有更多了</p>
        <p class="textP" v-if="pageQueryData.error">加载失败，请重试</p>
        <el-dialog v-model="dialogVisible" style="width: 400px;" title="商品详情">
            <div v-if="milkInfo">
                <el-image class="detail-image" :zoom-rate="5" :max-scale="10" :min-scale="0.2"
                    :hide-on-click-modal="true" :preview-src-list="[milkInfo.image]"
                    style=" border: none; cursor: pointer" :src="milkInfo.image">
                    <template #error>
                        <div class="image-slot">
                            <img :src="noImage" style=" border: none">
                        </div>
                    </template>
                </el-image>
                <h3>商品名称: {{ milkInfo.name }}</h3>
                <p>商品分类: {{ milkInfo.type }}</p>
                <p>商品类型: {{ milkInfo.categoryName }}</p>
                <p>包装类型: {{ milkInfo.packName }}</p>
                <p>规格: {{ milkInfo.standard }} ml</p>
                <p>价格: ¥{{ milkInfo.price }}</p>
                <p>描述: {{ milkInfo.description }}</p>
            </div>
            <template #footer>
                <el-button @click="dialogVisible = false">关闭</el-button>
            </template>
            <!-- <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">关闭</el-button>
            </span> -->
        </el-dialog>
    </div>
</template>

<script setup>
import noImage from '@/assets/noImg.png'
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import { userMilkPageQuery, getMilkInfo } from '@/api/milk';
import { addShoppingCart } from '@/api/shoppingCart';
const pageQueryData = ref({
    page: 1,
    pageSize: 10,
})
const type = ref([
    {
        name: '低温奶',
        id: 1
    }, {
        name: '常温奶',
        id: 2
    }
])
// 示例商品数据
const milks = ref([]);

const milkInfo = ref({
    id: '',
    name: '',
    categoryName: '',
    price: '',
    packName: '',
    image: '',
    standard: '',
    description: '',
    type: '',
});

const dialogVisible = ref(false);

const showMilkDetails = (milk) => {
    getMilkInfo(milk.id).then(res => {
        // 赋值基础信息
        milkInfo.value = {
            ...milk,
            standard: res.data.standard,
            description: res.data.description,
            type: '', // 初始化为空字符串，后面再匹配类型名称
        };
        // 匹配类型名称
        for (let i = 0; i < type.value.length; i++) {
            if (type.value[i].id === res.data.type) {
                milkInfo.value.type = type.value[i].name;
                break;
            }
        }
    });

    dialogVisible.value = true;
};
const addToCart = (milk) => {
    // 调用添加到购物车的接口
    addShoppingCart({
        milkId: milk.id,
        number: milk.quantity,
    }).then(() => {
        ElMessage.success(`${milk.name} (数量: ${milk.quantity}) 已添加到购物车`);
        milk.quantity = 1; // 添加成功后重置数量为1
    }).catch((err) => {
        console.error(err);
        ElMessage.error(err.msg ? err.msg : '添加到购物车失败');
    });
};

const updateQuantity = (milk, quantity) => {
    milk.quantity = quantity;
};
const pageQuery = async () => {
    pageQueryData.value.loading = true;
    try {
        const res = await userMilkPageQuery({ page: pageQueryData.value.page, pageSize: pageQueryData.value.pageSize });
        if (!res.data.records || res.data.records.length === 0) {
            pageQueryData.value.finished = true;
        } else {
            let temp = res.data.records;
            temp.forEach(milk => {
                milk.quantity = 1;
            });
            milks.value = milks.value.concat(temp);
            if (res.data.records.length < pageQueryData.value.pageSize) {
                pageQueryData.value.finished = true;
            }
        }
    } catch (error) {
        pageQueryData.value.error = true;
    } finally {
        pageQueryData.value.loading = false;
    }
};

pageQuery()
const onLazyLoad = () => {
    pageQueryData.loading = true
    if (!pageQueryData.finished) {
        pageQueryData.value.page++
        pageQuery()
    }
}
</script>

<style scoped>
.textP {
    /* 居中 */
    text-align: center;
    ;
    margin: 10px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;
}

.milk-card {
    margin: 10px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;
}

.milk-image {
    width: 100%;
    height: 150px;
    object-fit: cover;
}

.milk-info {
    padding: 10px 0;
}

.detail-image {
    width: 100%;
    height: 200px;
    object-fit: cover;
}

.milk-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.milk-actions .el-button {
    margin-left: 10px;
}
</style>