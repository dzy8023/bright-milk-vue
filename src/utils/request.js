//定制请求的实例

//导入axios  npm install axios
import axios from 'axios';
import {
    ElMessage
} from 'element-plus'
//定义一个变量,记录公共的前缀  ,  baseURL
// const baseURL = 'http://localhost:8080';

const baseURL = '/api';
const instance = axios.create({
    baseURL
})

//导入token状态
import {
    useTokenStore
} from "@/stores/token.js";
//添加请求拦截器
instance.interceptors.request.use(
    (config) => {
        //请求前的回调
        //添加token
        const tokenStore = useTokenStore();
        //判断有没有token
        if (tokenStore.token) {
            config.headers.token = tokenStore.token;
        } 
        return config;
    }, (err) => {
        //请求错误的回调
        Promise.reject(err);
    }
)
//不能这样导入
// import { useRoute } from 'vue-router';
// const router=useRoute();
import router from '@/router/index.js';

//添加响应拦截器
instance.interceptors.response.use(
    result => {
        //判断业务状态码
        if (result.data.code !== 0) {
            //放行blob响应
            return result.data instanceof Blob ? result : result.data; // 修改此行
        }
        //操作失败
        // // alert(result.data.message?result.data.message:'操作失败');
        ElMessage.error(result.data.msg ? result.data.msg : '操作失败');
        // //异步操作的状态转换为失败
        return Promise.reject(result.data);
    },
    err => {
        //判断响应状态码，如果为401，则未登录，跳转到登陆界面
        if (err.response.status === 401) {
            ElMessage.error("请先登录");
            router.push('/login');
        } else {
            ElMessage.error('服务异常');
        }
        return Promise.reject(err); //异步的状态转化成失败的状态
    }
)


export default instance;
