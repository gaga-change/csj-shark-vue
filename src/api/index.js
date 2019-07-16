import http from './http'

/** 获取入库计划列表 */
export const getInfoWarehousing = params => http.post('/webApi/plan/in/list', params)
