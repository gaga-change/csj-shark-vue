import http from './http'

/** 配置接口 */
export const configUserAccount = params => http.get(`/config/user/account`, params)
/** 枚举接口 */
export const enumsList = params => http.get(`/config/enums`, { params })
export const enumsAdd = params => http.post(`/config/enums`, params)
export const enumsDetail = id => http.get(`/config/enums/${id}`)
export const enumsDel = id => http.delete(`/config/enums/${id}`)
export const enumsModify = (id, params) => http.put(`/config/enums/${id}`, params)
/** 获取所有枚举（简化字段） */
export const enumsTotal = params => http.get('/config/enums/total', { params })