import request from '@/utils/request'
import type { LoginForm } from '@/types/auth'

export const login = (data: LoginForm) => {
  return request({
    url: '/api/admin/auth/login',
    method: 'post',
    data
  })
}

export const changePassword = (data: { currentPassword: string; newPassword: string }) => {
  return request({
    url: '/api/admin/auth/change-password',
    method: 'post',
    data
  })
} 