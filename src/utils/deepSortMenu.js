export function deepSortMenu(menu,deepSort,notDeep) {
    var arr =[];
    for(var i = 0;i<deepSort.length;i++){
        for(var j=0;j<menu.length;j++){
                if(deepSort[i].code === menu[j].code){
                    arr[deepSort[i].sort] = menu[j]
                    if(!notDeep&&deepSort[i].children&&deepSort[i].children.length>0){
                        arr[deepSort[i].sort].children = deepSortMenu(menu[j].children,deepSort[i].children)
                    }
                }
            }
    }
    
    return arr
  }

export function sortMenu(menu,sort){
    var arr =[];
    menu.map(item=>{
        var a = sort.indexOf(item.code)
        if(a!=-1){
            arr[a]=item
        }
    })
    return arr
}
export const deepSort = [//排序从零开始计数
    { code:'reply',
    sort:2,
    children:null},
  { code:'outgoing',
    sort:0,
    children:null},
    {
        code:'paymentsDelivery',
        sort:1,
        children:[{
            code:'paymentlistDelivery',
            sort:0,
            children:null
        },{
            code:'newpaymentsDelivery',
            sort:1,
            children:null
        }]
    },
   
  ]
export const sort = ['outgoing','reply','paymentsDelivery'] 

export function deepExistMenu(menu,deepExist,notDeep) {
    var arr =[], index = 0;
    if(!Array.isArray(menu)){
        return arr
    }
    for(var i = 0;i<deepExist.length;i++){
        for(var j=0;j<menu.length;j++){
                if(deepExist[i].path === menu[j].path){
                  
                    arr[index] = menu[j]
                    if(!notDeep&&deepExist[i].children&&deepExist[i].children.length>0){
                        arr[index].children = deepExistMenu(menu[j].children,deepExist[i].children)
                    }
                    index++
                }
            }
    }
    
    return arr
  }
  



