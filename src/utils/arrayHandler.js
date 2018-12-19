/**
 *paramSortArray 通过某一参数字段进行数组的排序
 *
 * @param {*} itemData 需处理的数组
 * @param {*} keyArr 排序的字段 数组
 */
export function paramSortArray(itemData,keyArr){//
  if(!keyArr||keyArr.length<1||!Array.isArray(keyArr)){
    return itemData
  }
  var items = itemData || []
  var filterArr = [], skuCodeObj = {} 
  var len = items.length
  items.map((item,index) => {
    var arrParam = ''
    keyArr.map(key => {
      arrParam += item[key] + '+'
    })
    
    skuCodeObj[arrParam]= skuCodeObj[arrParam] ? skuCodeObj[arrParam] : [];//hash数组
    skuCodeObj[arrParam].push(index)
  })
  console.log(skuCodeObj);
  
  for(var item in skuCodeObj){
    if(skuCodeObj.hasOwnProperty(item)){
      skuCodeObj[item].map(index => {
        filterArr.push(items[index])
      })
    }
  }
  return filterArr
}
/**
 *
 *
 * @export
 * @param {*} arr 原始数据
 * @param {*} uniqueParams 依据哪个参数去重
 */
export function uniqueArray(arr,uniqueParams){
  var uniqueArr = [],hashArr =[];
  if(arr&&Array.isArray(arr)){
    if(!uniqueParams){
      return arr
    }
    arr.map(item => {
      if(!hashArr.includes(item[uniqueParams])){
        hashArr.push(item[uniqueParams]),
        uniqueArr.push(item)
      }
    })
    return uniqueArr
  }else{
    throw new Error('去重数据必须为数组')
  }
}