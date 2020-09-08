import qs from 'qs'
import axios from 'axios'
// import router from '@/router'
import { Notify } from 'vant'

// const service = axios.create({
//   timeout: 5000,
//   baseURL: process.env.VUE_APP_BASE_API
// })

const service = axios.create({
  timeout: 10000,
  baseURL: process.env.VUE_APP_BASE_API
})
// request interceptor   Content-Type: application/x-www-form-urlencoded
service.interceptors.request.use(
  config => {
    const token = sessionStorage.getItem('token')
    if (token) config.headers.Authorization = token
    if (config.method === 'post' || config.method === 'put')
      config.data = qs.stringify(config.data, { arrayFormat: 'brackets' })
    return config
  },
  error => Promise.error(error)
)

// response interceptor
service.interceptors.response.use(
  res => (res.status === 200 ? Promise.resolve(res) : Promise.reject(res)),
  error => {
    const { response } = error
    if (response) {
      errorHandle(response.status, response.data.message)
      return Promise.reject(response)
    } else {
      Notify({ type: 'danger', message: '网络故障，连接已断开' })
    }
  }
)

// error
const errorHandle = (status, errMssage) => {
  // swtich status code
  switch (status) {
    case 400:
      Notify({ type: 'danger', message: '请求出现错误' })
      break
    case 401:
      Notify({ type: 'danger', message: '无访问权限' })
      // router.replace({
      //   path: '/login',
      //   query: {
      //     redirect: router.currentRoute.fullPath
      //   }
      // })
      break
    case 403:
      Notify({ type: 'danger', message: '未经授权访问' })
      // sessionStorage.removeItem('token')

      // setTimeout(() => {
      //   router.replace({
      //     path: '/login',
      //     query: {
      //       redirect: router.currentRoute.fullPath
      //     }
      //   })
      // }, 1000)
      break
    case 404:
      Notify({ type: 'danger', message: '请求地址出错' })
      break
    case 408:
      Notify({ type: 'danger', message: '客户端请求超时' })
      break
    case 500:
      Notify({ type: 'danger', message: '服务器内部错误' })
      break
    case 501:
      Notify({ type: 'danger', message: '服务未实现' })
      break
    case 502:
      Notify({ type: 'danger', message: '网关错误' })
      break
    case 503:
      Notify({ type: 'danger', message: '服务不可用' })
      break
    case 504:
      Notify({ type: 'danger', message: '网关超时' })
      break
    case 505:
      Notify({ type: 'danger', message: 'HTTP版本不受支持' })
      break
    default:
      Notify({ type: 'danger', message: errMssage })
  }
}

export default service
