import request from '@/utils/request'
import {stringify} from 'qs';

//物流公司列表
export function getLogisticsList(data) {
  return request({
    url: `/webApi/logistics/basic/list?${stringify(data)}`,
    method: 'get',
    // data: stringify(data)
  })
}

//物流公司下拉列表
export function getLogisticsSelectList() {
  return request({
    url: `/webApi/logistics/basic/select/list`,
    method: 'get',
    // data: stringify(data)
  })
}

//增加物流公司
export function addLogistics(data) {
  return request({
    url: `/webApi/logistics/add`,
    method: 'post',
    data: data
  })
}
//修改物流公司
export function updateLogistics(data) {
  return request({
    url: `/webApi/logistics/update`,
    method: 'PUT',
    data: data
  })
}

//删除物流公司
export function deleteLogistics(data) {
  return request({
    url: `/webApi/logistics/delete/${data.id}`,
    method: 'DELETE',
    // data: data
  })
}
//查询物流公司 /webApi/logistics/company/search/{companyName}
//物流公司下拉列表
export function getLogisticsSearch(data) {
  
  return request({
    url: `/webApi/logistics/company/search/${data.companyName}`,
    method: 'get',
    // data: stringify(data)
  })
}


/**
 *
 * 物流登记列表
 * @export
 * @param {*} data
 *  pageNum	int	false	页数
    pageSize	int	false	每页条数
    planCode	string	false	出库计划单号（预约单）
    placeOrderStartDate	date	false	出库计划单下单开始日期
    placeOrderEndDate	date	false	出库计划单下单结束日期
    logisticsComCode	string	false	物流公司编码
    register	boolean	false	是否登记：false(0)-未登记；true(1)-已登记
    ownerName	string	false	货主
 * @returns
 */
export function getLogisticsRegisterList(data) {
  return request({
    url: `/webApi/logistics/register/list?${stringify(data)}`,
    method: 'get',
    // data: stringify(data)
  })
}

/**
 *获取物流信息
 *
 * @export
 * @param {*} data
 * 
 * logisticsRegisterId	int	true	物流配送id
 * logisticComCode	string	true	物流公司编码
 * logisticsOrderCode	string	true	物流单号
 * @returns
 */
export function getLogisticsRegisterInfo(data) {
  return request({
    url: `/webApi/logistics/register/getLogisticsInfo?${stringify(data)}`,
    method: 'get',
    // data: stringify(data)
  })
}

export function addLogisticsRegister(data) {
  return request({
    url: `/webApi/logistics/register/register?${stringify(data)}`,
    method: 'PUT',
    // data: stringify(data)
  })
}