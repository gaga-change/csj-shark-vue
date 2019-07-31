import axios from 'axios'
import { Message } from 'element-ui'


export default (url, params, fileName) => axios({
  method: 'get',
  url,
  params,
  responseType: 'blob'
}).then(res => {
  if (res.data.type === "application/json") {
    let reader = new FileReader()
    reader.addEventListener("loadend", function () {
      let data = JSON.parse(reader.result)
      Message.error(data.message || '导出失败，请稍后再试！')
    })
    reader.readAsText(res.data)
  } else {
    let blob = new Blob([res.data])
    if (window.navigator.msSaveOrOpenBlob) {
      navigator.msSaveBlob(blob, fileName)
    } else {
      let link = document.createElement("a")
      let evt = document.createEvent("HTMLEvents")
      evt.initEvent("click", false, false)
      link.href = URL.createObjectURL(blob)
      link.download = fileName
      link.style.display = "none"
      document.body.appendChild(link)
      link.click()
      window.URL.revokeObjectURL(link.href)
    }
  }
})