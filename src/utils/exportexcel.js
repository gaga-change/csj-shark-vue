import { parseTime } from '@/utils'
import Vue from 'vue'
const vm = new Vue()
export function exportExcel(exportdata) {
  function formatJson(filterVal, jsonData) {
    return jsonData.map(v => filterVal.map(j => {
      if (j === 'timestamp') {
        return parseTime(v[j])
      } else {
        return v[j]
      }
    }))
  }
  vm.$prompt('请输入导出的表格名称', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    inputPattern: /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/,
    inputErrorMessage: '表格命名不规范'
  }).then(({ value }) => {
    import('@/vendor/Export2Excel').then(excel => {
      const tHeader = exportdata.tHeader
      const filterVal = exportdata.filterVal
      const list = exportdata.list
      const data = formatJson(filterVal, list)
      excel.export_json_to_excel({
        header: tHeader,
        data,
        filename: value,
        autoWidth: true
      })
    })
  })
}
export function exportExcelBlob(name, blobData) {
  const blob = new Blob([blobData]);
  const elink = document.createElement('a');
  elink.download = name ? name + '.xlsx' : '库存台账.xlsx';
  elink.style.display = 'none';
  elink.href = URL.createObjectURL(blob);
  document.body.appendChild(elink);
  elink.click();
  URL.revokeObjectURL(elink.href); // 释放URL 对象
  document.body.removeChild(elink);
}
