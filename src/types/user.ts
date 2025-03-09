export interface User {
  username: string
  userToken: string
  longitude: number
  latitude: number
  vipExpireTime: string
}

export interface CreateUserForm {
  username: string
  password: string
  userToken: string
  longitude: string
  latitude: string
  vipExpireTime: string
}

export interface UpdateUserForm {
  username?: string
  password?: string
  userToken?: string
  longitude?: string
  latitude?: string
  vipExpireTime?: string
} 