const _import = require('../_import_' + process.env.NODE_ENV)
/* Layout */
import Layout from '../../views/layout/Layout'

export default [
  {
    path: '/inwarehousing',
    component: Layout,
    redirect: 'inwarehousing/arrival',
    meta: { title: '入库管理', noCache: true,icon: 'in' },
    hidden: false,
    children: [
      {
        name: 'planIn',
        path: 'planIn',
        meta: { title: '打印入库计划单', noCache: true },
        component: _import('inwarehousing/planIn'),
        hidden: false,
      },
      {
        name: 'inrecord',
        path: 'inrecord',
        meta: { title: '到货登记', noCache: true },
        component: _import('inwarehousing/inrecord'),
        hidden: false,
      },
      {
        name: 'arrival',
        path: 'arrival',
        meta: { title: '到货单', noCache: false },
        component: _import('inwarehousing/arrival'),
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
      {
        name: 'badproduct',
        path: 'badproduct',
        meta: { title: '残次品记录', noCache: true },
        component: _import('inwarehousing/badproduct'),
        hidden: false
      },
    ]
  },
  {
    path: '/outwarehousing',
    component: Layout,
    redirect: 'outwarehousing/outboundPlan',
    meta: { title: '出库管理',noCache: true,icon: 'out' },
    hidden: false,
    children: [
      {
        name: 'outboundPlan',
        path: 'outboundPlan',
        meta: { title: '出库计划单', noCache: true },
        component: _import('outwarehousing/outboundPlan'),
        hidden: false,
      },
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
    path: '/inventoryLedger',
    component: Layout,
    redirect: 'inventoryLedger/inventory',
    meta: { title: '库存台账', noCache: true,icon: 'download' },
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
    meta: { title: '基础资料',noCache: true,icon: 'info' },
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
    ]
  },
  {
    path: '/deliverInfo',
    component: Layout,
    redirect: 'deliverInfo/deliver',
    meta: { title: '配送管理',noCache: true,icon: 'deliver' },
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
  },
]
