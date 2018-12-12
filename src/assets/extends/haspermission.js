import store from '@/store'

//  判断是否含有操作权限
export function hasPermission(permission) {
  const permissions = store.getters.permission_codes ? store.getters.permission_codes : []
  // console.log(permission,permissions,permissions.includes(permission),'operateAuth');
  
  return permissions.includes(permission)
}
