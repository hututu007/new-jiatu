/*
*文件导出方法
**/
export function export2Excel(tableData, excelTile) {
  require.ensure([], () => {
    const { export_json_to_excel } = require('@/vendor/Export2Excel')
    const headList = tableData.headList
    const list = tableData.list
    const tHeader = []
    const filterVal = []
    for (let i = 0; i < headList.length; i++) {
      tHeader.push(headList[i].title)
      filterVal.push(headList[i].name)
    }
    const data = formatJson(filterVal, list)
    export_json_to_excel(tHeader, data, excelTile)
  })
}

export function formatJson(filterVal, jsonData) {
  return jsonData.map(v => filterVal.map(j => v[j]))
}

export function fileDownload(data, fileName) {
  const blob = new Blob([data], {
    type: 'application/octet-stream'
  })
  const filename = fileName || 'filename.xls'
  if (typeof window.navigator.msSaveBlob !== 'undefined') {
    window.navigator.msSaveBlob(blob, filename)
  } else {
    var blobURL = window.URL.createObjectURL(blob)
    var tempLink = document.createElement('a')
    tempLink.style.display = 'none'
    tempLink.href = blobURL
    tempLink.setAttribute('download', filename)
    if (typeof tempLink.download === 'undefined') {
      tempLink.setAttribute('target', '_blank')
    }
    document.body.appendChild(tempLink)
    tempLink.click()
    document.body.removeChild(tempLink)
    window.URL.revokeObjectURL(blobURL)
  }
}
