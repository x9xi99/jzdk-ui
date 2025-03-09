export interface LoginForm {
  username: string
  password: string
}

export interface LoginResponse {
  token: string
  admin: {
    username: string
  }
  expires: {
    expiresIn: string
  }
} 