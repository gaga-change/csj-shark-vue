const _import = require('../_import_' + process.env.NODE_ENV)
/* Layout */
import Layout from '../../views/layout/Layout'

export default [
  {
    path: '/inwarehousing',
    component: Layout,
    redirect: 'inwarehousing/arrival',
    meta: { title: '入库管理', noCache: true, icon: 'in' },
    hidden: false,
    children: [
      {
        name: 'inPlanList',
        path: 'inPlanList',
        meta: { title: '入库计划', noCache: true },
        component: _import('inwarehousing/inPlanList'),
        hidden: false,
      },
      {
        name: 'inrecord',
        path: 'inrecord',
        meta: { title: '收货单', noCache: true },
        component: _import('inwarehousing/inrecord'),
        hidden: false,
      },
      {
        name: 'inrecordDetail',
        path: 'inrecordDetail',
        meta: { title: '收货单详情', noCache: false },
        component: _import('inwarehousing/inrecordDetail'),
        hidden: false,
      },
      {
        name: 'goodsTotalList',
        path: 'goodsTotalList',
        meta: { title: '收货汇总', noCache: false },
        component: _import('inwarehousing/goodsTotalList'),
        hidden: false,
      },
      {
        name: 'goodsDetailList',
        path: 'goodsDetailList',
        meta: { title: '收货明细', noCache: false },
        component: _import('inwarehousing/goodsDetailList'),
        hidden: false,
      },
      {
        name: 'record',
        path: 'record',
        meta: { title: '上架记录', noCache: false },
        component: _import('inwarehousing/record'),
        hidden: false,
      },
      {
        name: 'inboundOrder',
        path: 'inboundOrder',
        meta: { title: '入库单', noCache: true },
        component: _import('inwarehousing/inboundOrder'),
        hidden: false,
      },
    ]
  },
  {
    path: '/outwarehousing',
    component: Layout,
    redirect: 'outwarehousing/assignmentPlan',
    meta: { title: '出库管理', noCache: true, icon: 'out' },
    hidden: false,
    children: [
      {
        name: 'assignmentPlan',
        path: 'assignmentPlan',
        meta: { title: '波次分配', noCache: true },
        component: _import('outwarehousing/assignmentPlan'),
        hidden: false,
      },
      {
        name: 'pickingtask',
        path: 'pickingtask',
        meta: { title: '拣货任务', noCache: true },
        component: _import('outwarehousing/pickingtask'),
        hidden: false,
      },
      {
        name: 'temporaryStorage',
        path: 'temporaryStorage',
        meta: { title: '出库暂存', noCache: true },
        component: _import('outwarehousing/temporaryStorage'),
        hidden: false,
      },
      {
        name: 'outboundOrder',
        path: 'outboundOrder',
        meta: { title: '出库单', noCache: true },
        component: _import('outwarehousing/outboundOrder'),
        hidden: false,
      },
    ]
  },
  {
    path: '/qualityTesting',
    component: Layout,
    redirect: 'qualityTesting/record',
    meta: { title: '质检管理', noCache: true, icon: 'deliver' },
    hidden: false,
    children: [
      {
        name: 'qualityTestingRecord',
        path: 'record',
        meta: { title: '质检记录', noCache: true },
        component: _import('qualityTesting/qualityTestingRecord'),
        hidden: false,
      },
      {
        name: 'qualityTestingDetail',
        path: 'detail',
        meta: { title: '质检记录详情', noCache: true },
        component: _import('qualityTesting/qualityTestingDetail'),
        hidden: false,
      },
      {
        name: 'qualityTestingCreate',
        path: 'create',
        meta: { title: '新建质检记录', noCache: true },
        component: _import('qualityTesting/qualityTestingCreate'),
        hidden: false,
      }
    ]
  },
  {
    path: '/takeStock',
    component: Layout,
    redirect: 'takeStock/billing',
    meta: { title: '盘点管理', noCache: true, icon: 'deliver' },
    hidden: false,
    children: [
      {
        name: 'takeStockBilling',
        path: 'billing',
        meta: { title: '盘点开单', noCache: true },
        component: _import('takeStock/takeStockBilling'),
        hidden: false,
      },
      {
        name: 'takeStockBilling',
        path: 'detail',
        meta: { title: '盘点单详情', noCache: true },
        component: _import('takeStock/takeStockDetail'),
        hidden: false,
      },
      {
        name: 'takeStockRecord',
        path: 'record',
        meta: { title: '盘点录入', noCache: true },
        component: _import('takeStock/takeStockRecord'),
        hidden: false,
      },
      {
        name: 'takeStockList',
        path: 'list',
        meta: { title: '盘点单管理', noCache: true },
        component: _import('takeStock/takeStockList'),
        hidden: false,
      }
    ]
  },
  {
    path: '/inventoryLedger',
    component: Layout,
    redirect: 'inventoryLedger/inventory',
    meta: { title: '库存台账', noCache: true, icon: 'download' },
    hidden: false,
    children: [
      {
        name: 'inventory',
        path: 'inventory',
        meta: { title: '库位库存', noCache: true },
        component: _import('inventoryLedger/inventory'),
        hidden: false,
      },

      {
        name: 'stream',
        path: 'stream',
        meta: { title: '库存流水', noCache: true },
        component: _import('inventoryLedger/stream'),
        hidden: false,
      },

    ]
  },
  {
    path: '/baseInfo',
    component: Layout,
    redirect: 'baseInfo/logistics',
    meta: { title: '基础资料', noCache: true, icon: 'info' },
    hidden: false,
    children: [
      {
        name: 'logistics',
        path: 'logistics',
        meta: { title: '物流公司管理', noCache: true },
        component: _import('baseInfo/logistics'),
        hidden: false,
      },
      {
        name: 'inventoryArea',
        path: 'inventoryArea',
        meta: { title: '库区管理', noCache: true },
        component: _import('baseInfo/inventoryArea'),
        hidden: false,
      },
      {
        name: 'inventorySite',
        path: 'inventorySite',
        meta: { title: '库位管理', noCache: true },
        component: _import('baseInfo/inventorySite'),
        hidden: false,
      },
      {
        name: 'productList',
        path: 'productList',
        meta: { title: '商品管理', noCache: true },
        component: _import('baseInfo/productList'),
        hidden: false,
      },
      {
        name: 'containerList',
        path: 'containerList',
        meta: { title: '容器管理', noCache: true },
        component: _import('baseInfo/containerList'),
        hidden: false,
      },
      {
        name: 'packList',
        path: 'packList',
        meta: { title: '包装管理', noCache: true },
        component: _import('baseInfo/packList'),
        hidden: false,
      },
    ]
  },
  {
    path: '/appManage',
    component: Layout,
    redirect: 'appEditionList',
    meta: { title: 'APP管理', noCache: true, icon: 'info' },
    hidden: false,
    children: [
      {
        name: 'appEditionList',
        path: 'appEditionList',
        meta: { title: 'APP版本信息管理', noCache: true },
        component: _import('appManage/appEditionList'),
        hidden: false,
      },
      {
        name: 'modifyAppEdition',
        path: 'modifyAppEdition',
        meta: { title: 'APP版本信息修改', noCache: true },
        component: _import('appManage/modifyAppEdition'),
        hidden: true,
      },
      {
        name: 'newAppEdition',
        path: 'newAppEdition',
        meta: { title: 'APP版本信息新增', noCache: true },
        component: _import('appManage/newAppEdition'),
        hidden: true,
      },
    ]
  },
  {
    path: '/configManage',
    component: Layout,
    redirect: 'enumList',
    meta: { title: '系统配置中心', noCache: true, icon: 'info' },
    hidden: false,
    children: [
      {
        name: 'enumList',
        path: 'enumList',
        meta: { title: '枚举配置', noCache: true },
        component: _import('configManage/enumList'),
        hidden: false,
      }
    ]
  },
  {
    path: '/deliverInfo',
    component: Layout,
    redirect: 'deliverInfo/deliver',
    meta: { title: '配送管理', noCache: true, icon: 'deliver' },
    hidden: false,
    children: [
      {
        name: 'deliver',
        path: 'deliver',
        meta: { title: '物流登记', noCache: true },
        component: _import('deliverInfo/deliver'),
        hidden: false,
      },
    ]
  }
]
