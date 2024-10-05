import request from '@/utils/request.js';


export const milkPageQuery = (pageQueryData) => {
    return request({
        url: '/admin/milk/page',
        method: 'get',
        params: pageQueryData
    });
}

export const addMilk = (params) => {
    return request({
        url: '/admin/milk',
        method: 'post',
        data: {
            ...params
        }
    });
}
export const deleteMilk = (id) => {
    return request({
        url: '/admin/milk',
        method: 'delete',
        params: {
            id: id
        }
    });
}

export const updateMilk = (params) => {
    return request({
        url: '/admin/milk',
        method: 'put',
        data: {
            ...params
        }
    });
}

export const startOrStopMilk = (params) => {
    return request({
        url: `/admin/milk/status/${params.status}`,
        method: 'post',
        params: {
            id: params.id
        }
    });
};
export const getMilkById = (id) => {
    return request({
        url: `/admin/milk`,
        method: 'get',
        params: {
            id: id
        }
    });
}

export const getPackList = () => {
    return request({
        url: '/admin/milk/pack',
        method: 'get',
    })
}
export const addMilkAmount = (params) => {
    return request({
        url: `/admin/milk/addAmount/${params.amount}`,
        method: 'post',
        params: {
            id: params.id
        }
    })
}
export const userMilkPageQuery = (pageQueryData) => {
    return request({
        url: '/user/milk/page',
        method: 'get',
        params: pageQueryData
    })
}
export const getMilkInfo = (id) => {
    return request({
        url: '/user/milk/info',
        method: 'get',
        params: {
            id: id
        }
    })
}
export const getMilkDisInfo = (id) => {
    return request({
        url: `/admin/milk/milkDisDetail/${id}`,
        method: 'get',
    })
}
export const getMilkSaleDate = (params) => {
    return request({
        url: `/admin/milk/saleData/${params.id}`,
        method: 'get',
        params: {...params}
    })
}
export const getMilksSaleData = (date) => {
    return request({
        url: `/admin/milk/saleDataOfDay/${date}`,
        method: 'get',
    })
}



