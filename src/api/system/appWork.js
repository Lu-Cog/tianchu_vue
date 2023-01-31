import request from '@/utils/request'
import { encrypt } from '@/utils/rsaEncrypt'

export function workConFig(data) {
  return request({
    url: '/work/config',
    method: 'get',
    data
  })
}

export function workConFigSet(data) {
  return request({
    url: '/work/configSet',
    method: 'post',
    data
  })
}

