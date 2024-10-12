import request from '@/utils/request.js';

export const getChartData = (params) => {
    return request({
        url: '/admin/statistics/charts',
        method: 'get',
        params: params
    }); 
}
//导出xlsx文件
export const exportChartData = (params) => {
    return request({
        url: `/admin/statistics/export/${params.type}`,
        method: 'get',
        params: {...params.dateRange},
        responseType: "blob"
    }); 
}


