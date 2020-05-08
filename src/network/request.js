import axios from 'axios'

//1.创建一个axios实例
const service = axios.create({
  baseURL: '/api',
  timeout: 5000,
})

//2.1 request(请求)拦截器:
service.interceptors.request.use(
  config => {
    console.log(config)
    return config
  },
  error => {
    console.log(error)
  }
)

//2.2 response(返回)拦截器:
service.interceptors.response.use(
  response => {
      //可在此处做抛错业务修改
      return response
    },
    error => {
      console.log("请求返回出错")
      return Promise.reject(error)
    }
)

//3.各种网络请求方法封装并导出

/**
 * 封装get方法
 * @param url
 * @param data
 * @returns {Promise}
 */

export function get (url, params = {}) {
  return new Promise((resolve, reject) => {
    service.get(url, {
      params: params
    })
      .then(response => {
        resolve(response.data)
      })
      .catch(err => {
        reject(err)
      })
  })
}

/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function post (url, data = {}) {
  return new Promise((resolve, reject) => {
    service.post(url, data)
      .then(response => {
        resolve(response.data)
      }, err => {
        reject(err)
      })
  })
}

/**
 * 封装patch请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function patch (url, data = {}) {
  return new Promise((resolve, reject) => {
    service.patch(url, data)
      .then(response => {
        resolve(response.data)
      }, err => {
        reject(err)
      })
  })
}

/**
 * 封装put请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function put (url, data = {}) {
  return new Promise((resolve, reject) => {
    service.put(url, data)
      .then(response => {
        resolve(response.data)
      }, err => {
        reject(err)
      })
  })
}
