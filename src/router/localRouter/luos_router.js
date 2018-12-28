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
        name: 'arrival',
        path: 'arrival',
        meta: { title: '到货入库', noCache: true },
        component: _import('inwarehousing/arrival'),
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
    redirect: 'outwarehousing/outboundWork',
    meta: { title: '出库管理', noCache: true,icon: 'out' },
    hidden: false,
    children: [
      {
        name: 'outboundWork',
        path: 'outboundWork',
        meta: { title: '出库作业', noCache: true },
        component: _import('outwarehousing/outboundWork'),
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
        meta: { title: '库存台账', noCache: true },
        component: _import('inventoryLedger/inventory'),
        hidden: false,
      },
    ]
  },
  {
    path: '/baseInfo',
    component: Layout,
    redirect: 'baseInfo/logistics',
    meta: { title: '基础资料', noCache: true,icon: 'info' },
    hidden: false,
    children: [
      {
        name: 'logistics',
        path: 'logistics',
        meta: { title: '物流公司', noCache: true },
        component: _import('baseInfo/logistics'),
        hidden: false,
      },
    ]
  },
  {
    path: '/deliverInfo',
    component: Layout,
    redirect: 'deliverInfo/deliver',
    meta: { title: '配送管理', noCache: true,icon: 'deliver' },
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
