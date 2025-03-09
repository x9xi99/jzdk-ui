import { defineStore } from 'pinia'
import { ref } from 'vue'
import { login as loginApi } from '@/api/auth'
import type { LoginForm } from '@/types/auth'

export const useUserStore = defineStore('user', () => {
  const token = ref(localStorage.getItem('admin_token') || '')
  const username = ref(localStorage.getItem('admin_username') || '')

  const login = async (loginForm: LoginForm) => {
    try {
      const { token: newToken, admin } = await loginApi(loginForm)
      token.value = newToken
      username.value = admin.username
      localStorage.setItem('admin_token', newToken)
      localStorage.setItem('admin_username', admin.username)
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    token.value = ''
    username.value = ''
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_username')
  }

  return {
    token,
    username,
    login,
    logout
  }
}) 