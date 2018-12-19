const _import = require('../_import_' + process.env.NODE_ENV)
/* Layout */
import Layout from '../../views/layout/Layout'

export default [
  {
    path: '/inwarehousing',
    component: Layout,
    redirect: 'inwarehousing/arrival',
    meta: { title: '入库管理', noCache: true,icon: 'out' },
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
]
