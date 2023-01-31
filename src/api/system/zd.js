import request from '@/utils/request'
//任务类型
export function rwLx() {
  return request({
    url: '/api/dictDetail?dictName=rwlx',
    method: 'get',
  })
}
//事件类型
export function sjlx() {
  return request({
    url: '/api/dictDetail?dictName=sjlx',
    method: 'get',
  })
}
//请假类型
export function qjlx() {
  return request({
    url: '/api/dictDetail?dictName=qjlx',
    method: 'get',
  })
}
//紧急程度
export function jjcd() {
  return request({
    url: '/api/dictDetail?dictName=jjcd',
    method: 'get',
  })
}
// 工作类型
export function gzlx() {
  return request({
    url: '/api/dictDetail?dictName=gzlx',
    method: 'get',
  })
}
// 职务类型
export function zwlx() {
  return request({
    url: '/api/dictDetail?dictName=zwlx',
    method: 'get',
  })
}

// 	林长职务
export function lzzw() {
  return request({
    url: '/api/dictDetail?dictName=lzzw',
    method: 'get',
  })
}

// 	请假状态
export function qjzt() {
  return request({
    url: '/api/dictDetail?dictName=holiday_status',
    method: 'get',
  })
}

// 	打卡状态
export function dkzt() {
  return request({
    url: '/api/dictDetail?dictName=daka_status',
    method: 'get',
  })
}