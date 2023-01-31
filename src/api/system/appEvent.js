import request from '@/utils/request'
import { encrypt } from '@/utils/rsaEncrypt'


export function addNew(data) {
  return request({
    url: '/api/appEvent',
    method: 'post',
    data
  })
}

export function add(data) {
  return request({
    url: 'api/users',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/users',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/users',
    method: 'put',
    data
  })
}


export default { add, edit, del }
