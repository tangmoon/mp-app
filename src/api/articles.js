import {request } from './request'


export function getArticlesPage(options = {}) {
    //return request({ url: '/api/client/price', method: 'POST', data, ...options })
    return request({ url: '/api/articles/page', method: 'POST', data: options })
  }
  
  export function getArticlesDetail(id) {
    return request({ url: '/api/articles/detail?articleId=' + id, method: 'GET'})
  }