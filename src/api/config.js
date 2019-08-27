import http from './http'

/** 配置接口 */
export const configUserAccount = params => http.get(`/config/user/account`, { ...params, origin: location.origin })