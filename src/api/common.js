import request from '@/utils/request.js';

export const delImg=(imgUrl)=>{
    return request({
        url: '/admin/common/del' ,
        method: 'delete',
        params: { imgUrl: imgUrl }
    });
}




