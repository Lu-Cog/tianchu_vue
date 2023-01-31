import request from '@/utils/request'
import { encrypt } from '@/utils/rsaEncrypt'

//人员添加
export function addNew(data) {
  return request({
    url: 'api/users/add',
    method: 'post',
    data
  })
}
//用户添加
export function add(data) {
  return request({
    url: 'api/users',
    method: 'put',
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

export function editUser(data) {
  return request({
    url: 'api/users/center',
    method: 'put',
    data
  })
}

export function updatePass(user) {
  const data = {
    oldPass: encrypt(user.oldPass),
    newPass: encrypt(user.newPass)
  }
  return request({
    url: 'api/users/updatePass2/',
    method: 'post',
    data
  })
}

export function updateEmail(form) {
  const data = {
    password: encrypt(form.pass),
    email: form.email
  }
  return request({
    url: 'api/users/updateEmail/' + form.code,
    method: 'post',
    data
  })
}
import qs from 'qs'

export function getOne(params) {
  return request({
    url: 'api/users/one?' + qs.stringify(params, { indices: false }),
    method: 'get'
  })
}


export default { add, edit, del,getOne }
