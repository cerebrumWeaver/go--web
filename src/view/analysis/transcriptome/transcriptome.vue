<template>
  <div>
    <div class="gva-button-box">
      <div class="gva-button-list">
        <el-button size="large" type="primary" link icon="plus" @click="addMenu('0')">新建转录组</el-button>
        <el-divider direction="vertical" style="margin-top: 10px" />
        <el-upload
          class="excel-btn"
          accept=".xlsx, .xls"
          :action="`${path}/trs/importExcel`"
          :headers="{'x-token':userStore.token}"
          :on-success="loadExcel"
          :show-file-list="false"
          :before-upload="beforeUpload"
        >
          <el-button size="large" type="primary" link icon="upload">导入</el-button>
        </el-upload>
        <el-divider direction="vertical" style="margin-top: 10px" />
        <el-button size="large" type="primary" link icon="download" @click="getTemplate">下载模板</el-button>
        <el-button size="large" type="primary" link icon="present" @click="notice">发送邮件</el-button>
      </div>
      <div class="gva-button-list">
        <!--        <el-button size="large" type="primary" link icon="plus" @click="addMenu('0')">新建转录组</el-button>
        <el-divider direction="vertical" style="margin-top: 10px" />
        <el-upload
          class="excel-btn"
          accept=".xlsx, .xls"
          :action="`${path}/trs/importExcel`"
          :headers="{'x-token':userStore.token}"
          :on-success="loadExcel"
          :show-file-list="false"
          :before-upload="beforeUpload"
        >
          <el-button size="large" type="primary" link icon="upload">导入</el-button>
        </el-upload>
        <el-divider direction="vertical" style="margin-top: 10px" />
        <el-button size="large" type="primary" link icon="download" @click="getTemplate">下载模板</el-button>
        <br>-->
        <el-form ref="searchForm" :inline="true" :model="search" style="margin-left: 8px">
          <el-form-item label="物种名字">
            <el-select v-model="search.speciesName" size="small" placeholder="选择物种名字" clearable>
              <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  :disabled="item.disabled"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="样本名称">
            <!--            <el-input v-model="search.sampleName" placeholder="样本名称" />-->
            <el-input v-model="search.sampleName" size="small" autocomplete="off" placeholder="输入样本名称" clearable />
          </el-form-item>
          <el-form-item label="项目类型">
            <!--            <el-input v-model="search.projectType" placeholder="项目类型" />-->
            <el-select v-model="search.projectType" placeholder="选择项目类型" size="small" clearable>
              <el-option
                  v-for="item in options2"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  :disabled="item.disabled"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="项目号">
            <el-input v-model="search.projectNo" size="small" autocomplete="off" placeholder="输入项目号" clearable />
          </el-form-item>
          <el-form-item>
            <el-button size="small" type="primary" link icon="search" @click="onSubmit">查 询</el-button>
            <el-button size="small" type="warning" link icon="refresh" @click="onReset">重 置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="gva-table-box">
