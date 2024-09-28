import request from '@/utils/request.js'

export const createOrder = () => {
    return request({
        url: '/user/order/create',
        method: 'post'
    })
}

export const payOrder = (orderId) => {
    return request({
        url: '/user/order/pay',
        method: 'post',
        params:{id:orderId}
    })
}
export const getOrderById=(orderId)=>{
    return request({
        url: '/user/order',
        method: 'get',
        params:{id:orderId}
    })
}
export const pageQuery=(pageQueryData)=>{
    return request({
        url: '/user/order/page',
        method: 'get',
        params: pageQueryData
    })
}
export const deleteOrder=(orderId)=>{
    return request({
        url: '/user/order',
        method: 'delete',
        params:{id:orderId}
    })
}
export const adminPageQuery=(pageQueryData)=>{
    return request({
        url: '/admin/order/page',
        method: 'get',
        params: pageQueryData
    })
}










