const _import = require('../_import_' + process.env.NODE_ENV)
/* Layout */
import Layout from '../../views/layout/Layout'

export default [
  {
    path: '/warehousing',
    component: Layout,
    redirect: 'warehousing/receiving',
    meta: { title: '入库管理', noCache: true,icon: 'out' },
    hidden: false,
    children: [
      {
        name: 'receiving',
        path: 'receiving',
        meta: { title: '收货入库', noCache: true },
        component: _import('warehousing/receiving'),
        hidden: false,
      },
      {
        name: 'flow',
        path: 'flow',
        meta: { title: '入库流水', noCache: true },
        component: _import('warehousing/flow'),
        hidden: false,
      },
     
    ]
  },
]
