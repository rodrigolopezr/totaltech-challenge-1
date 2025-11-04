import axios, { AxiosInstance } from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE_URL
const TOKEN_PATH = import.meta.env.VITE_OAUTH_TOKEN_PATH
const PEDIDO_PATH = import.meta.env.VITE_API_PEDIDO_PATH

const storageKey = 'caasim_token'

export interface TokenResponse {
  access_token: string
  token_type?: string
  expires_in?: number
  refresh_token?: string | null
}

export const getToken = async (username: string, password: string): Promise<TokenResponse> => {
  const url = `${BASE_URL}${TOKEN_PATH}`
  const params = new URLSearchParams({
    grant_type: 'password',
    username,
    password,
  })
  // The Postman collection shows GET with query params
  const { data } = await axios.get<TokenResponse>(url, { params })
  localStorage.setItem(storageKey, JSON.stringify(data))
  return data
}

const instance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 20000,
})

instance.interceptors.request.use((config) => {
  const raw = localStorage.getItem(storageKey)
  if (raw) {
    const token = JSON.parse(raw) as TokenResponse
    config.headers = config.headers ?? {}
    config.headers.Authorization = `Bearer ${token.access_token}`
  }
  return config
})

instance.interceptors.response.use(
  (r) => r,
  async (error) => {
    // You can add token refresh logic here if needed.
    return Promise.reject(error)
  }
)

export const http = instance
export const paths = { PEDIDO_PATH }
