import service from '@/utils/request'
import { handleFileError } from './excel'

// @Summary 新增基础transcriptome
// @Produce  application/json
// @Param transcriptome Object
// @Router /trs/addAnaTrs [post]
export const addAnaTrs = (data) => {
  return service({
    url: '/trs/addAnaTrs',
    method: 'post',
    data
  })
}

// @Summary  查询transcriptome
// @Produce  application/json
// @Param transcriptome Object
// @Router /trs/getAnaTrs [post]
export const getAnaTrs = (data) => {
  return service({
    url: '/trs/getTrsList',
    method: 'post',
    data
  })
}

// @Tags excel
// @Summary 下载pdf文件
// @Security ApiKeyAuth
// @accept multipart/form-data
// @Produce  application/json
// @Param fileName query fileName true "选中文件id号"
// @Success 200
// @Router /trs/downloadPdf [get]
export const downloadPDF = (fileName) => {
  return service({
    url: '/trs/downloadPdf',
    method: 'get',
    params: {
      fileName: fileName
    },
    responseType: 'blob'
  }).then((res) => {
    handleFileError(res, fileName)
  })
}

// @Tags excel
// @Summary 下载excel的模板
// @Security ApiKeyAuth
// @accept multipart/form-data
// @Produce  application/json
// @Param fileName query fileName true "模板名称"
// @Success 200
// @Router /trs/downloadPdf [get]
export const downloadTemplate = (excelName) => {
  return service({
    url: '/trs/downloadTemplate',
    method: 'get',
    params: {
      excelName: excelName
    },
    responseType: 'blob'
  }).then((res) => {
    handleFileError(res, excelName)
  })
}

// @Summary  根据ID号查询
// @Produce  application/json
// @Param transcriptome Object
// @Router /trs/getAnaTrsById [post]
export const getAnaTrsById = (data) => {
  return service({
    url: '/trs/getAnaTrsById',
    method: 'post',
    data
  })
}

// @Tags excel
// @Summary 导入Excel文件
// @Security ApiKeyAuth
// @accept multipart/form-data
// @Produce  application/json
// @Param file formData file true "导入Excel文件"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"导入成功"}"
// @Router /excel/importExcel [post]
export const importExcel = () => {
  return service({
    url: '/trs/importExcel',
    method: 'get'
  })
}

// @Summary 修改trs
// @Produce  application/json
// @Param menu Object
// @Router /menu/updateAnaTrs [post]
export const updateAnaTrs = (data) => {
  return service({
    url: '/trs/updateAnaTrs',
    method: 'post',
    data
  })
}
// @Summary 发送邮件
// @Produce  application/json
// @Param menu Object
// @Router /menu/sendNotification [post]
export const sendNotification = (data) => {
  return service({
    url: '/trs/sendNotification',
    method: 'get',
    data
  })
}
