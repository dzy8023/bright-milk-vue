import request from '@/utils/request.js'

export const getShoppingCart = () => {
  return request({
    url: '/user/shoppingCart/list',
    method: 'get'
})
}
export const addShoppingCart = (params) => {
  return request({
    url: '/user/shoppingCart/add',
    method: 'post',
    data:{...params}
})
}

export const subShoppingCart = (params) => {
    return request({
      url: '/api/shoppingCart',
      method: 'post',
      data:{...params}
  })
}

export const cleanShoppingCart = () => {
    return request({
      url: '/user/shoppingCart/clean',
      method: 'delete',
  })
}
export const delShoppingCart = (id) => {
  return request({
    url: '/user/shoppingCart',
    method: 'delete',
    params:{id:id}
})
}




