import request from '@/utils/request'
import type { CreateUserForm, UpdateUserForm } from '@/types/user'

export const getUsers = () => {
  return request({
    url: '/api/admin/users',
    method: 'get'
  })
}

export const createUser = (data: CreateUserForm) => {
  return request({
    url: '/api/admin/users',
    method: 'post',
    data
  })
}

export const updateUser = (username: string, data: UpdateUserForm) => {
  return request({
    url: `/api/admin/users/${username}`,
    method: 'put',
    data
  })
}

export const deleteUser = (username: string) => {
  return request({
    url: `/api/admin/users/${username}`,
    method: 'delete'
  })
} 