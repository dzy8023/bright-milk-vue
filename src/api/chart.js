import request from '@/utils/request.js';

export const getChartData = (params) => {
    return request({
        url: '/admin/statistics/charts',
        method: 'get',
        params: params
    }); 
}









