import { mockRequest ,request} from './request'

/**
 * 获取微信登录凭证（wx.login 的 code），用于后续换取自建后端的登录态。
 * H5 环境没有 wx.login 能力，返回一个假 code 方便本地联调。
 */
export function getWxLoginCode() {
  // #ifdef MP-WEIXIN
  return new Promise((resolve, reject) => {
    uni.login({
      provider: 'weixin',
      success: (res) => resolve(res.code),
      fail: reject,
    })
  })
  // #endif
  // #ifndef MP-WEIXIN
  return Promise.resolve('mock-wx-login-code')
  // #endif
}

/**
 * 手机号一键登录：小程序端通过 <button open-type="getPhoneNumber"> 拿到 code，
 * 连同 wx.login 的 code 一起交给后端换取手机号并登录/注册。
 * @param {object} params
 * @param {string} params.phoneCode getPhoneNumber 回调里的 e.detail.code
 * @param {string} params.wxCode wx.login 拿到的 code，用于后端识别小程序会话
 * @returns {Promise<{ token: string, userInfo: object }>}
 */
export function wxPhoneLogin({ phoneCode, wxCode }) {
  // tag:--mockapi 替换为真实接口，例如：
  // return request({ url: '/auth/wx-phone-login', method: 'POST', data: { phoneCode, wxCode } })
  return mockRequest({
    token: `mock-token-${phoneCode}`,
    userInfo: { id: 'u_mock_phone', nickname: '手机用户', avatar: '', phone: '138****0000' },
  })
}

/**
 * 账号密码登录。
 * @param {object} params
 * @param {string} params.phone
 * @param {string} params.password
 * @returns {Promise<{ token: string, userInfo: object }>}
 */
export function accountLogin({ phone, password }) {
  // tag:--mockapi 替换为真实接口，例如：
  // return request({ url: '/auth/login', method: 'POST', data: { username, password } })
  if (!phone || !password) {
    return Promise.reject(new Error('账号或密码不能为空'))
  }
  return request({ url: '/api/login', method: 'POST', data: {phone, password} })
  /*return mockRequest({
    token: `mock-token-${username}`,
    userInfo: { id: 'u_mock_account', nickname: username, avatar: '', phone: '' },
  })*/
}


export function logout(){
  return request({url: '/api/logout', method: 'GET'})
}
