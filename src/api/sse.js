import request from '@/utils/request.js';

export const adminReminders = (params) => {
    return request({
        url: `/admin/user/message/${params.userId}`,
        method: 'get',
        //除了params.userId字段
        params: { ...params, userId: undefined } // 将 userId 设置为 undefined
    })
}
export const sendMessageService=(message)=>{
    return request({
        url: '/user/user/test',
        method: 'get',
        params: message
    })
}

export const unsubscribeNotice = () => {
    return request.post('/admin/sse/unsubscribe');
}



