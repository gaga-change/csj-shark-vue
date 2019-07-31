<template>
  <el-button
    size="mini"
    style="margin-left: 10px;"
    type="primary"
    :loading="downloadLoading"
    :disabled="downloadLoading"
    @click="clickIt"
  >导出列表</el-button>
</template>
<script>
import { exportExcel } from '@/utils/exportexcel'
export default {
  name: 'ExportExecl',
  props: {
    handleMethod: Function,
  },
  data() {
    return {
      downloadLoading: false,
      demo: 123
    }
  },
  methods: {
    clickIt() {
      this.handleMethod.bind(this)()
    }
  }
}
</script>