<!--      <div class="gva-btn-list">
        &lt;!&ndash;        <el-button size="large" type="primary" link icon="plus" @click="addMenu('0')">新建转录组</el-button>
        <el-divider direction="vertical" style="margin-top: 10px" />
        <el-upload
          class="excel-btn"
          accept=".xlsx, .xls"
          :action="`${path}/trs/importExcel`"
          :headers="{'x-token':userStore.token}"
          :on-success="loadExcel"
          :show-file-list="false"
          :before-upload="beforeUpload"
        >
          <el-button size="large" type="primary" link icon="upload">导入</el-button>
        </el-upload>
        <el-divider direction="vertical" style="margin-top: 10px" />
        <el-button size="large" type="primary" link icon="download" @click="getTemplate">下载模板</el-button>
        <br>&ndash;&gt;
        <el-form ref="searchForm" :inline="true" :model="search" style="margin-left: 8px">
          <el-form-item label="物种名字">
            <el-select v-model="search.speciesName" size="small" placeholder="选择物种名字" clearable>
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                :disabled="item.disabled"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="样本名称">
            &lt;!&ndash;            <el-input v-model="search.sampleName" placeholder="样本名称" />&ndash;&gt;
            <el-input v-model="search.sampleName" size="small" autocomplete="off" placeholder="输入样本名称" clearable />
          </el-form-item>
          <el-form-item label="项目类型">
            &lt;!&ndash;            <el-input v-model="search.projectType" placeholder="项目类型" />&ndash;&gt;
            <el-select v-model="search.projectType" placeholder="选择项目类型" size="small" clearable>
              <el-option
                v-for="item in options2"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                :disabled="item.disabled"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="项目号">
            <el-input v-model="search.projectNo" size="small" autocomplete="off" placeholder="输入项目号" clearable />
          </el-form-item>
          <el-form-item>
            <el-button size="small" type="primary" link icon="search" @click="onSubmit">查 询</el-button>
            <el-button size="small" type="warning" link icon="refresh" @click="onReset">重 置</el-button>
          </el-form-item>
        </el-form>
      </div>-->

      <!-- 由于此处菜单跟左侧列表一一对应所以不需要分页 pageSize默认999 -->
      <el-table :data="tableData" row-key="ID" @sort-change="sortChange" height="600px">
        <el-table-column align="left" label="ID" min-width="30" prop="ID" sortable="custom" />
        <el-table-column align="left" label="物种名字" show-overflow-tooltip min-width="50" prop="speciesName" sortable="custom" />
        <el-table-column align="left" label="样本名称" show-overflow-tooltip min-width="160" prop="sampleName" sortable="custom" />
        <el-table-column align="left" label="项目类型" show-overflow-tooltip min-width="160" prop="projectType" sortable="custom" />
        <el-table-column align="left" label="项目号" show-overflow-tooltip min-width="160" prop="projectNo" sortable="custom" />
        <!--        <el-table-column align="left" label="项目号" show-overflow-tooltip min-width="160" prop="projectNo">
          <template #header>
            <el-input v-model="searchProjectNo" size="small" placeholder="Type to search" />
          </template>
        </el-table-column>-->
        <el-table-column align="left" fixed="right" label="操作" width="300">
          <template #default="scope">
            <el-button
              size="small"
              type="primary"
              link
              icon="edit"
              @click="editInfo(scope.row.ID)"
            >编辑</el-button>
            <el-button
              size="small"
              type="primary"
              link
              icon="delete"
              @click="deleteMenu(scope.row.ID)"
            >删除</el-button>
            <el-button
              size="small"
              type="primary"
              link
              icon="download"
              @click="getPdf(scope.row.ID)"
            >下载</el-button>
            <router-link tag="a" target="_blank" to="/viewReport" style="margin-left: 12px">
              <el-button
                size="small"
                type="primary"
                link
                icon="view"
              >预览</el-button>
            </router-link>
          </template>
        </el-table-column>
      </el-table>
      <div class="gva-pagination">
        <el-pagination
          :current-page="page"
          :page-size="pageSize"
          :page-sizes="[10, 30, 50, 100]"
          :style="{ float: 'right', padding: '20px' }"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        />
      </div>
    </div>
    <el-dialog v-model="dialogFormVisible" draggable :before-close="handleClose" :title="dialogTitle">
      <warning-bar title="注意：项目号必须唯一" />
      <el-form
        v-if="dialogFormVisible"
        ref="menuForm"
        :inline="true"
        :model="form"
        :rules="rules"
        label-position="top"
        label-width="85px"
      >

        <el-form-item label="物种名字" prop="speciesName" style="width:30%">
          <el-select v-model="form.speciesName" placeholder="选择物种名字">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="样本名称" prop="sampleName" style="width:30%">
          <el-input v-model="form.sampleName" autocomplete="off" placeholder="输入样本名称" />
        </el-form-item>
        <el-form-item label="项目类型" prop="projectType" style="width:30%">
          <el-select v-model="form.projectType" placeholder="选择项目类型">
            <el-option
              v-for="item in options2"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="项目号" prop="projectNo" style="width:30%">
          <el-input v-model="form.projectNo" autocomplete="off" placeholder="输入项目号" />
          <!--          <el-input v-model.number="form.projectNo" autocomplete="off" placeholder="输入项目号" />-->
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button size="small" @click="closeDialog">取 消</el-button>
          <el-button size="small" type="primary" @click="enterDialog()">确 定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
