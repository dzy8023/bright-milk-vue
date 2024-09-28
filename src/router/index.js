import {
    createRouter,
    createWebHistory
} from 'vue-router'

//导入组件
import LoginVue from '@/views/Login.vue'
import AdminLayoutVue from '@/views/admin/Layout.vue'
import UserLayoutVue from '@/views/user/Layout.vue'
import NoFund from '@/views/NoFund.vue'
import {
    useTokenStore
} from '@/stores/token.js'


//定义路由关系
const routes = [
    {
        path: '/',
        redirect: '/login'
    },{
        path: '/login',
        component: LoginVue,
        meta: {
            title: '登录'
        }
    },
    {
        path: '/admin',
        component: AdminLayoutVue,
        redirect: '/admin/milk',
        children: [{
                path: '/admin/dashboard',
                component: () => import('@/views/admin/dashboard/index.vue'),
                meta: {
                    title: '工作台'
                }
            }, {
                path: '/admin/statistics',
                component: () => import('@/views/admin/chart/index.vue'),
                meta: {
                    title: '数据展示'
                }
            }, {
                path: '/admin/orders',
                component: () => import('@/views/admin/orders/orders.vue'),
                meta: {
                    title: '订单管理'
                }
            }, {
                path: '/admin/orderMilk',
                component: () => import('@/views/admin/orders/orderMilk.vue'),
                meta: {
                    title: '订奶管理'
                }
            }, {
                path: '/admin/milk',
                component: () => import('@/views/admin/milk/milk.vue'),
                meta: {
                    title: '牛奶管理'
                }
            },
            {
                path: '/admin/milk/add',
                component: () => import('@/views/admin/milk/addMilk.vue'),
                meta: {
                    title: '添加牛奶'
                }
            }, {
                path: '/admin/category',
                component: () => import('@/views/admin/category/category.vue'),
                meta: {
                    title: '分类管理'
                }

            }, {
                path: '/admin/employee',
                component: () => import('@/views/admin/employee/employee.vue'),
                meta: {
                    title: '员工管理'
                }

            }, {
                path: '/admin/employee/add',
                component: () => import('@/views/admin/employee/employeeAdd.vue'),
                meta: {
                    title: '添加员工'
                }
            }, {
                path: '/admin/user',
                component: () => import('@/views/admin/user/user.vue'),
                meta: {
                    title: '用户管理'
                }
            }, {
                path: '/admin/info',
                component: () => import('@/views/admin/employee/info.vue'),
                meta: {
                    title: '员工信息'
                }
            },
        ]
    },
    {
        path: '/user',
        component: UserLayoutVue,
        redirect: '/user/shop',
        children: [{
            path: '/user/shop',
            component: () => import('@/views/user/shop.vue'),
            meta: {
                title: '光明商城'
            }
        }, {
            path: '/user/shoppingCart',
            component: () => import('@/views/user/shoppingCart.vue'),
            meta: {
                title: '购物车'
            }
        }, {
            path: '/user/order',
            component: () => import('@/views/user/order.vue'),
            meta: {
                title: '我的订单'
            }
        }]
    },
    {
        path: "/404",
        component: NoFund,
        meta:{
            title:'网页不存在'
        }
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: "/404",
    }
]
//创建路由器
const router = createRouter({
    history: createWebHistory(),
    routes: routes
})

router.beforeEach((to, from, next) => {
    const tokenStore = useTokenStore();
    if (tokenStore.token) {
        next();
    } else {
        if (to.path !== '/login' && to.path !== '/404') {
            next('/login')
        } else {
            next()
        }
    }
})
router.afterEach((to) => {
    document.title = to.meta.title || '默认标题'
})
export default router