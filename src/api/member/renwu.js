import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/appWork',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/appWork/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/appWork',
    method: 'put',
    data
  })
}

export function getGps(data) {
  return request({
    url: '/api/appWorkGps/one',
    method: 'post',
    data
  })
}

export default { add, edit, del,getGps }
