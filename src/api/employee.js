import request from '@/utils/request.js';

export const employeeLoginService = (loginData) => {
return request.post('/admin/employee/login', loginData);
}

export const employeeLogout = () => {
    return request.post('/admin/employee/logout');
}

export const employeePageQuery = (pageQueryData) => {
    return request({
        url: '/admin/employee/page',
        method: 'get',
        params: pageQueryData
    }); 
}

export const addEmployee = (params) => {
    return request({
        url: '/admin/employee',
        method: 'post',
        data: {...params}
    });
}
export const deleteEmployee = (id) => {
    return request({
        url: `/admin/employee/${id}` ,
        method: 'delete',
        
    });
}

export const updateEmployee = (params) => {
    return request({
        url: '/admin/employee',
        method: 'put',
        data: {...params}
    });
}

export const startOrStopEmployee= (params) => {
    return request({
        url: `/admin/employee/status/${params.status}`,
        method: 'post',
        params: {id: params.id}
    });
};
export const getEmployeeById = (id) => {
    return request({
        url: `/admin/employee/${id}`,
        method: 'get',
    });
}
export const editPassword = (params) => {
    return request({
        url: `/admin/employee/editPassword`,
        method: 'put',
        params: {oldPassword: params.oldPassword, newPassword: params.newPassword}
    });
}


