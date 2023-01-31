import request from '@/utils/request'
import qs from 'qs'

export function getIndex(params) {
  return request({
    url: 'api/index?' + qs.stringify(params, { indices: false }),
    method: 'get',
  })
}

export function getIndexMenu(params) {
  return request({
    url: 'api/index/menu?' + qs.stringify(params, { indices: false }),
    method: 'get',
  })
}

export function edit(data) {
  return request({
    url: 'api/index',
    method: 'put',
    data
  })
}

export default { getIndex, getIndexMenu, edit }
