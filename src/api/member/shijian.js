import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/appEvent',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/appEvent/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/appEvent/reply',
    method: 'put',
    data
  })
}

export default { add, edit, del }
