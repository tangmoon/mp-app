/**
 * 统一的网络请求封装。真正接入后端时只需要改这里的 BASE_URL 和错误处理逻辑，
 * src/api/*.js 里的业务函数不需要跟着变。
 */

// tag:--mockapi 后端网关地址，接入真实后端时替换为实际域名，例如 'https://api.changjiang-info.com'
const BASE_URL = ''

function getToken() {
  return uni.getStorageSync('auth')?.token || ''
}

/**
 * @param {object} options
 * @param {string} options.url 相对路径，会拼接到 BASE_URL 后面
 * @param {'GET'|'POST'|'PUT'|'DELETE'} [options.method]
 * @param {object} [options.data]
 * @param {object} [options.header]
 */
export function request({ url, method = 'GET', data, header = {} }) {
  return new Promise((resolve, reject) => {
    const token = getToken()
    uni.request({
      url: BASE_URL + url,
      method,
      data,
      header: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...header,
      },
      success: (res) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data)
        } else {
          reject(res)
        }
      },
      fail: reject,
    })
  })
}

/**
 * 在真实接口接入前，用来模拟网络延迟返回假数据，方便先把页面流程跑通。
 * 真实接口接入后，对应 api 函数体整体替换为 `return request({ ... })`，删掉这个调用即可。
 */
export function mockRequest(data, delay = 500) {
  return new Promise((resolve) => setTimeout(() => resolve(data), delay))
}

export default request
