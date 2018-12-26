export function printPlanDataFn(data,params={plan:'outPlanQty',real:'outQty'}){
  if(data&&Array.isArray(data)){
    return data.map(item=>{
      item.planReal = item[params.plan] + '/' + item[params.real]
      item.image = `/webApi/barcode?msg=${item.planCode}&type=code128&fmt=jpeg`
      return item
    })
  }else{
    return []
  }
}