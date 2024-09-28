import request from '@/utils/request.js';

export const categoryPageQuery = (pageQueryData) => {
    return request({
        url: '/admin/category/page',
        method: 'get',
        params: pageQueryData});
};
export const startOrStopCategory= (params) => {
    return request({
        url: `/admin/category/status/${params.status}`,
        method: 'post',
        params: {id: params.id}
    });
};
export const deleteCategory = (id) => {
    return request({
        url: `/admin/category`,
        method: 'delete',
        params: {id: id}
    });
};
export const addCategory = (params) => {
    return request({
        url: `/admin/category`,
        method: 'post',
        data: {...params}
    });
};
export const updateCategory = (params) => {
    return request({
        url: `/admin/category`,
        method: 'put',
        data: {...params}
    });
};
export const categoryList = (type) => {
    return request({
        url: `/admin/category/list`,
        method: 'get',
        params: {type: type}
    });
}







