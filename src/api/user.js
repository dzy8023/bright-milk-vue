//导入request.js请求工具
import request from '@/utils/request.js';

export const sendMessageService=(message)=>{
    return request({
        url: '/user/user/test',
        method: 'get',
        params: message
    })
}

//用户登录
export const userLoginService = (loginData) => {
    return request({
        url: '/user/user/login',
        method: 'post',
        data: {...loginData}
    });
}

//用户登录
export const userRegisterService = (registerData) => {
    return request({
        url: '/user/user/register',
        method: 'post',
        data: {...registerData}
    });
}

export const userLogout = () => {
    return request.post('/user/user/logout');
}

//用户分页查询
export const userPageQuery = (pageQueryData) => {
    return request({
        url: '/admin/user/page',
        method: 'get',
        params: pageQueryData
    }); 
}
export const deleteUser = (id) => {
    return request({
        url: `/admin/user/${id}` ,
        method: 'delete',
        
    });
}
export const startOrStopUser= (params) => {
    return request({
        url: `/admin/user/status/${params.status}`,
        method: 'post',
        params: {id: params.id}
    });
};
export const userCharge= (params) => {
    return request({
        url: '/admin/user/charge',
        method: 'post',
        data: {...params}
    });
};
export const restPassword=(id)=>{
return request({
    url: `/admin/user/resetPassword/${id}`,
    method: 'put',
})
}

export const destroyUser= () => {
    return request({
        url: '/user/user',
        method: 'delete',
    })
}
export const getUserInfo=()=>{
    return request({
        url: '/user/user/info',
        method: 'get',
    })
}
export const updateUserInfo= (params) => {
    return request({
        url: '/user/user',
        method: 'put',
        data: {...params}
    })
}