// import icon from '@/view/superAdmin/menu/icon.vue'
import warningBar from '@/components/warningBar/warningBar.vue'
import { useUserStore } from '@/pinia/modules/user'
import { reactive, ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { addAnaTrs, getAnaTrs, downloadPDF, downloadTemplate, getAnaTrsById, updateAnaTrs, sendNotification } from '@/api/transcriptome'
import { toSQLLine } from '@/utils/stringFun'
const path = ref(import.meta.env.VITE_BASE_API)
const rules = reactive({
  speciesName: [
    { required: true, message: '请选择物种名字', trigger: 'blur' }
  ],
  sampleName: [
    { required: true, message: '请输入样本名称', trigger: 'blur' }
  ],
  projectType: [
    { required: true, message: '请选择项目类型', trigger: 'blur' }
  ],
  projectNo: [
    { required: true, message: '请输入项目号', trigger: 'blur' }
  ]
})

const userStore = useUserStore()

// 定义表单字段
const form = ref({
  ID: 0,
  speciesName: '',
  sampleName: '',
  projectType: '',
  projectNo: '',
})

const options = ref([
  {
    value: 'homo',
    label: '人类',
  },
  {
    value: 'mouse',
    label: '小鼠',
  },
  {
    value: 'rat',
    label: '大鼠',
  }
])

const options2 = ref([
  {
    value: 'mRNA',
    label: 'mRNA',
  },
  {
    value: 'sRNA',
    label: 'sRNA',
  },
  {
    value: 'lncRNA',
    label: 'lncRNA',
  },
  {
    value: 'circRNA',
    label: 'circRNA',
  },
  {
    value: 'wRNA',
    label: 'wRNA',
  },
])

const page = ref(1)
const total = ref(0)
const pageSize = ref(10)
const search = ref({})
const tableData = ref([])

const onReset = () => {
  search.value = {}
  getTableData()
}

// 搜索
const onSubmit = () => {
  page.value = 1
  pageSize.value = 10
  getTableData()
}

// 分页
const handleSizeChange = (val) => {
  pageSize.value = val
  getTableData()
}

const handleCurrentChange = (val) => {
  page.value = val
  getTableData()
}

// 排序
const sortChange = ({ prop, order }) => {
  if (prop) {
    if (prop === 'ID') {
      prop = 'id'
    }
    search.value.orderKey = toSQLLine(prop)
    search.value.desc = order === 'descending'
  }
  getTableData()
}

// 查询（支持条件查询）
const getTableData = async() => {
  const table = await getAnaTrs({ page: page.value, pageSize: pageSize.value, ...search.value })
  if (table.code === 0) {
    tableData.value = table.data.list
    total.value = table.data.total
    page.value = table.data.page
    pageSize.value = table.data.pageSize
  }
}
getTableData()

const editInfo = async(id) => {
  console.log('我是id：' + id)
  dialogTitle.value = '修改信息'
  const res = await getAnaTrsById({ id })
  form.value = res.data.trs
  isEdit.value = true
  // setOptions()
  dialogFormVisible.value = true
}

// 初始化弹窗内表格方法
const menuForm = ref(null)
const checkFlag = ref(false)
const initForm = () => {
  checkFlag.value = false
  // menuForm.value.resetFields()
  form.value = {
    ID: 0,
    speciesName: '',
    sampleName: '',
    projectType: '',
    projectNo: '',
  }
}
// 关闭弹窗

const dialogFormVisible = ref(false)
const closeDialog = () => {
  initForm()
  dialogFormVisible.value = false
}

// 添加菜单方法，id为 0则为添加根菜单
const isEdit = ref(false)
// const isDelete = ref(false)
const dialogTitle = ref('新增')

// 删除菜单
const deleteMenu = (id) => {
  ElMessageBox.confirm('此操作将永久删除所有角色下该菜单, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async() => {
      // editID.value = id - 0
      // isDelete.value = true
      ElMessage({
        type: 'success',
        message: '测试阶段!'
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '已取消删除'
      })
    })
}

// 添加menu
const editID = ref()
const enterDialog = async() => {
  menuForm.value.validate(async valid => {
    if (valid) {
      let res
      if (isEdit.value) {
        res = await updateAnaTrs(form.value)
      } else {
        res = await addAnaTrs(form.value)
      }
      if (res.code === 0) {
        ElMessage({
          type: 'success',
          message: isEdit.value ? '修改成功' : '添加成功!'
        })
        await getTableData()
      }
      initForm()
      dialogFormVisible.value = false
    }
  })
}

// 添加菜单方法，id为 0则为添加根菜单
const rootMenuitem = ref(true)
const addMenu = (id) => {
  // editID.value = id - 0 // 参数id为行ID字符串，故需减0
  initForm()
  dialogTitle.value = '新增'
  form.value.parentId = String(id)
  isEdit.value = false
  // isDelete.value = false
  dialogFormVisible.value = true
  if (id === '0') {
    rootMenuitem.value = true
  } else {
    rootMenuitem.value = false
  }
}

// 批量 新建转录组
const loadExcel = (response, file, fileList) => {
  console.log('上传成功后信息：')
  console.log(JSON.parse(JSON.stringify(response)))
  console.log(typeof JSON.parse(JSON.stringify(response)))
  // console.log(file)
  // console.log(fileList)
  if (response.code === 0) {
    ElMessage({
      message: response.msg,
      type: 'success'
    })
    // getTableData()
  } else {
    ElMessage({
      message: response.msg,
      type: 'error'
    })
  }
  getTableData()
}

const beforeUpload = (file) => {
  const fileSuffix = file.name.substring(file.name.lastIndexOf('.') + 1)
  const whiteList = ['xls', 'xlsx']

  if (whiteList.indexOf(fileSuffix) === -1) {
    ElMessage({
      message: '上传文件只能是xlsx、xls格式',
      type: 'warning'
    })
    // this.$message.error('上传文件只能是xls、xlsx格式')
    return false
  }
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    ElMessage({
      message: '上传文件大小不能超过 2MB',
      type: 'warning'
    })
    // this.$message.error('上传文件大小不能超过 2MB')
    return false
  }
}

// 下载pdf 多文件请在后台压缩
const getPdf = async(id) => {
  // downloadPdf(tableData.value[id - 1].projectNo + '.txt')
  await downloadPDF(id)
}

// 下载模板
const getTemplate = async() => {
  await downloadTemplate('template.xlsx')
}
// 发送邮件
const notice = async() => {
  sendNotification()
}

// el-dialog弹框关闭操作
const handleClose = (done) => {
  // initForm()
  done()
}
const getHeight = ref()
onMounted(() => {
  // getHeight.value = document.documentElement.clientHeight
  getHeight.value = document.body.clientHeight - 350
})

</script>

<style scoped>
.gva-button-box {
  padding-left: 24px;
  background-color: #fff;
  border-radius: 2px;
}
.gva-button-list {
  margin-bottom: 2px;
  display: flex;
}
</style>
